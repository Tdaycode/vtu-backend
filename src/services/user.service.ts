import { BadRequestError } from '../utils/ApiError';
import { Service } from 'typedi';
import UserRepository from '../repositories/user.repository';
import { IUserDocument, TwoFATypes } from '../interfaces/user.interface';
import { OTPTypes } from '../interfaces/otp.interface';
import { hashPassword } from '../utils/crypto';
import { KYCLevels } from '../interfaces/kyc.interface';
import { LoggerClient } from './logger.service';
import OTPService from './otp.service';
import KYCService from './kyc.service';
import { PinService } from './pin.service';
import TokenService from './token.service';

@Service()
export default class UserService {
  constructor(
    public userRepository: UserRepository, 
    public logger: LoggerClient, 
    public otpService: OTPService,
    public kycService: KYCService,
    public pinService: PinService,
  ) {}

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

    const user = await this.userRepository.createUser(firstName, lastName, email, password, phoneNumber, country);

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
    if(!update) await this.userRepository.updateUser({ _id: user?._id }, { "twoFA.needed": true });
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
    const response = await this.kycService.getKYCbyLevel(kyc)
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
    let filter: any = { }, sort: any = { };
    if(searchTerm)  {
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
      sort =  {};
    }
        
    return await this.userRepository.findAllWithPagination(filter, sort, skip, _limit);
  };

  getCurrentUser = async (filter: any) => {
    return await this.userRepository.getUser(filter); 
  };


  getUserProfile = async (id: string) => {
    return await this.userRepository.getUserProfile(id); 
  };

  updateUserProfile = async (id: string, data: any) => {
    return await this.userRepository.updateUser({ _id: id }, data);
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
    if(!user) throw new BadRequestError('User not found');
    if(oldPassword === newPassword) throw new BadRequestError('Password cannot be the same');
    if (!(await user.isPasswordMatch(oldPassword))) throw new BadRequestError('Password Mismatch');
    const hashedPassword = await hashPassword(newPassword);
    return await this.userRepository.updateUser({ email }, { password: hashedPassword });
  }; 

  checkIdentityVerificationStatus = async (id: string) => {
    const user = await this.userRepository.findUser({ _id: id });
    if (user?.isIdentityVerified) throw new BadRequestError('Email already verified');
  };
}
