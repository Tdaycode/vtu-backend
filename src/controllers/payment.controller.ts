import { Request } from 'express';
import { Service } from 'typedi';
import { UserService, OrderService, PaymentService } from '../services';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { BadRequestError } from '../utils/ApiError';
import { IOrderRequest } from '../interfaces/order.interface';
import config from '../config/Config';
import { PaymentStatus } from '../interfaces/payment.interface';
import { PaymentTypes } from '../interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';

@Service()
export default class PaymentController {
  constructor(
    public userService: UserService, 
    public orderService: OrderService,
    public paymentService: PaymentService
  ) {}

  public initiatePayment = asyncWrapper(async (req: Request) => {
    const user = req.user;
    const { productID, product_id, amount, recipient, electricityType, type, pin } = req.body;

    const orderRequest: IOrderRequest = {
      productID, product_id, amount, recipient, electricityType, pin,
      country: user.country, userId: user._id, paymentMethod: type, currency: user.currency
    }

    const payment = await this.paymentService.initiatePayment(orderRequest);
    return new SuccessResponse(payment?.data, payment?.message);
  });

  public completeOrder = asyncWrapper(async (req: Request) => {
    const { paymentId } = req.params;
    if(config.activeEnvironment !== "development") throw new BadRequestError("Service Unavailable")
    
    const payment = await this.paymentService.getPaymentByCredentials({ _id: paymentId });
    if(payment) await this.orderService.completeOrder(payment);

    return new SuccessResponse(null, "Payment Verified Successfully");
  });

  public getPayments = asyncWrapper(async (req: Request) => {
    const { page, limit, status, paymentMethod } = req.query as { page: string,  limit: string, status: PaymentStatus, paymentMethod: PaymentTypes };
    const payments = await this.paymentService.getAllPayments({ page, limit, status, paymentMethod });
    return new SuccessResponse(payments, "Payments Fetched Successfully");
  }); 

  public getPaymentsById = asyncWrapper(async (req: Request) => {
    const products = await this.paymentService.getPaymentByCredentials({ _id: req.params.id }); 
    return new SuccessResponse(products, "Payment Fetched Successfully");
  });

  public getAvailablePaymentMethods = asyncWrapper(async (req: Request) => {
    const productCurrency = req.query.productCurrency as string;
    const user = req.user as IUser;
    const result = await this.paymentService.getAvailablePaymentMethods(productCurrency, user.currency); 
    return new SuccessResponse(result, "Available Payment Methods Fetched Successfully"); 
  });
}
