import { Service } from 'typedi';
import Big from 'big.js';
import moment, { unitOfTime } from 'moment';
import countryToCurrency from 'country-to-currency'
import { ProductRepository, OrderRepository, PaymentRepository, UserRepository } from '../repositories';
import CurrencyService from '../services/currency.service';
import NotificationService from '../services/notification.service';
import CowryService from '../services/cowry.service';
import { LoggerClient } from '../services/logger.service';
import { BadRequestError } from '../utils/ApiError';
import { IOrderDocument, IOrderRequest, IOrderSummaryRequest, OrderStatus } from '../interfaces/order.interface';
import { PrimeAirtimeProvider } from '../providers';
import { DiscountAmountType, DiscountType, ElectricityType, IProductDocument, PaymentTypes, ProductTypes, ServiceFeeAmountType } from '../interfaces/product.interface';
import { IPaymentDocument, PaymentStatus } from '../interfaces/payment.interface';
import { generateOrderNumber } from '../utils/helpers';
import { GiftCardProvider, IFulfillOrder, IGetServiceInfo, ManualProductProvider, ServiceProvider } from '../interfaces/provider.interface';
import { AirtimeProviderFactory, DataProviderFactory, InternetProviderFactory, TVProviderFactory, 
  BettingProviderFactory, ElectricityProviderFactory, GiftCardProviderFactory, ManualProviderFactory } from './factories';
import { TVTransformer, BettingTransformer, AirtimeTransformer, DataTransformer, 
  ElectricityTransformer, InternetTransformer } from './transformers';
import SettingsRepository from '../repositories/settings.repository';
import { SettingsType } from '../interfaces/settings.interface';
import { AccountType, IUserDocument } from '../interfaces/user.interface';
import WalletService from './wallet.service';
import { FilterQuery } from 'mongoose';
import { TransactionStatus, Transactiontype } from '../interfaces/cowry-transaction.interface';

@Service()
export default class OrderService {
  constructor(
    public logger: LoggerClient,
    public orderRepository: OrderRepository,
    public settingsRepository: SettingsRepository,
    public productRepository: ProductRepository,
    public paymentRepository: PaymentRepository,
    public primeAirtimeProvider: PrimeAirtimeProvider,
    public currencyService: CurrencyService,
    public cowryService: CowryService,
    public userRepository: UserRepository,
    public walletService: WalletService,
    public notificationService: NotificationService
  ) { }

  createOrder = async (orderRequest: IOrderRequest, product: IProductDocument) => {
    try {  
      const order = await this.createOrderSummary(orderRequest, product);
      const orderNumber = generateOrderNumber();
      let amountUSD = order.amount;
      if (order.currency !== "USD") {
        const convertFunction = order.currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
        const amount = await this.currencyService[convertFunction](order.amount, order.currency, "USD");
        amountUSD = Number(amount)
      }
      const serviceFee = Number(order.serviceFee)
      return await this.orderRepository.create({ ...order, serviceFee,
        orderNumber, userId: orderRequest.userId, amountUSD });
      
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestError(error.message);
    }
  };

