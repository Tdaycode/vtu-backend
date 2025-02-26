import { Types, Document, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string,
  cowryBalance: number,
  mainBalance: number,
  country: string;
  currency: string;
  identityHash: string;
  imageURL: string;
  pin: string;
  dob: Date;
  firstLogin: boolean;
  isIdentityVerified: boolean;
  isEmailVerified: boolean;
  isSpendingEnabled: boolean;
  isPhoneVerified: boolean;
  accountType: AccountType;
  accountStatus: AccountStatus;
  kycLevel: Types.ObjectId,
  identityData: object,
  bankInfo: BankInfo,
  twoFA: {
    needed: boolean;
    enabled: boolean;
    type: string;
    totpSecret: string;
  };
}

export enum TwoFATypes {
  email = 'email',
  totp = 'totp',
}

export enum AccountType {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface IUserDocument extends IUser, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  isEmailTaken: (email: string) => Promise<IUserDocument>;
}

export interface IUserIdentity {
  identityHash: string;
  imageURL: string;
  dob: Date;
}

export interface BankInfo {
  bankName: string,
  accountNumber: string,
}

export interface IAdminUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  isEmailVerified: boolean;
  accountType: AccountType;
}

// export interface AuthRequest extends Request {
//   user?: IUserDocument | null;
//   params: {
//     id?: string;
//   };
//   query: {
//     searchTerm?: string;
//     page?: string;
//     limit?: string;
//   };
// }
