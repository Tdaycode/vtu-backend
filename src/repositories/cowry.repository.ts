import { FilterQuery } from 'mongoose';
import { Service } from 'typedi';
import { ICowryDocument } from '../interfaces/cowry.interface';
import { Cowry, PaginatedCowry } from '../models/cowry.model';
import { BadRequestError } from '../utils/ApiError';

@Service()
export default class CowryRepository {
  create = async (data: any): Promise<ICowryDocument> => {
    const document = new Cowry(data);
    return await document.save();
  };

  findAll = async (): Promise<ICowryDocument[]> => {
    return await Cowry.find();
  };

  findById = async (id: string): Promise<ICowryDocument | null> => {
    return await Cowry.findOne({ _id: id });
  };

  findOne = async (filter: FilterQuery<ICowryDocument>): Promise<ICowryDocument> => {
    const result =  await Cowry.findOne(filter);
    if (!result) throw new BadRequestError('Cowry with the given credential does not exist.');
    return result;
  };

  updateOne = async (filter: FilterQuery<ICowryDocument>, data: any): Promise<ICowryDocument | null> => {
    const response = await Cowry.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  findAllWithPagination = async (filter: FilterQuery<ICowryDocument> = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      select: "-pin",
      populate: [
        {
          path: 'buyerId',
          select: 'email firstName lastName',
        },
        {
          path: 'loaderId',
          select: 'email firstName lastName',
        }
      ],
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedCowry.paginate(filter, options);
  };
}
