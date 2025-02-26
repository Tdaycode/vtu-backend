import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { Service } from 'typedi';
import fs from 'fs';
import Big from 'big.js';
import Country from 'iso-country-currency'
import UserRepository from '../repositories/user.repository';
import { AccountStatus, IUserDocument, IUserIdentity, TwoFATypes } from '../interfaces/user.interface';
import { OTPTypes } from '../interfaces/otp.interface';
import { hashPassword, hashString } from '../utils/crypto';
import { KYCLevels } from '../interfaces/kyc.interface';
import { LoggerClient } from './logger.service';
import OTPService from './otp.service';
import { PinService } from './pin.service';
import TokenService from './token.service';
import dayjs from 'dayjs';
import { IdentityPassBVNResponse } from '../interfaces/responses/identityPass.response.interface';
import config from '../config/Config'
import { KYCRepository } from '../repositories';
import WalletService from './wallet.service';
import { FilterQuery } from 'mongoose';
import { uploadFile } from '../utils/helpers';
import OrderService from './order.service';

@Service()
export default class UserService {
  constructor(
    public userRepository: UserRepository,
    public kycRepository: KYCRepository,
    public logger: LoggerClient,
    public otpService: OTPService,
    public pinService: PinService,
    public walletService: WalletService,
    public orderService: OrderService
  ) { }

  signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    country: string,
  ) => {
    const isTaken = await this.userRepository.findByEmail(email);
    if (isTaken) throw new BadRequestError('User already exists');

    const currency = Country.getAllInfoByISO(country);

    const user = await this.userRepository.createUser({ firstName, lastName, email, password, 
      phoneNumber, country, currency: currency.currency });

    const userInfo: Partial<IUserDocument> = user.toObject();
    delete userInfo['password'];

    return { user, userInfo };
  };

  signIn = async (email: string, password: string) => {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new BadRequestError('No User found with this email');
    if (!user.isEmailVerified) throw new BadRequestError('Email not verified');
    if (!(await user.isPasswordMatch(password))) throw new BadRequestError('Incorrect credentials');
    if (!user.isEmailVerified) throw new BadRequestError('Email not verified');

    const userInfo: Partial<IUserDocument> = user.toObject();
    delete userInfo['password'];

    if (user.twoFA.enabled) {
      const twoFA = await this.trigger2FA(user, user.twoFA.type);
      return { userInfo, twoFA };
    }

    return { userInfo };
  };

  checkVerificationStatus = async (type: OTPTypes, entity: string) => {
    let user: any;

    if (type === OTPTypes.email) {
      user = await this.userRepository.findUser({ email: entity });
      if (user?.isEmailVerified) throw new BadRequestError('Email already verified');
    }

    if (type === OTPTypes.phone) {
      user = await this.userRepository.findUser({ phoneNumber: entity });
      if (user?.isPhoneVerified) throw new BadRequestError('Phone Number already verified');
    }

    return user;
  };

  verifyUser = async (type: OTPTypes, entity: string) => {
    let user: any;
    if (type === OTPTypes.email) {
      user = await this.userRepository.updateUser({ email: entity }, { isEmailVerified: true });
    }

    if (type === OTPTypes.phone) {
      user = await this.userRepository.updateUser({ phoneNumber: entity }, { isPhoneVerified: true });
    }

    if (!user) throw new BadRequestError('No User found');
    return user;
  };

  trigger2FA = async (user: IUserDocument, type: string, update = false) => {
    if (!update) await this.userRepository.updateUser({ _id: user?._id }, { "twoFA.needed": true });
    if (type === TwoFATypes.email) {
      const verificationKey = await this.otpService.sendOTP(OTPTypes.email, user, true);
      return { verificationKey, type };
    }
    return { type };
  };

  updateTwoFA = async (email: string, status = false) => {
    const user = await this.userRepository.updateUser({ email }, { "twoFA.needed": status });
    return user;
  };

  updateUser = async (filter: any, data: any) => {
    const user = await this.userRepository.updateUser(filter, data);
    return user;
  };

  upgradeKYCLevel = async (id: string, kyc: KYCLevels) => {
    const response = await this.kycRepository.findOne({ level: kyc.toString() });
    if (!response) throw new BadRequestError('KYC with the given credential does not exist.');
    const user = await this.userRepository.updateUser({ _id: id }, { kycLevel: response._id });
    return user;
  };

  refreshAuth = async (refreshToken: string) => {
    const refreshTokenDoc = await TokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.getUser({ _id: refreshTokenDoc.user });
    await refreshTokenDoc.remove();
    return await TokenService.generateAuthTokens(user);
  };

  getAllUsers = async (page: string, limit: string, searchTerm: string) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    let filter: any = {}, sort: any = {};
    if (searchTerm) {
      const regexQuery = new RegExp(searchTerm, 'i');
      filter = {
        ...filter,
        $or: [
          { firstName: { $regex: regexQuery } },
          { lastName: { $regex: regexQuery } },
          { email: { $regex: regexQuery } },
          { userName: { $regex: regexQuery } },
        ]
      }
      sort = {};
    }

    return await this.userRepository.findAllWithPagination(filter, sort, skip, _limit);
  };

  getCurrentUser = async (filter: any) => {
    return await this.userRepository.getUser(filter);
  };

  getUserProfile = async (id: string) => {
    return await this.userRepository.getUserProfile(id);
  };

  getProfile = async (id: string) => {
    const userId = id;
    const user = await this.userRepository.getUserProfile(id);
    const remainingDailyLimit = await this.orderService.getTransactionVolumeByInterval(userId, "day");
    const remainingMonthlyLimit = await this.orderService.getTransactionVolumeByInterval(userId, "month");
    const output = user?.toJSON();
    if(!output) throw new NotFoundError("User Not Found")
    if(!output?.kycLevel) return output;
    const mainBalance = output?.mainBalance;
    delete output?.mainBalance;

    const response = {
      ...output,
      cashbackCurrency: output.currency,
      cowryBalance: (Big(output.cowryBalance)).toFixed(2),
      cashbackBalance: (Big(mainBalance).div(100)).toFixed(2),
      kycLevel: {
        ...output.kycLevel,
        remainingDailyLimit: (Big(output.kycLevel.dailyLimit).minus(remainingDailyLimit)).toFixed(2),
        remainingMonthlyLimit: (Big(output.kycLevel.monthlyLimit).minus(remainingMonthlyLimit)).toFixed(2),
      }
    };

    return response;
  };

  updateUserProfile = async (id: string, data: FilterQuery<IUserDocument>) => {
    return await this.userRepository.updateUser({ _id: id }, data);
  };

  public toggleAccountStatus = async (id: string) => {
    const user = await this.userRepository.getUserProfile(id);
    let update = { accountStatus: AccountStatus.INACTIVE };
    if (user?.accountStatus === AccountStatus.INACTIVE) update = { accountStatus: AccountStatus.ACTIVE };
    return await this.updateUserProfile(id, update);
  };

  public toggleUserSpend = async (id: string) => {
    const user = await this.userRepository.getUserProfile(id);
    let update = { isSpendingEnabled: false };
    if (user?.isSpendingEnabled === false) update = { isSpendingEnabled: true };
    return await this.updateUserProfile(id, update);
  };

  setupPin = async (id: string, pin: string) => {
    const hashedPin = await this.pinService.hash(pin);
    const data = { pin: hashedPin };
    return await this.userRepository.updateUser({ _id: id }, data);
  };

  verifyPin = async (user: any, pin: string) => {
    const _pin = await PinService.check(pin, user["pin"])
    if (!_pin) throw new BadRequestError("Your pin is invalid");
  };

  resetPassword = async (email: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.updateUser({ email }, { password: hashedPassword });
    return user;
  };

  changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestError('User not found');
    if (oldPassword === newPassword) throw new BadRequestError('Password cannot be the same');
    if (!(await user.isPasswordMatch(oldPassword))) throw new BadRequestError('Password Mismatch');
    const hashedPassword = await hashPassword(newPassword);
    return await this.userRepository.updateUser({ email }, { password: hashedPassword });
  };

  checkIdentityVerificationStatus = async (id: string) => {
    const user = await this.userRepository.findUser({ _id: id });
    if (user?.isIdentityVerified) throw new BadRequestError('Identity already verified');
  };

  public verifyUserIdentity = async (payload: IdentityPassBVNResponse) => {
    let identity: IUserIdentity | undefined, update = {};
    const userID = payload.widget_info.user_ref;
    const user = await this.userRepository.findUser({ _id: userID });
    if (!user) return;
    if (user.isIdentityVerified) return 'Identity already verified';

    const { status, response_code, face_data, data } = payload;
    identity = await this.validateExistingUserIdentity(payload);
    if (!identity) return;
    if (!status || response_code !== "00" || face_data.response_code !== "00")
      return;

    const { firstName, lastName } = data;
    if (!((firstName.toLowerCase() === user["firstName"].toLowerCase() || firstName.toLowerCase() === user["lastName"].toLowerCase())
      && (lastName.toLowerCase() === user["lastName"].toLowerCase() || lastName.toLowerCase() === user["firstName"].toLowerCase()))) return;

    const bankInfo = await this.walletService.generateBankAccountDetails(user);
    update = { ...update, bankInfo };

    await this.upgradeKYCLevel(userID, KYCLevels.Level_2);
    update = { ...update, ...identity, isIdentityVerified: true, identityData: payload };
    await this.updateUser({ _id: userID }, update);
  };

  private validateExistingUserIdentity = async (payload: IdentityPassBVNResponse) => {
    const { data } = payload;
    let identity: IUserIdentity = {
      identityHash: "",
      imageURL: "",
      dob: new Date()
    };

      const identityHash = hashString(data.bvn);
      identity = {
        identityHash,
        imageURL: data.base64Image,
        dob: dayjs(data.dateOfBirth).toDate()
      }

    if (!identity) return;
    if (config.activeEnvironment === "production") {
      const user = await this.userRepository.getUser({ identityHash: identity.identityHash });
      if (user) return;
    }

    return identity;
  };

  public uploadFile = async (file: Express.Multer.File | undefined) => {
    try {
      if(!file) throw Error("File Required");
      const fileURL = await uploadFile(file.path);
      return fileURL;
    } catch (error: any) {
      this.logger.error(error);
    } finally {
      if(file) fs.unlink(file.path, () => {});
    }
  };
}
