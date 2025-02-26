import KYC from '../models/kyc.model';
import { Service } from 'typedi';
import { IKYCLevelDocument, IKYCLevel } from '../interfaces/kyc.interface';

@Service()
export default class KYCRepository {
  create = async (data: IKYCLevel): Promise<IKYCLevelDocument> => {
    const kyc = new KYC(data);
    return await kyc.save();
  };

  findAll = async (): Promise<IKYCLevelDocument[]> => {
    return await KYC.find();
  };

  findById = async (id: string): Promise<IKYCLevelDocument | null> => {
    return await KYC.findOne({ _id: id });
  };


  findOne = async (filter: any): Promise<IKYCLevelDocument | null> => {
    return await KYC.findOne(filter);
  };

  updateOne = async (filter: any, data: any): Promise<IKYCLevelDocument | null> => {
    const response = await KYC.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
