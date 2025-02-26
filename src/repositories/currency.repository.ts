import Currency from '../models/currency.model';
import { Service } from 'typedi';
import { ICurrency, ICurrencyDocument } from '../interfaces/currency.interface';
import { FilterQuery } from 'mongoose';

@Service()
export default class CurrencyRepository {
  create = async (data: ICurrency): Promise<ICurrencyDocument> => {
    const document = new Currency(data);
    return await document.save();
  };

  findAll = async (filter: FilterQuery<ICurrencyDocument> = {}): Promise<ICurrencyDocument[]> => {
    return await Currency.find(filter);
  };

  findById = async (id: string): Promise<ICurrencyDocument | null> => {
    return await Currency.findOne({ _id: id });
  };

  findOne = async (filter: any): Promise<ICurrencyDocument | null> => {
    return await Currency.findOne(filter);
  };

  updateOne = async (filter: any, data: any): Promise<ICurrencyDocument | null> => {
    const response = await Currency.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
