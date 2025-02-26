import { Request } from 'express';
import { Service } from 'typedi';

import { UserService, OrderService, PaymentService } from '../services';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { BadRequestError } from '../utils/ApiError';
import { IOrderRequest } from '../interfaces/order.interface';
import { PaymentTypes } from '../interfaces/payment.interface';
import config from '../config/Config';

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
      country: user.country, userId: user._id, paymentMethod: type
    }

    const payment = await this.paymentService.initiatePayment(orderRequest);
    return new SuccessResponse(payment?.data, payment?.message);
  });

  public completeFlutterwavePayment = asyncWrapper(async (req: Request) => {
    const { event, data } = req.body; 
    
    if(event === "charge.completed") {
      const payment = await this.paymentService.verifyPayment(data.id, PaymentTypes.Flutterwave);
      if(payment) await this.orderService.completeOrder(payment);
    }

    return new SuccessResponse(null, "Payment Verified Successfully");
  });

  public completeOrder = asyncWrapper(async (req: Request) => {
    const { paymentId } = req.params;
    if(config.activeEnvironment !== "development") throw new BadRequestError("Service Unavailable")
    
    const payment = await this.paymentService.getPaymentByCredentials({ _id: paymentId });
    if(payment) await this.orderService.completeOrder(payment);

    return new SuccessResponse(null, "Payment Verified Successfully");
  });
}
