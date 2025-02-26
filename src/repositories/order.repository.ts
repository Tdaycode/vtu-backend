import { Order, PaginatedOrder } from '../models/order.model';
import { Service } from 'typedi';
import { IOrderDocument, IOrder } from '../interfaces/order.interface';

@Service()
export default class OrderRepository {
  create = async (data: IOrder): Promise<IOrderDocument> => {
    const order = new Order(data);
    return await order.save();
  };

  findAll = async (filter: any = {}): Promise<IOrderDocument[]> => {
    return await Order.find(filter).lean();
  };
  
  findAllWithPagination = async (filter: any = {}, skip: number, limit: number) => {
    const options = {
      sort: { createdAt: -1 },
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedOrder.paginate(filter, options);
  };

  findById = async (id: string): Promise<IOrderDocument | null> => {
    return await Order.findOne({ _id: id });
  };


  findOne = async (filter: any): Promise<IOrderDocument | null> => {
    return await Order.findOne(filter);
  };

  aggregate = async (filter: any[]): Promise<any[]> => {
    return await Order.aggregate(filter);
  };

  updateOne = async (filter: any, data: any): Promise<IOrderDocument | null> => {
    const response = await Order.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