  createOrderSummary = async (orderRequest: IOrderSummaryRequest, product: IProductDocument) => {
    try {
      let provider: ServiceProvider | GiftCardProvider | ManualProductProvider, rawInfo: any = {}, validationResult: boolean;
      const { productID, product_id, amount, recipient, country, electricityType } = orderRequest;
      let finalProductID = product_id;
  
      const providers = product.providers?.filter(item => item.active === true);
      if (!providers || providers.length === 0) throw new BadRequestError("Provider Not available");
      const currentProvider = providers[0].name;
      const serviceId = providers[0].serviceId;
      const productType = product.type;
  
      // Validation
      if (product.type === ProductTypes.Electricity && !electricityType) throw new BadRequestError("electricityType required")
      const prepaid = electricityType === ElectricityType.PREPAID ? true : false;
  
      const rawData = {
        product: product,
        type: productType, validate: true,
        provider: currentProvider, product_id,
        amount, electricityType
      }

      const servicePayload: IGetServiceInfo = { receipient: recipient, productType, serviceId, product_id };
  
      switch (productType) {
        case ProductTypes.Airtime:
          provider = AirtimeProviderFactory.getProvider(currentProvider);
          rawInfo = await provider.getAirtimeTopUpInfo(recipient, product_id);
          validationResult = AirtimeTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;
  
        case ProductTypes.Data:
          provider = DataProviderFactory.getProvider(currentProvider);
          rawInfo = await provider.getDataTopUpInfo(recipient);
          validationResult = DataTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;
  
        case ProductTypes.Betting:
          provider = BettingProviderFactory.getProvider(currentProvider);
          rawInfo = await provider.getBettingInfo(servicePayload);
          validationResult = BettingTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;
  
        case ProductTypes.Electricity:
          provider = ElectricityProviderFactory.getProvider(currentProvider);
          rawInfo = await provider.getElectricityInfo(servicePayload);
          validationResult = ElectricityTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;
  
        case ProductTypes.TV:
          provider = TVProviderFactory.getProvider(currentProvider);
          finalProductID = providers[0].productId;
          rawInfo = await provider.getTVInfo({ ...servicePayload, product_id: finalProductID });
          validationResult = TVTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;
  
        case ProductTypes.Internet:
          provider = InternetProviderFactory.getProvider(currentProvider);
          finalProductID = providers[0].productId;
          rawInfo = await provider.getInternetInfo({ ...servicePayload, product_id: finalProductID });
          validationResult = InternetTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
          break;

        case ProductTypes.GiftCard:
          provider = GiftCardProviderFactory.getProvider(currentProvider); 
          finalProductID = providers[0].productId;
          validationResult = await provider.getCatalogAvailability(finalProductID, amount);
          break;
  
        case ProductTypes.Manual:
          provider = ManualProviderFactory.getProvider(currentProvider); 
          validationResult = provider.getManualProductAvailability();
          break;
  
        default:
          throw new BadRequestError(`Product Type "${productType}" not found`);
      }
  
      if (!validationResult) throw new BadRequestError("Invalid Request Data or Product Unavailable");
  
      const { productCurrency, serviceFee, productAmount } = await this.calculateServiceFee(product, amount, country);
      const subTotal = (Big(productAmount).plus(serviceFee)).toFixed(2);
      const discount = await this.calculateOrderDiscount(product, productAmount);
      const total = (Big(subTotal).minus(discount)).toFixed(2);
  
      let _order = {
        amount: productAmount, recipient,
        product: {
          id: productID,
          externalId: finalProductID, 
          amount,
          name: product.name,
          imageUrl: product.imageUrl,
          provider: currentProvider,
          type: product.type,
        },
        currency: productCurrency,
        serviceFee, subTotal,
        total, discount,
        additionalInfo: {
          [product.label]: recipient
        },
        prepaid: false
      };
      if (product.type === ProductTypes.Electricity) _order = { ..._order, prepaid: prepaid };
  
      return _order;
    } catch (error) {
      throw error;
    }
  };

  private calculateOrderDiscount = async (product: IProductDocument, productAmount: number) => {
    let discountAmount = 0;
    if(product.discount) {
      if(product.discount.type === DiscountType.Global) {
        const settings = await this.settingsRepository.findOne({ type: SettingsType.globalDiscount });
        if(settings.active) discountAmount = settings.value * productAmount;
      } else {
        if(product.discount.active) {
          if(product.discount.mode === DiscountAmountType.Flat) 
            discountAmount = product.discount.value;
          else if(product.discount.mode === DiscountAmountType.Percentage) 
            discountAmount = product.discount.value * productAmount;
        }
      }
    }
    return Number(discountAmount.toFixed(2));
  };

  private calculateServiceFee = async (product: IProductDocument, productAmount: number, country: string) => {
    let serviceFee = 0, productCurrency = product.currency;

    if((product.type === ProductTypes.GiftCard || product.type === ProductTypes.Manual) && product.currency !== "NGN" && product.currency !== "COY") {
      let lprice = "0";
      const currency = product.currency || "";
      const price = await this.currencyService.convertCurrency(productAmount, currency, "NGN");

      if (currency === "USD") {
        lprice = await this.currencyService.convertLocalCurrency(productAmount, currency, "NGN");
        // lprice = await this.currencyService.convertNGNCurrency(productAmount, "USD");
      } else {
        // TODO: Implement this
        lprice = price;
        // lprice = await this.currencyService.convertCurrencyToNGN(productAmount, currency);
      }

      productCurrency = "NGN";
      productAmount = Number((Big(price)).toFixed(2));
      serviceFee = Number((Big(lprice).minus(price)).toFixed(2));
    }

    if(product.type === ProductTypes.GiftCard && product.providers && product.providers[0].productId === "cowry") {
      const _productCurrency = product.currency || "";
      if (!country) throw new BadRequestError("Country Required")
      const currency = countryToCurrency[country.toString()];
      if (!currency) throw new BadRequestError("Invalid Country Code")
      const baseCurrency = "USD";

      const pricebaseCurrency = await this.currencyService.convertLocalCurrency(productAmount, _productCurrency, baseCurrency);
      let price = pricebaseCurrency;
  
      if (currency !== baseCurrency) {
        const convertFunction = currency === "NGN" ? "convertNGNCurrency" : "convertCurrency";
        price = await this.currencyService[convertFunction](parseFloat(pricebaseCurrency), baseCurrency, currency);
      }

      productCurrency = currency;
      productAmount = parseFloat(price);
    }
    
    if(product?.serviceFee && product.serviceFee.active && serviceFee === 0) {
      if(product.serviceFee.type === ServiceFeeAmountType.Flat) 
        serviceFee = product.serviceFee.value;
      else if(product.serviceFee.type === ServiceFeeAmountType.Percentage) 
        serviceFee = product.serviceFee.value * productAmount;
    }
    
    return { productCurrency, serviceFee: (Big(serviceFee)).toFixed(2), productAmount };
  };

