import { Service } from 'typedi';
import Big from 'big.js';
import PaymentRepository from '../repositories/payment.repository';
import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { IPayment, PaymentTypes, PaymentStatus, IPaymentDocument, IPaymentQuery, IPaymentMethodDocument } from '../interfaces/payment.interface';
import { uuid } from 'uuidv4';
import { IOrderRequest } from '../interfaces/order.interface';
import UserService from './user.service';
import OrderService from './order.service';
import CurrencyService from './currency.service';
import ProductService from './product.service'; 
import CowryService from './cowry.service';
import { LoggerClient } from './logger.service';
import { FlutterwaveProvider } from '../providers';
import { ICurrencyTypes } from '../interfaces/currency.interface';
import { BinancePayProvider } from '../providers/binancePay.provider';
import { BinancePayStatusData, BinancePayWebhookPayload, BinancePaymentStatus } from '../interfaces/responses/binancePay.response.interface';
import { FlutterwaveWebhookPayload } from '../interfaces/responses/flutterwave.response.interface';
import WalletService from './wallet.service';
import { PaymentMethodRepository } from '../repositories';

@Service()
export default class PaymentService {
  constructor(
    public logger: LoggerClient,
    public paymentRepository: PaymentRepository,
    public paymentMethodRepository: PaymentMethodRepository,
    public userService: UserService,
    public orderService: OrderService,
    public cowryService: CowryService,
    public walletService: WalletService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    public flutterwaveProvider: FlutterwaveProvider,
    public binancePayProvider: BinancePayProvider,
  ) { }

  createPayment = async (data: IPayment) => {
    return await this.paymentRepository.create(data);
  };

  private createPaymentLink = async (payment: IPaymentDocument, productID: string) => {
    const user = await this.userService.getCurrentUser({ _id: payment.userId });
    let link: string
    if(!user) throw new BadRequestError("User Not Found")
    if(payment.paymentMethod === PaymentTypes.Flutterwave) {
      link = await this.flutterwaveProvider.generatePaymentLink(payment, user);
    } else if(payment.paymentMethod === PaymentTypes.BinancePay) {
      const product = await this.productService.getProductByCredentials({ _id: productID })
      link = await this.binancePayProvider.generatePaymentLink(payment, user, product);
    } else {
      throw new BadRequestError("Payment Method not Available")
    }

    return { data: link, message: "Payment Link Generated Successfully" };
  };

  private verifyPayment = async (txID: string, paymentMethod: PaymentTypes) => {
    if(paymentMethod === PaymentTypes.Flutterwave) {
      const paymentInfo = await this.flutterwaveProvider.verifyPayment(txID);
      const payment = await this.getPaymentByCredentials({ txRef: paymentInfo.tx_ref });
      if(payment.status !== PaymentStatus.Pending) return null
      const amount = Number(paymentInfo.amount);
      if(paymentInfo.status === "successful"
        && Big(amount).eq(payment.amount)
        && paymentInfo.currency === payment.currency) {
          const paymentResponse = await this.updatePaymentByCredentials(
            { txRef: paymentInfo.tx_ref }, { status: PaymentStatus.Successful});
          return paymentResponse;
      } else throw new BadRequestError("Invalid Payment Data")
    } else if(paymentMethod === PaymentTypes.BinancePay) {
      const payment = await this.getPaymentByCredentials({ _id: txID });
      if(payment.status !== PaymentStatus.Pending) return null
      const paymentInfo = await this.binancePayProvider.verifyPayment(txID);
      if(paymentInfo.status !== "SUCCESS") return null;
      const amount = Number(paymentInfo.data.orderAmount);
      if(Big(amount).eq(payment.amount)&& paymentInfo.data.currency === payment.currency) {
          const paymentResponse = await this.updatePaymentByCredentials(
            { _id: txID }, { status: PaymentStatus.Successful});
          return paymentResponse;
      } else throw new BadRequestError("Invalid Payment Data")
    }
  };

  public completeFlutterwavePayment = async (info: FlutterwaveWebhookPayload) => {
    const { event, data } = info; 
    const txID = data.id.toString();

    if(event === "charge.completed") {
      const payment = await this.verifyPayment(txID, PaymentTypes.Flutterwave);
      if(payment) await this.orderService.completeOrder(payment);
    }
  }; 

  public completeBinancePayPayment = async (info: BinancePayWebhookPayload) => {
    const payload = info as BinancePayWebhookPayload;
    const body = JSON.parse(info.data) as BinancePayStatusData; 
    
    if(payload.bizStatus === BinancePaymentStatus.PAY_SUCCESS) {
      const payment = await this.verifyPayment(body.merchantTradeNo, PaymentTypes.BinancePay);
      if(payment && payment !== null) await this.orderService.completeOrder(payment);
    }
  }; 

  public getAllPayments = async (query: IPaymentQuery) => {
    const { page, limit, status, paymentMethod } = query;
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    let filter: any = { }, sort: any = { createdAt: -1 };
    if(status) filter = { ...filter, status };
    if(paymentMethod) filter = { ...filter, paymentMethod };
    
    return await this.paymentRepository.findAllWithPagination(filter, sort, skip, _limit);
  };

