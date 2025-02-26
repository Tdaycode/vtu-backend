import { Service } from 'typedi';
import { ICowry, ICowryDocument } from '../interfaces/cowry.interface';
import Cowry from '../models/cowry.model';
import { BadRequestError } from '../utils/ApiError';

@Service()
export default class CowryRepository {
  create = async (data: Partial<ICowry>): Promise<ICowryDocument> => {
    const document = new Cowry(data);
    return await document.save();
  };

  findAll = async (): Promise<ICowryDocument[]> => {
    return await Cowry.find();
  };

  findById = async (id: string): Promise<ICowryDocument | null> => {
    return await Cowry.findOne({ _id: id });
  };

  findOne = async (filter: any): Promise<ICowryDocument> => {
    const result =  await Cowry.findOne(filter);
    if (!result) throw new BadRequestError('Cowry with the given credential does not exist.');
    return result;
  };

  updateOne = async (filter: any, data: any): Promise<ICowryDocument | null> => {
    const response = await Cowry.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
