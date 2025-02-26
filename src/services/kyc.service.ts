import { Service } from 'typedi';
import { unitOfTime } from 'moment';
import Big from 'big.js';
import KYCRepository from '../repositories/kyc.repository';
import { KYCLevels } from '../interfaces/kyc.interface';
import { BadRequestError } from '../utils/ApiError';
import OrderService from './order.service';
import UserService from './user.service';
import { LoggerClient } from './logger.service';

@Service()
export default class KYCService {
  constructor(
    public orderService: OrderService, 
    public userService: UserService, 
    public logger: LoggerClient, 
    public kycRepository: KYCRepository
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
    const response = await this.kycRepository.findOne({ level: kyc });
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
      if (totalAmount.length > 0 && Big(totalAmount[0].totalAmount).gte(limit)) return true;
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
}
