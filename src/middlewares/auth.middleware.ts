import { Response, Request, NextFunction } from 'express';
import { BadRequestError, UnAuthorizedError } from '../utils/ApiError';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import UserRepository from '../repositories/user.repository';
import { LoggerClient } from '../services/logger.service';
import { AccountStatus, AccountType, IUser, TwoFATypes } from '../interfaces/user.interface';
import { PinService } from '../services/pin.service';
import OTPService from '../services/otp.service';
import KYCService from '../services/kyc.service';
import { SettingsService } from '../services';
import { SettingsType } from '../interfaces/settings.interface';

@Service()
export default class AuthMiddleware {
  constructor(
    public userRepository: UserRepository, 
    public otpService: OTPService, 
    public settingsService: SettingsService, 
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
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }

      if(user?.accountStatus === AccountStatus.INACTIVE) 
        next(new UnAuthorizedError("Account Disabled, Contact Admin"));

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
  
  public checkSpendingStatus = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser ;
    try {  
      if (!user) {
        next(new UnAuthorizedError('Unauthorized'));
      }
      
      if (!user?.isSpendingEnabled) {
        next(new BadRequestError('Spending Disabled, Contact Admin'));
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
    let idToken = "";
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

      if (user?.accountType !== AccountType.ADMIN) {
        next(new UnAuthorizedError('Unauthorized as admin'));
      }

      req.user = user;
      next();
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

  public checkUserRegistrationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {  
      const result = await this.settingsService.getSettingsByType(SettingsType.disableRegistration);
      if(result.active) throw new BadRequestError("Registration Disabled, Contact Admin");
      next();
    } catch (error: any) {
      next(new UnAuthorizedError(error.message))
    }
  };
}
