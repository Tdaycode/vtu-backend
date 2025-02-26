import { KYCUpload as Model, PaginatedKycUpload } from '../models/kyc-upload.model';
import { Service } from 'typedi';
import { IKYCUpload, IKYCUploadDocument } from '../interfaces/kyc-upload.interface';
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';

@Service()
export default class KYCUploadRepository {
  create = async (data: any): Promise<IKYCUploadDocument> => {
    const doc = new Model(data);
    return await doc.save();
  };

  findAll = async (): Promise<IKYCUploadDocument[]> => {
    return await Model.find();
  };

  findById = async (id: string): Promise<IKYCUploadDocument | null> => {
    return await Model.findOne({ _id: id });
  };


  findOne = async (filter: FilterQuery<IKYCUploadDocument>, 
      projection: ProjectionType<IKYCUploadDocument> = {}, 
      option: QueryOptions<IKYCUploadDocument> = {}): Promise<IKYCUploadDocument | null> => {
    return await Model.findOne(filter, projection, option);
  };

  updateOne = async (filter: any, data: Partial<IKYCUpload>): Promise<IKYCUploadDocument | null> => {
    const response = await Model.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  findAllWithPagination = async (filter: any = {}, sort: any = {}, populate: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      populate,
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedKycUpload.paginate(filter, options);
  };
}
