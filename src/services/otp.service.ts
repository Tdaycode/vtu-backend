import { Service } from 'typedi';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import speakeasy from 'speakeasy';

import OtpRepository from '../repositories/otp.repository';
import NotificationService from '../services/notification.service';
import { LoggerClient } from './logger.service';

import { BadRequestError } from '../utils/ApiError';
import config from '../config/Config';
import { encode, decode } from '../utils/crypto';
import { initatePhoneVerification, verifyCode } from '../utils/twilio';

import { IUserDocument } from '../interfaces/user.interface';
import { OTPDetails } from '../interfaces/otp.interface';

@Service()
export default class OTPService {
  constructor(
    public otpRepository: OtpRepository,
    public notificationService: NotificationService,
    public logger: LoggerClient,
  ) {}

  private generateOTP = (): string => {
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    return otp;
  };

  public sendOTP = async (type: string, user: IUserDocument, twoFA = false) => {
    const otp = this.generateOTP();
    const expiration = moment().add(config.otpExpirationMinutes, 'minutes').toDate();
    const otpDoc = await this.otpRepository.createOTP(otp, expiration);

    const details: OTPDetails = {
      timestamp: new Date(),
      otpId: otpDoc._id,
    };

    const name = user.firstName + ' ' + user.lastName;
    const email = user.email;
    details.entity = user.email;
    
    if (type === 'email') {
      if (twoFA) {
        await this.notificationService.sendtwoFAEmail(name, otp, email);
      } else {
        await this.notificationService.sendEmailVerificationEmail(name, otp, email);
      }
    }

    if (type === "phone") { 
      await initatePhoneVerification(user.phoneNumber);
      return true;
    }

    if (type === 'forgotPassword') await this.notificationService.sendForgotPasswordEmail(name, otp, email);
      
    const encoded = await encode(JSON.stringify(details));
    return encoded;
  };

  public verifyOTP = async (verificationKey: string, otp: string, entity: string) => {
    if(!verificationKey) throw new BadRequestError("Verification Key Required")
    const decoded = await decode(verificationKey);
    const obj = JSON.parse(decoded);

    if (entity !== obj.entity) throw new BadRequestError('OTP was not sent to this particular email or phone number');
    const otpDoc = await this.otpRepository.findOne(obj.otpId);

    if (otpDoc) {
      const timeDiff = moment(otpDoc.expires).diff(moment(), 'seconds');
      if (timeDiff >= 0) {
        if (otp === otpDoc.otp) {
          await this.otpRepository.deleteOne(obj.otpId);
          return true;
        } else throw new BadRequestError('Invalid OTP');
      } else throw new BadRequestError('Invalid OTP');
    } else throw new BadRequestError('Invalid OTP');
  };

  public verifyTOTP = async (secret: string, otp: string) => {
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: otp,
      window: 1 
    });
    
    if (!verified) throw new BadRequestError("OTP is invalid or has expired");
  };

  public verifyPhoneOTP = async (phoneNumber: string, otp: string) => {
    try {
      await verifyCode(phoneNumber, otp);
    } catch (error) {
      throw new BadRequestError("OTP is invalid or has expired"); 
    }
  };
}
