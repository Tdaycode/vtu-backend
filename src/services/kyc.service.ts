import { Service } from 'typedi';
import { unitOfTime } from 'moment';
import Big from 'big.js';
import KYCRepository from '../repositories/kyc.repository';
import { IKYCLevel, KYCLevels } from '../interfaces/kyc.interface';
import { BadRequestError } from '../utils/ApiError';
import OrderService from './order.service';
import { LoggerClient } from './logger.service';
import UserService from './user.service';
import KYCUploadRepository from '../repositories/kyc-upload.repository';
import { convertUploadedFiles, removeFiles, UploadedFile, uploadFile } from '../utils/helpers';
import { KYCUploadDocument, KYCStatus, IKYCUploadDocument } from '../interfaces/kyc-upload.interface';
import { FilterQuery } from 'mongoose';

@Service()
export default class KYCService {
  constructor(
    public orderService: OrderService, 
    public userService: UserService, 
    public logger: LoggerClient, 
    public kycRepository: KYCRepository,
    public kycUploadRepository: KYCUploadRepository
  ) {}

  getAllKYC = async () => {
    return await this.kycRepository.findAll();
  };

  getKYCByID = async (id: string) => {
    const response = await this.kycRepository.findOne({ _id: id });
    if (!response) throw new BadRequestError('KYC with the given credential does not exist.');
    return response;
  };

  getKYCbyLevel = async (kyc: KYCLevels) => {
    const response = await this.kycRepository.findOne({ level: kyc.toString() });
    if (!response) throw new BadRequestError('KYC with the given credential does not exist.');
    return response;
  };

  updateKYCLimit = async (id: string, dailyLimit: number, monthlyLimit: number) => {
    const response = await this.kycRepository.updateOne({ _id: id }, { dailyLimit, monthlyLimit });
    if (!response) throw new BadRequestError('KYC with the given credential does not exist.');
    return response;
  };

  private isLimitExceeded = async (userId: string, limit: string, interval: unitOfTime.StartOf) => {
    try {
      if(limit === "unlimited") return false;
      const totalAmount =  await this.orderService.getTransactionVolumeByInterval(userId, interval);
      if (Big(totalAmount).gte(limit)) return true;
      return false;
    } catch (error) {
      
    }
  };

  public checkTransactionLimits = async (userId: string, kycLevel: string) => {
    const { dailyLimit, monthlyLimit, baseCurrency } =  await this.getKYCByID(kycLevel);

    // Check the daily limit
    if (await this.isLimitExceeded(userId, dailyLimit, "day")) 
      throw new BadRequestError(`Daily transaction limit of ${baseCurrency} ${dailyLimit} exceeded, Kindly Upgrade your KYC Level.`);

    // Check the monthly limit
    if (await this.isLimitExceeded(userId, monthlyLimit, "month"))
      throw new BadRequestError(`Monthly transaction limit of ${baseCurrency} ${monthlyLimit} exceeded, Kindly Upgrade your KYC Level.`);
  };

  public uploadKYCDocuments = async (userId: string, files: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[] | undefined) => {
    try {
      if(!files) throw Error("KYC Documents Required")
      const filesArray = Object.values(files);
      if(filesArray.length !== 3) throw Error("KYC Documents Required");

      const kyc = await this.kycUploadRepository.findOne({ userId });
      if(kyc && kyc.status !== KYCStatus.Rejected) throw Error("KYC Document Already Uploaded");
      
      const uploads = convertUploadedFiles(files)
      const documents = await this.uploadFilesToCloud(uploads);
      removeFiles(files)
      if(kyc) return await this.kycUploadRepository.updateOne({ userId }, { documents, status: KYCStatus.Pending });
      else return await this.kycUploadRepository.create({ userId, documents });
    } catch (error: any) {
      if(files) removeFiles(files)
      throw new BadRequestError(error.message)
    }
  };

  private uploadFilesToCloud = async (uploads: UploadedFile[]) => {
    const result: KYCUploadDocument[] = [];
    for (const doc of uploads) {
      const isImage = doc.mimetype.startsWith('image/');
      if(!isImage) throw Error("Image Required");
      const fileURL = await uploadFile(doc.path);
      result.push({
        type: doc.type,
        url: fileURL
      });
    }
    return result;
  };

  public getUserKYCDocument = async (userId: string) => {
    const kyc = await this.kycUploadRepository.findOne({ userId });
    return kyc;
  };

  public getSingleKYCRequest = async (id: string) => {
    const option = {
      populate: {
        path: 'userId',
        select: 'firstName lastName phoneNumber email country'
      }
    }
    const kyc = await this.kycUploadRepository.findOne({ _id: id }, {}, option);
    return kyc;
  };

  public updateKYCDocument = async (id: string, action: KYCStatus, rejectionReason: string) => {
    let update = { status: action, rejectionReason: "" };
    if(action === KYCStatus.Rejected) update = { ...update, rejectionReason };
    console.log(update)
    const kyc = await this.kycUploadRepository.updateOne({ _id: id }, update);
    if(!kyc) throw new BadRequestError('KYC with the given credential does not exist.');

    if(action === KYCStatus.Approved){
      const response = await this.kycRepository.findOne({ level: KYCLevels.Level_3 });
      if(!response) throw new BadRequestError('KYC with the given credential does not exist.');
      await this.userService.updateUser({ _id: id }, { kycLevel: response._id });
    }
    return kyc;
  };

  public getAllKYCRequests = async (page: string, limit: string, status: KYCStatus) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    const  populate = {
      path: 'userId',
      select: 'firstName lastName country'
    };
    let filter: FilterQuery<IKYCUploadDocument> = { }, sort: any = { createdAt: -1 };
    if(status)  {
      filter = {
        ...filter, 
        status
      }
      sort =  { createdAt: -1 };
    }
        
    return await this.kycUploadRepository.findAllWithPagination(filter, sort, populate, skip, _limit);
  };

  public updateKYCLimits = async (limits: IKYCLevel[]) => {
    for(let limit of limits) {
      const kyc = await this.kycRepository.updateOne({ level: limit.level }, limit);
      if(!kyc) throw new BadRequestError('KYC with the given credential does not exist.');
    }
  };
} 
