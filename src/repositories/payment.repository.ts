import { IPaymentDocument, IPayment } from './../interfaces/payment.interface';
import Payment from '../models/payment.model';
import { Service } from 'typedi';

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
    return await Payment.findOne({ _id: id });
  };


  findOne = async (filter: any): Promise<IPaymentDocument | null> => {
    return await Payment.findOne(filter);
  };

  updateOne = async (filter: any, data: any): Promise<IPaymentDocument | null> => {
    const response = await Payment.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
