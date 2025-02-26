import { Service } from 'typedi';
import Big from 'big.js';
import moment, { unitOfTime } from 'moment';
import countryToCurrency from 'country-to-currency'
import { ProductRepository, OrderRepository } from '../repositories';
import CurrencyService from '../services/currency.service';
import UserService from '../services/user.service';
import NotificationService from '../services/notification.service';
import CowryService from '../services/cowry.service';
import { LoggerClient } from '../services/logger.service';
import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { IOrderRequest, IOrderSummaryRequest, OrderStatus } from '../interfaces/order.interface';
import { PrimeAirtimeProvider } from '../providers';
import { ElectricityType, IProductDocument, ProductTypes } from '../interfaces/product.interface';
import { IPaymentDocument } from '../interfaces/payment.interface';
import { generateOrderNumber } from '../utils/helpers';
import { GiftCardProvider, ServiceProvider } from '../interfaces/provider.interface';
import { AirtimeProviderFactory, DataProviderFactory, InternetProviderFactory, TVProviderFactory, 
  BettingProviderFactory, ElectricityProviderFactory, GiftCardProviderFactory } from './factories';
import { TVTransformer, BettingTransformer, AirtimeTransformer, DataTransformer, 
  ElectricityTransformer, InternetTransformer } from './transformers';

@Service()
export default class OrderService {
  constructor(
    public logger: LoggerClient,
    public orderRepository: OrderRepository,
    public productRepository: ProductRepository,
    public primeAirtimeProvider: PrimeAirtimeProvider,
    public currencyService: CurrencyService,
    public cowryService: CowryService,
    public userService: UserService,
    public notificationService: NotificationService
  ) { }

  createOrder = async (orderRequest: IOrderRequest) => {
    const product = await this.productRepository.findOne({ _id: orderRequest.productID });
    if(!product) throw new NotFoundError("Product Not Found");
    if(!product.allowedPaymentOptions?.includes(orderRequest.paymentMethod)) throw new BadRequestError("Unsupported Payment Method")
    if(!product.displayCountries?.includes("GLC") && !product.displayCountries?.includes(orderRequest.country)) 
      throw new BadRequestError("Product Unavailable in your Country")

    const order = await this.createOrderSummary(orderRequest, product);
    const orderNumber = generateOrderNumber();
    let amountUSD = order.amount;
    if (order.currency !== "USD") {
      const convertFunction = order.currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
      const amount = await this.currencyService[convertFunction](order.amount, order.currency, "USD");
      amountUSD = Number(amount)
    }
    return await this.orderRepository.create({ ...order, orderNumber, userId: orderRequest.userId, amountUSD });
  };

  createOrderSummary = async (orderRequest: IOrderSummaryRequest, product: IProductDocument) => {
    let provider: ServiceProvider | GiftCardProvider, rawInfo: any = {}, validationResult: boolean; let serviceFee = 0;
    const { productID, product_id, amount, recipient, country, electricityType } = orderRequest;

    const providers = product.providers?.filter(item => item.active === true);
    if (!providers || providers.length === 0) throw new BadRequestError("Provider Not available");
    const currentProvider = providers[0].name;
    const serviceId = providers[0].serviceId;
    const productType = product.type;
    let productCurrency = product.currency;
    let productAmount = amount;

    // Validation
    if (product.type === ProductTypes.Electricity && !electricityType) throw new BadRequestError("electricityType required")
    const prepaid = electricityType === ElectricityType.PREPAID ? true : false;

    const rawData = {
      type: productType, validate: true,
      provider: currentProvider, product_id,
      amount, electricityType
    }

    switch (productType) {
      case ProductTypes.Airtime:
        provider = AirtimeProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getAirtimeTopUpInfo(recipient);
        validationResult = AirtimeTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Data:
        provider = DataProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getDataTopUpInfo(recipient);
        validationResult = DataTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Betting:
        provider = BettingProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getBettingInfo(recipient, productType, serviceId, product_id);
        validationResult = BettingTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Electricity:
        provider = ElectricityProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getElectricityInfo(recipient, productType, serviceId, product_id);
        validationResult = ElectricityTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.TV:
        provider = TVProviderFactory.getProvider(currentProvider);
        const productId = providers[0].productId;
        rawInfo = await provider.getTVInfo(recipient, productType, serviceId, productId);
        validationResult = TVTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Internet:
        provider = InternetProviderFactory.getProvider(currentProvider);
        const productId2 = providers[0].productId;
        rawInfo = await provider.getInternetInfo(recipient, productType, serviceId, productId2);
        validationResult = InternetTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.GiftCard:
        provider = GiftCardProviderFactory.getProvider(currentProvider);
        const productId3 = providers[0].productId;
        validationResult = await provider.getCatalogAvailability(productId3, amount);
        break;

      default:
        throw new BadRequestError(`Product Type "${productType}" not found`);
    }

    if (!validationResult) throw new BadRequestError("Invalid Request Data or Product Unavailable");

    if (productType === ProductTypes.GiftCard && product.currency !== "NGN" && product.currency !== "COY") {
      const currency = product.currency || "";
      const price = await this.currencyService.convertCurrency(amount, currency, "NGN");
      const lprice = await this.currencyService.convertLocalCurrency(amount, currency, "NGN");
      productCurrency = "NGN";
      productAmount = (Big(price)).toFixed(2);
      serviceFee = (Big(lprice).minus(price)).toFixed(2)
    }

    if (productType === ProductTypes.GiftCard && providers[0].productId === "cowry") {
      const _productCurrency = product.currency || "";
      if (!country) throw new BadRequestError("Country Required")
      const currency = countryToCurrency[country.toString()];
      if (!currency) throw new BadRequestError("Invalid Country Code")
      const baseCurrency = "USD";

      const pricebaseCurrency = await this.currencyService.convertLocalCurrency(amount, _productCurrency, baseCurrency);
      let price = pricebaseCurrency;

      if (currency !== baseCurrency) {
        const convertFunction = currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
        price = await this.currencyService[convertFunction](parseFloat(pricebaseCurrency), baseCurrency, currency);
      }

      productCurrency = currency;
      productAmount = parseFloat(price);
    }

    const total = (Big(productAmount).plus(serviceFee)).toFixed(2)

    let _order = {
      amount: productAmount, recipient,
      product: {
        id: productID,
        externalId: product_id,
        amount,
        name: product.name,
        provider: currentProvider,
        type: product.type,
      },
      currency: productCurrency,
      serviceFee,
      subTotal: productAmount,
      total,
      additionalInfo: {
        [product.label]: recipient
      },
      prepaid: false
    };
    if (product.type === ProductTypes.Electricity) _order = { ..._order, prepaid: prepaid };

    return _order;
  };

