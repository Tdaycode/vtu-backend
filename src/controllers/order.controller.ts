import { Request } from 'express';
import { Service } from 'typedi';
import { ObjectId } from 'mongodb'

import UserService from '../services/user.service';
import OrderService from '../services/order.service';
import PaymentService from '../services/payment.service';
import ProductService from '../services/product.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { IOrderSummaryRequest, OrderStatus } from '../interfaces/order.interface';
import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { AccountType, IUserDocument } from '../interfaces/user.interface';
import { ProductTypes } from '../interfaces/product.interface';

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
    const { page, limit, searchTerm, status } = req.query as { page: string,  limit: string, 
      searchTerm: string, status: OrderStatus };
    const user = req.user as IUserDocument;
    const orders = await this.orderService.getAllOrders(user, page, limit, searchTerm, status);
    return new SuccessResponse(orders, "Orders Fetched Successfully");
  });

  public getOrderStats = asyncWrapper(async (req: Request) => {
    const { startDate, endDate, status, monthly } = req.query as { startDate: string,  endDate: string, monthly: string, status: OrderStatus };
    const orders = await this.orderService.getOrderStats(startDate, endDate, status, monthly);
    return new SuccessResponse(orders, "Orders Stats Fetched Successfully");
  });

  public getOrderById = asyncWrapper(async (req: Request) => {
    const user = req.user;
    const userId = req.user._id;
    let filter: any = { _id: new ObjectId(req.params.id) };
    if(user?.accountType === AccountType.USER) {
      filter = { ...filter, userId: new ObjectId(userId) };
    }
    const order = await this.orderService.getOrderByCredentials(filter);
    return new SuccessResponse(order, "Order fetched Successfully");
  });

  public getOrderByRef = asyncWrapper(async (req: Request) => {
    const user = req.user;
    const userId = req.user._id;
    let filter: any = { orderNumber: req.params.id };
    if(user?.accountType === AccountType.USER) {
      filter = { ...filter, userId: new ObjectId(userId) };
    }
    const order = await this.orderService.getOrderByCredentials(filter);
    return new SuccessResponse(order, "Order fetched Successfully");
  });

  public cancelOrder = asyncWrapper(async (req: Request) => {
    const user = req.user;
    const userId = req.user._id;
    let filter: any;
    if(user?.accountType === AccountType.USER) 
      filter = { _id: new ObjectId(req.params.id), userId: new ObjectId(userId) };
    else filter = { _id: new ObjectId(req.params.id) };
    const order = await this.orderService.cancelOrderByCredentials(filter);
    return new SuccessResponse(order, "Order cancelled Successfully"); 
  });

  public refundOrder = asyncWrapper(async (req: Request) => {
    const orderId = req.params.id;
    const order = await this.orderService.getSingleOrder({ _id: orderId });
    if(!order) throw new NotFoundError("Order Not Found");
    await this.orderService.refundUserWallet(order);
    return new SuccessResponse("Order refunded Successfully"); 
  });

  public fulfillOrder = asyncWrapper(async (req: Request) => {
    const orderId = req.params.id;
    const comment = req.body.comment;
    const order = await this.orderService.getSingleOrder({ _id: orderId, status: OrderStatus.Pending, type: ProductTypes.Manual });
    if(!order) throw new NotFoundError("Order Not Found");
    await this.orderService.fulfillManualOrder(order, comment);
    return new SuccessResponse("Order fulfilled Successfully"); 
  });
}
