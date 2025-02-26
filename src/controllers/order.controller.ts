import { Request } from 'express';
import { Service } from 'typedi';
import { ObjectId } from 'mongodb'

import UserService from '../services/user.service';
import OrderService from '../services/order.service';
import PaymentService from '../services/payment.service';
import ProductService from '../services/product.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { IOrderSummaryRequest } from '../interfaces/order.interface';
import { BadRequestError } from '../utils/ApiError';

@Service()
export default class OrderController {
  constructor(
    public userService: UserService, 
    public orderService: OrderService,
    public paymentService: PaymentService,
    public productService: ProductService,
  ) {}

  public createOrderSummary = asyncWrapper(async (req: Request) => {
    const { productID, product_id, amount, recipient, electricityType } = req.body;
    const { country } = req.query as { country: string };
    if(!country) throw new BadRequestError("Country Required")

    const orderRequest: IOrderSummaryRequest  = {
      productID, product_id, amount, recipient, electricityType, country
    }
    
    const product = await this.productService.getProductByCredentials({ _id: new ObjectId(productID) });
    const order = await this.orderService.createOrderSummary(orderRequest, product); 
    return new SuccessResponse(order, "Order Summary Created Successfully, Proceed to pay");
  });

  public getAllOrders = asyncWrapper(async (req: Request) => {
    const { page, limit, searchTerm } = req.query as { page: string,  limit: string, searchTerm: string};
    const userId = req.user._id;
    const orders = await this.orderService.getAllOrders(userId, page, limit, searchTerm);
    return new SuccessResponse(orders, "Orders Fetched Successfully");
  });

  public getOrderById = asyncWrapper(async (req: Request) => {
    const userId = req.user._id;
    const order = await this.orderService.getOrderByCredentials({ _id: new ObjectId(req.params.id), userId: new ObjectId(userId) });
    return new SuccessResponse(order, "Order fetched Successfully");
  });
}