  public initiatePayment = async (orderRequest: IOrderRequest) => {
    try {
      const product = await this.productService.getProductById(orderRequest.productID);
      if(!product) throw new NotFoundError("Product Not Found");

      const paymentMethods = await this.getAvailablePaymentMethods(product.currency, orderRequest.currency);
      const isPaymentMethodSupported = paymentMethods.find(pm => pm.type === orderRequest.paymentMethod);
      if(!isPaymentMethodSupported) throw new BadRequestError("Payment Method Not Supported");

      if(!product.allowedPaymentOptions?.includes(orderRequest.paymentMethod) &&
         orderRequest.paymentMethod !== PaymentTypes.BinancePay) 
          throw new BadRequestError("Unsupported Payment Method")
      if(!product.displayCountries?.includes("GLC") && !product.displayCountries?.includes(orderRequest.country)) 
        throw new BadRequestError("Product Unavailable in your Country");
  
      const order = await this.orderService.createOrder(orderRequest, product); 
      const txRef = uuid();
      let paymentData = {
        orderId: order._id,
        userId: order.userId,
        txRef: txRef,
        currency: order.currency,
        paymentMethod: orderRequest.paymentMethod, 
        amount: order.total
      };
  
      if(orderRequest.paymentMethod === PaymentTypes.BinancePay) {
        if (order.currency !== ICurrencyTypes.US_DOLLARS) {
          const convertFunction = paymentData.currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
          const _amount = await this.currencyService[convertFunction](paymentData.amount, paymentData.currency, ICurrencyTypes.US_DOLLARS);
          paymentData.amount = Number(_amount);
        }
        paymentData.currency = "USDT";
      }
  
      const payment = await this.createPayment(paymentData);
      await this.orderService.updateOrderByCredentials({ _id: order._id }, { paymentId: payment._id });
  
      if(orderRequest.paymentMethod === PaymentTypes.Flutterwave 
        || orderRequest.paymentMethod === PaymentTypes.BinancePay) {
        return await this.createPaymentLink(payment, orderRequest.productID.toString());
      } else if(orderRequest.paymentMethod === PaymentTypes.Cowry) {
        return await this.payWithCowry(payment);
      } else if(orderRequest.paymentMethod === PaymentTypes.Wallet) {
        return await this.payWithWallet(payment);
      }
    } catch (error) {
      throw error;
    }
  };

  private payWithCowry = async (payment: IPaymentDocument) => {
    // Convert amount to USD then to cowry
    const amountCOY = await this.currencyService.convertToCowry(payment.amount, payment.currency);
    // Debit user
    await this.cowryService.debitCowry(Number(amountCOY), payment.userId.toString())
    // Mark payment as successful
    const _rate = Big(payment.amount).div(amountCOY).toFixed(2);
    const rate = `${payment.currency} ${_rate}/${ICurrencyTypes.COWRY}`;
    await this.updatePaymentByCredentials(
      { _id: payment._id }, { status: PaymentStatus.Successful, amount: amountCOY, rate, currency: ICurrencyTypes.COWRY });
    // TODO: Complete order in background
    const order = await this.orderService.completeOrder(payment);
    return { data: order, message: "Payment Via Cowry Successful" };
  };

  private payWithWallet = async (payment: IPaymentDocument) => {
    // Debit user
    if(payment.currency !== ICurrencyTypes.Naira) throw new BadRequestError("Payment Method Not Supported for this order")
    const debitAmount = (Big(payment.amount).times(100)).toFixed(2);
    await this.walletService.debitWallet(payment.userId.toString(), Number(debitAmount), payment._id.toString())
    // Mark payment as successful
    await this.updatePaymentByCredentials(
      { _id: payment._id }, { status: PaymentStatus.Successful, amount: Number(payment.amount) });
    // Complete order
    const order = await this.orderService.completeOrder(payment);
    return { data: order, message: "Payment Via Wallet Balance Successful" };
  };

  public getPaymentsByCredentials = async (data: any) => {
    return await this.paymentRepository.findAll(data);
  };

  public getAllPaymentByCategory = async (data: any) => {
    return await this.paymentRepository.findAll(data);
  };

  public getPaymentByCredentials = async (data: any) => {
    const populate = [
      {
        path: 'userId',
        select: 'email firstName lastName',
        as: "order"
      },
      {
        path: 'orderId',
      },
    ];
    const response = await this.paymentRepository.findOne(data, { populate });
    if (!response) throw new BadRequestError('Payment with the given credential does not exist.');
    return response;
  };

  public updatePaymentByCredentials = async (filter: any, data: any) => {
    return await this.paymentRepository.updateOne(filter, data);
  };

  public getAvailablePaymentMethods = async (productCurrency: string, userCurrency: string) => {
    const filter = { isActive: true };
    const paymentMethods: IPaymentMethodDocument[] = [];
    const activePaymentMethods = await this.paymentMethodRepository.find(filter);
    const p2pcurrencies = await this.currencyService.getAllCurrency({ isP2P: true, base: ICurrencyTypes.US_DOLLARS });

    for(let paymentMethod of activePaymentMethods) {
      if(paymentMethod.currencySupported.includes(ICurrencyTypes.US_DOLLARS)) {
        if(productCurrency === ICurrencyTypes.US_DOLLARS) paymentMethods.push(paymentMethod);
        else {
          const currencyFound = p2pcurrencies.find(currency => currency.code === productCurrency);
          if(currencyFound) paymentMethods.push(paymentMethod);
        }
        continue;    
      }

      if(paymentMethod.currencySupported.includes(productCurrency)) {
        paymentMethods.push(paymentMethod);
        continue;
      }


      if(paymentMethod.currencySupported.includes(userCurrency)) {
        const currencyFound = p2pcurrencies.find(currency => currency.code === userCurrency);
        if(currencyFound) paymentMethods.push(paymentMethod);
        continue;
      }

      if(productCurrency === userCurrency && 
        paymentMethod.currencySupported.includes("wallet")) {
        paymentMethods.push(paymentMethod);
        continue;
      }
    }

    return paymentMethods;
  };
}