  getAllOrders = async (userId: string, page: string, limit: string, searchTerm: string) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    let filter: any = { userId };
    if (searchTerm) filter = { ...filter, orderNumber: searchTerm };

    return await this.orderRepository.findAllWithPagination(filter, skip, _limit);
  };

  getOrdersByCredentials = async (data: any) => {
    return await this.orderRepository.findAll(data);
  };

  getOrderByCredentials = async (data: any) => {
    const response = await this.orderRepository.findOne(data);
    if (!response) throw new BadRequestError('Order with the given credential does not exist.');
    return response;
  };

  updateOrderByCredentials = async (filter: any, data: any) => {
    return await this.orderRepository.updateOne(filter, data);
  };

  completeOrder = async (payment: IPaymentDocument) => {
    const filter = { _id: payment.orderId, status: OrderStatus.Pending }
    try {
      let response: any = {}, rawData: any, provider: GiftCardProvider | ServiceProvider;
      let status = OrderStatus.Successful;
      let orderStatusMessage = "Successful";

      const order = await this.getOrderByCredentials(filter);
      const product = order.product;
      const productType = product.type;
      const productAmount = product.amount;
      const product_id = product.externalId;

      const _response = await this.productRepository.findOne({ _id: product.id });
      if (!_response) throw Error('Product with the given credential does not exist.');

      // Check Active Provider
      const providers = _response.providers?.filter(item => item.active === true);
      if (!providers || providers.length === 0) throw Error("No Provider available")
      const currentProvider = providers[0].name;

      switch (productType) {
        case ProductTypes.Airtime:
          provider = AirtimeProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
          break;

        case ProductTypes.Data:
          provider = DataProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
          break;

        case ProductTypes.Betting:
          provider = BettingProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
          break;

        case ProductTypes.Electricity:
          provider = ElectricityProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient, { prepaid: order.prepaid });
          break;

        case ProductTypes.TV:
          provider = TVProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
          break;

        case ProductTypes.Internet:
          provider = InternetProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
          break;

        case ProductTypes.GiftCard:
          provider = GiftCardProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(product_id, productAmount, order.recipient);
          break;

        default:
          throw new Error(`Product Type "${productType}" not found`);
      }

      response = rawData.data;
      const cardInfo = rawData.cardInfo;
      const reference = rawData.reference;
      if (rawData.orderStatus) status = rawData.orderStatus;
      if (rawData.orderStatusMessage) orderStatusMessage = rawData.orderStatusMessage;

      const additionalInfo = { ...order.additionalInfo, ...response };
      await this.updateOrderByCredentials(filter, { status, reference, additionalInfo, orderStatusMessage });
      await this.sendTransactionalEmail(payment.orderId.toString(), payment, cardInfo);
    } catch (error: any) {
      console.log(error)
      this.logger.error(error.message)
      await this.updateOrderByCredentials(filter, { status: OrderStatus.Failed, orderStatusMessage: error.message });
    }
  };

  getTransactionVolumeByInterval = async (userId: string, interval: unitOfTime.StartOf) => {
    const startOfDay = moment().startOf(interval);
    const endOfDay = moment().endOf(interval);

    const query = [
      {
        $match: {
          userId,
          status: "successful",
          createdAt: { $gte: startOfDay.toDate(), $lt: endOfDay.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amountUSD' },
        },
      },
    ];

    return await this.orderRepository.aggregate(query);
  };

  private sendTransactionalEmail = async (orderId: string, payment: IPaymentDocument, cardInfo: any) => {
    const order = await this.getOrderByCredentials({ _id: orderId });
    const { currency, amount, product, orderNumber, recipient, userId } = order;
    const user = await this.userService.getUserProfile(userId.toString());

    let emailData = {
      currency, amount,
      name: product.name,
      txRef: orderNumber,
      recipient,
      type: product.type.toUpperCase(),
      paymentMethod: payment.paymentMethod.toUpperCase(),
      date: new Date().toLocaleString(),
      email: user?.email
    };

    if(order.product.type === ProductTypes.GiftCard) {
      emailData = { ...emailData, ...cardInfo };
      return await this.notificationService.sendGiftcardPaymentSuccessEmail(emailData);
    } else {
      return await this.notificationService.sendBillPaymentSuccessEmail(emailData);
    }
  };
}
