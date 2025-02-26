import { Document, ObjectId } from 'mongoose';

export interface IOtp {
  otp: string;
  expires: Date;
}

export interface OTPDetails {
  timestamp: Date;
  otpId: ObjectId;
  entity?: string | undefined;
}

export enum OTPTypes {
  email = 'email',
  phone = 'phone',
}

export interface IOtpDocument extends IOtp, Document {}
