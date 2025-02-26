import { Response, Request, NextFunction } from 'express';
import dayjs from "dayjs";
import { BadRequestError, UnAuthorizedError } from '../utils/ApiError';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import UserRepository from '../repositories/user.repository';
import { LoggerClient } from '../services/logger.service';
import { hashString } from '../utils/crypto';
import { IUSerIdentity, TwoFATypes } from '../interfaces/user.interface';
import { PinService } from '../services/pin.service';
import OTPService from '../services/otp.service';
import KYCService from '../services/kyc.service';

@Service()
export default class AuthMiddleware {
  constructor(
    public userRepository: UserRepository, 
    public otpService: OTPService, 
    public kycService: KYCService, 
    public logger: LoggerClient
  ) {}

  public user = async (req: Request, res: Response, next: NextFunction) => {
    let idToken: any;
    // Check Authorization header for token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      next(new UnAuthorizedError('Unauthorized'));
    }
    try {
      // Verify and decode token
      const decodedToken = TokenService.verifyToken(idToken);
      const user = await this.userRepository.getUser({ _id: decodedToken.sub })
      console.log('PATH==>', req.path);
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (user?.twoFA.needed && req.path !== "/verify-2fa") {
       
        next(new UnAuthorizedError('Two Factor Authentication Required'));
      }
  
      // Assign user ID to req user propery
      req.user = user;
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public validateExistingUserIdentity = async (req: Request, res: Response, next: NextFunction) => {
    const { channel, request_data, nin_data, bvn_data } = req.body;
    try {
      let identity: IUSerIdentity = {
        identityHash: "",
        imageURL: "",
        dob: new Date()
      }; 
  
      if(channel === "BVN") {
        const identityHash = hashString(request_data["number"]);
        identity = {
          identityHash,
          imageURL: request_data.image,
          dob: dayjs(bvn_data.dateOfBirth).toDate()
        }
      }

      if(channel === "NIN") {
        const identityHash = hashString(request_data["number_nin"]);
        identity = {
          identityHash,
          imageURL: request_data.image,
          dob: dayjs(nin_data.birthdate).toDate()
        }
      }

      if(!identity) next(new BadRequestError('Identity required')); 
            
      const user = await this.userRepository.getUser({ identityHash: identity.identityHash })
      if(user) next(new BadRequestError('Identity already in use')); 
      
      req.identity = identity;
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public verifyUsername = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (!user?.userName || user.userName === null) {
        next(new UnAuthorizedError('Create your username before performing this operation'));
      }
  
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public verifyIdentity = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (!user?.isIdentityVerified || user.isIdentityVerified === null) {
        next(new UnAuthorizedError('Verify Identity before performing this operation'));
      }
  
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public verifyPhone = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (!user?.phoneNumber || user.phoneNumber === null || !user.isPhoneVerified) {
        next(new UnAuthorizedError('Verify phone number before performing this operation'));
      }
  
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public verifyPin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }
      
      if(req.body["pin"]) {
        if (!user?.pin || user.pin === null) {
          next(new UnAuthorizedError('Setup your pin before performing transaction'));
        }
  
        const pin = await PinService.check(req.body["pin"], user["pin"])
        if (!pin) throw new BadRequestError("Your pin is invalid")
      }
      
      next();
    } catch (error: any) {
      next(new UnAuthorizedError(error.message))
    }
  };

  public validatePin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (!user?.pin || user.pin === null) {
        next(new UnAuthorizedError('Setup your pin before performing transaction'));
      }
      
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public verifyCode = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { type, verificationKey, otp } = req.body;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if(type === TwoFATypes.totp) await this.otpService.verifyTOTP(user.twoFA.totpSecret, otp);
      else { await this.otpService.verifyOTP(verificationKey, otp, req.user.email) }
      
      next();
    } catch (error) {
      next(new UnAuthorizedError('Unauthorized'))
    }
  };

  public validateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      next(new UnAuthorizedError('Unauthorized'));
    }

    try {

      const decodedToken = TokenService.verifyToken(idToken);
      const user = await this.userRepository.getUser({ _id: decodedToken.sub })
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if (user?.accountType !== "ADMIN") {
        console.log('USER TYPE===>',user?.accountType)
        next(new UnAuthorizedError('Unauthorized as admin'));
      }

      req.user = user;

    } catch(error) {
    next(new UnAuthorizedError('Unauthorized as admin'));

    }
  }

  public checkUserTransactionLimit = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if(!user?.kycLevel) throw new BadRequestError("KYC Not found")
      await this.kycService.checkTransactionLimits(user._id, user.kycLevel);
      next();
    } catch (error: any) {
      next(new UnAuthorizedError(error.message))
    }
  };
}
