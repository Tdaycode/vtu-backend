import { Types, Document, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string,
  cowryBalance: number,
  country: string;
  identityHash: string;
  imageURL: string;
  pin: string;
  dob: Date;
  firstLogin: boolean;
  isIdentityVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  accountType: AccountType;
  kycLevel: Types.ObjectId,
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

export interface IUserDocument extends IUser, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  isEmailTaken: (email: string) => Promise<IUserDocument>;
}

export interface IUSerIdentity {
  identityHash: string;
  imageURL: string;
  dob: Date;
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