  getAllOrders = async (user: IUserDocument, page: string, limit: string, searchTerm: string, status: OrderStatus) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    let filter: any = { userId: user._id };
    const populate = [
      {
        path: 'userId',
        select: 'firstName lastName'
      },
      {
        path: 'paymentId',
        select: 'txRef paymentMethod status'
      },
    ];
    if(user.accountType === AccountType.ADMIN) filter = {};
    if (searchTerm) filter = { ...filter, orderNumber: searchTerm };
    if(status) { filter = { ...filter, status }; }

    return await this.orderRepository.findAllWithPagination(filter, populate, skip, _limit);
  };

  public getOrderStats = async (startDate: string, endDate: string, status: OrderStatus, monthly: string) => {
    let _id: any = null;

    let filter: FilterQuery<IOrderDocument> = {};

    filter = {
      ...filter,
      status: OrderStatus.Successful
    };

    if(startDate && endDate) {
      const _startDate = new Date(startDate);
      const _endDate = new Date(endDate);
      
      filter = {
        ...filter,
        createdAt: {
          $gte: moment(_startDate).startOf('day').toDate(),
          $lt: moment(_endDate).endOf('day').toDate(),
        },
      };
    }

    if(monthly === "true") {
      _id = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    }

    if(status) { filter = { ...filter, status }; };
    
    const aggregation = [
      {
        $match: filter
      },
      {
        $group: {
          _id,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalAmountUSD: { $sum: "$amountUSD" }
        }
      },
      {
        $project: {
          totalOrders: 1,
          totalAmountNGN: 1,
          totalAmountUSD: 1,
        }
      }
    ];

    return await this.orderRepository.aggregate(aggregation);
  };

  getOrdersByCredentials = async (data: any) => {
    return await this.orderRepository.findAll(data);
  };

  getOrderByCredentials = async (data: FilterQuery<IOrderDocument>) => {
     const populate = [
      {
        path: 'userId',
        select: 'firstName lastName userName'
      },
      {
        path: 'paymentId',
        select: 'txRef paymentMethod currency rate amount status'
      },
    ];
    const response = await this.orderRepository.findOne(data, { populate });
    if (!response) throw new BadRequestError('Order with the given credential does not exist.');
    return response;
  };

  getSingleOrder = async (data: FilterQuery<IOrderDocument>) => {
   const response = await this.orderRepository.findOne(data);
   if (!response) throw new BadRequestError('Order with the given credential does not exist.');
   return response;
 };

  updateOrderByCredentials = async (filter: any, data: any) => {
    return await this.orderRepository.updateOne(filter, data);
  };

  cancelOrderByCredentials = async (filter: FilterQuery<IOrderDocument>) => {
    return await this.orderRepository.updateOne(
      { ...filter, status: OrderStatus.Pending }, { status: OrderStatus.Cancelled });
  };

  completeOrder = async (payment: IPaymentDocument) => {
    const filter = { _id: payment.orderId, status: OrderStatus.Pending };
    let order: IOrderDocument | null = null;

    try {
      let response: any = {}, rawData: any, provider: GiftCardProvider | ServiceProvider | ManualProductProvider;
      let status = OrderStatus.Successful;
      let orderStatusMessage = "Successful";

      order = await this.orderRepository.findOne(filter);
      if(!order) return;
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
      const fulfillPayload: IFulfillOrder = { productType, productId: product_id, amount: productAmount, order };

      if(productType === ProductTypes.Manual) return true;

      switch (productType) {
        case ProductTypes.Airtime:
          provider = AirtimeProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.Data:
          provider = DataProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.Betting:
          provider = BettingProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.Electricity:
          provider = ElectricityProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.TV:
          provider = TVProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.Internet:
          provider = InternetProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        case ProductTypes.GiftCard:
          provider = GiftCardProviderFactory.getProvider(currentProvider);
          rawData = await provider.fulfillOrder(fulfillPayload);
          break;

        default:
          throw new Error(`Product Type "${productType}" not found`);
      }

      if(rawData?.orderStatus || !rawData?.reference) {
        throw new Error(rawData?.orderStatusMessage || "Something went wrong")
      }

      response = rawData.data;
      const cardInfo = rawData.cardInfo;
      const reference = rawData.reference;
      if (rawData.orderStatus) status = rawData.orderStatus;
      if (rawData.orderStatusMessage) orderStatusMessage = rawData.orderStatusMessage;

      const additionalInfo = { ...order.additionalInfo, ...response };
      await this.updateOrderByCredentials(filter, { status, reference, additionalInfo, orderStatusMessage });
      await this.sendTransactionalEmail(order, payment, cardInfo);
    } catch (error: any) {
      this.logger.error(error.message)
      // Update Order Status
      await this.updateOrderByCredentials(filter, { status: OrderStatus.Failed, orderStatusMessage: error.message });
      // Refund User
      if(order) await this.refundUserWallet(order);
    }
  };

  public refundUserWallet = async (order: IOrderDocument) => {
    try {
      const { orderNumber, reference = "" } = order;
      const userId = order.userId.toString();
      const description =  `Wallet Refund for Order #${orderNumber}`;
      const payment = await this.paymentRepository.findById((order.paymentId).toString());
      if(!payment) throw Error("Payment Method Not Found");
      const refundableAmount = payment.amount;

      if(payment.status === PaymentStatus.Refunded)  
        throw new Error("Order Already Refunded");

      if(order.status !== OrderStatus.Successful) {
        if(payment.paymentMethod === PaymentTypes.Cowry){
          await this.cowryService.creditCowry(userId, refundableAmount);
          await this.cowryService.recordCowryTransaction(userId, Transactiontype.Credit, 
            TransactionStatus.Successful, refundableAmount, description);
        } else if(((payment.currency === "USD" || payment.currency === "USDT") && payment.paymentMethod !== PaymentTypes.Wallet)
        ){
          const amountCOY = await this.currencyService.convertToCowry(refundableAmount, "USD"); 
          await this.cowryService.recordCowryTransaction(userId, Transactiontype.Credit, 
            TransactionStatus.Successful, refundableAmount, description);
          await this.cowryService.creditCowry(userId, Number(amountCOY));
        } else {
          await this.walletService.creditWallet(userId, refundableAmount * 100, reference, description);
        } 

        await this.orderRepository.updateOne({ _id: order._id }, { status: OrderStatus.Cancelled });
        await this.paymentRepository.updateOne({ _id: payment._id }, { status: PaymentStatus.Refunded });
      } else {
        throw new BadRequestError("Order Cannot be Refunded");
      }     

      // TODO: Notify the User
    } catch (error: any) {
      this.logger.error(`Refund Failed, Order Ref:${order.reference}, Reason: ${error.message}`) 
    }
  };

  public fulfillManualOrder = async (order: IOrderDocument, comment: string) => {
    try {
      const payment = await this.paymentRepository.findById((order.paymentId).toString());
      if(!payment) throw Error("Payment Method Not Found");

      const payload = {
        status: OrderStatus.Successful,
        additionalInfo: { ...order.additionalInfo, comment }
      };
      await this.orderRepository.updateOne({ _id: order._id }, payload);
      await this.sendTransactionalEmail(order, payment, payload.additionalInfo);
    } catch (error: any) { 
      const errorMessage = `Manual Order Fulfillment Failed, Ref:${order.reference}, Reason: ${error.message}`;
      this.logger.error(errorMessage); 
      throw new BadRequestError(errorMessage);
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

    const result = await this.orderRepository.aggregate(query);
    return result[0]?.totalAmount ?? 0;
  };

  private sendTransactionalEmail = async (order: IOrderDocument, payment: IPaymentDocument, cardInfo: any) => {
    const { currency, amount, product, orderNumber, recipient, userId } = order;
    const user = await this.userRepository.getUserProfile(userId.toString());

    let emailData = {
      currency, amount,
      name: product.name,
      amountPaid: order.total,
      discount: order?.discount ?? "0",
      serviceFee: order?.serviceFee ?? "0",
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
    } if(order.product.type === ProductTypes.Manual) {
      emailData = { ...emailData, ...cardInfo };
      return await this.notificationService.sendManualProductFulfillmentEmail(emailData);
    } else {
      return await this.notificationService.sendBillPaymentSuccessEmail(emailData);
    }
  };
}
