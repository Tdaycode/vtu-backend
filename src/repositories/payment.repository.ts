import { IPaymentDocument, IPayment } from './../interfaces/payment.interface';
import { Payment, PaginatedPayment } from '../models/payment.model';
import { Service } from 'typedi';
import { FilterQuery, QueryOptions } from 'mongoose';

@Service()
export default class PaymentRepository {
  create = async (data:IPayment): Promise<IPaymentDocument> => {
    const payment = new Payment(data);
    return await payment.save();
  };

  findAll = async (filter: any = {}): Promise<IPaymentDocument[]> => {
    return await Payment.find(filter).lean();
  };

  findById = async (id: string): Promise<IPaymentDocument | null> => {
    return await Payment.findById(id);
  };


  findOne = async (filter: FilterQuery<IPaymentDocument>, query: QueryOptions<IPaymentDocument> = {}): Promise<IPaymentDocument | null> => {
    return await Payment.findOne(filter, {}, query);
  };

  updateOne = async (filter: any, data: any): Promise<IPaymentDocument | null> => {
    const response = await Payment.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  findPaymen = async (filter: any, data: any): Promise<IPaymentDocument | null> => {
    const response = await Payment.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  findAllWithPagination = async (filter: any = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      populate: [
        {
          path: 'userId',
          select: 'email firstName lastName',
          as: "order"
        },
        {
          path: 'orderId',
        },
      ],
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedPayment.paginate(filter, options);
  };
}
