import { Service } from 'typedi';
import PaymentRepository from '../repositories/payment.repository';
import { BadRequestError } from '../utils/ApiError';
import { IPayment, PaymentTypes, PaymentStatus, IPaymentDocument } from '../interfaces/payment.interface';
import { uuid } from 'uuidv4';
import { IOrderRequest } from '../interfaces/order.interface';
import UserService from './user.service';
import OrderService from './order.service';
import CurrencyService from './currency.service';
import CowryService from './cowry.service';
import { LoggerClient } from './logger.service';
import { FlutterwaveProvider } from '../providers';
import { ICurrencyTypes } from '../interfaces/currency.interface';

@Service()
export default class PaymentService {
  constructor(
    public logger: LoggerClient,
    public paymentRepository: PaymentRepository,
    public userService: UserService,
    public orderService: OrderService,
    public cowryService: CowryService,
    public currencyService: CurrencyService,
    public flutterwaveProvider: FlutterwaveProvider,
  ) { }

  createPayment = async (data: IPayment) => {
    return await this.paymentRepository.create(data);
  };

  private createPaymentLink = async (payment: IPaymentDocument) => {
    const user = await this.userService.getCurrentUser({ _id: payment.userId });
    let link: string
    if(payment.paymentMethod === PaymentTypes.Flutterwave) {
      if(!user) throw new BadRequestError("User Not Found")
      link = await this.flutterwaveProvider.generatePaymentLink(payment, user);
    } else {
      throw new BadRequestError("Payment Method not Available")
    }

    return { data: link, message: "Payment Link Generated Successfully" };
  };

  verifyPayment = async (txID: string, paymentMethod: PaymentTypes) => {
    if(paymentMethod === PaymentTypes.Flutterwave) {
      const paymentInfo = await this.flutterwaveProvider.verifyPayment(txID);
      const payment = await this.getPaymentByCredentials({ txRef: paymentInfo.tx_ref });
      const amount = Number(paymentInfo.amount);
      if(paymentInfo.status === "successful"
        && amount === payment.amount
        && paymentInfo.currency === payment.currency) {
          const paymentResponse = await this.updatePaymentByCredentials(
            { txRef: paymentInfo.tx_ref }, { status: PaymentStatus.Successful});
          return paymentResponse;
      } else {
        throw new BadRequestError("Payment Method not Available")
      }
    }
  };

  getAllPayments = async () => {
    return await this.paymentRepository.findAll();
  };

  public initiatePayment = async (orderRequest: IOrderRequest) => {
    const order = await this.orderService.createOrder(orderRequest); 
    const txRef = uuid();
    const paymentData = {
      orderId: order._id,
      userId: order.userId,
      txRef: txRef,
      currency: order.currency,
      paymentMethod: orderRequest.paymentMethod,
      amount: order.total
    };

    const payment = await this.createPayment(paymentData);
    await this.orderService.updateOrderByCredentials({ _id: order._id }, { paymentId: payment._id });

    if(orderRequest.paymentMethod === PaymentTypes.Flutterwave) {
      return await this.createPaymentLink(payment);
    } else if(orderRequest.paymentMethod === PaymentTypes.Cowry) {
      return await this.payWithCowry(payment);
    }
  };

  private payWithCowry = async (payment: IPaymentDocument) => {
    // Convert amount to USD then to cowry
    const amountCOY = await this.currencyService.convertToCowry(payment.amount, payment.currency);
    // Debit user
    await this.cowryService.debitCowry(Number(amountCOY), payment.userId.toString())
    // Mark payment as successful
    await this.updatePaymentByCredentials(
      { _id: payment._id }, { status: PaymentStatus.Successful, amount: amountCOY, currency: ICurrencyTypes.COWRY });
    // Complete order
    const order = await this.orderService.completeOrder(payment);
    return { data: order, message: "Payment Via Cowry Successful" };
  };

  getPaymentsByCredentials = async (data: any) => {
    return await this.paymentRepository.findAll(data);
  };

  getAllPaymentByCategory = async (data: any) => {
    return await this.paymentRepository.findAll(data);
  };

  getPaymentByCredentials = async (data: any) => {
    const response = await this.paymentRepository.findOne(data);
    if (!response) throw new BadRequestError('Payment with the given credential does not exist.');
    return response;
  };

  updatePaymentByCredentials = async (filter: any, data: any) => {
    return await this.paymentRepository.updateOne(filter, data);
  };
}
