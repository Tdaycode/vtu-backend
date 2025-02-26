import { Document } from 'mongoose';

export interface IKYCLevel {
    level: KYCLevels,
    dailyLimit: string,
    monthlyLimit: string,
    baseCurrency: string,
}

export enum KYCLevels {
    Level_1 = '1',
    Level_2 = '2',
    Level_3 = '3',
  }

export interface IKYCLevelDocument extends IKYCLevel, Document {}

  