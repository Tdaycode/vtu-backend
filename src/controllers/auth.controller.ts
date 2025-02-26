import { Request } from 'express';
import { Service } from 'typedi';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { TokenService, UserService, OTPService, KYCService } from '../services';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { BadRequestError } from '../utils/ApiError';
import { OTPTypes } from '../interfaces/otp.interface';
import { AccountStatus, TwoFATypes } from '../interfaces/user.interface';
import { KYCLevels } from '../interfaces/kyc.interface';

@Service()
export default class AuthController {
  constructor(
    public userService: UserService, 
    public otpService: OTPService,
    public kycService: KYCService
  ) {}

  signIn = asyncWrapper(async (req: Request) => {
    const { email, password } = req.body;
    const { userInfo, twoFA } = await this.userService.signIn(email, password);
    if(userInfo?.accountStatus === AccountStatus.INACTIVE) 
      throw new BadRequestError("Account Disabled, Contact Admin");
    if (userInfo?.twoFA?.enabled && !userInfo.firstLogin) {
      return new SuccessResponse(twoFA, 'Complete Two Factor Authentication');
    } else {
      userInfo.firstLogin && await this.userService.updateUser({ _id: userInfo._id }, { firstLogin: false });
      const tokens = await TokenService.generateAuthTokens(userInfo);
      return new SuccessResponse({ user: userInfo, tokens }, 'Successfully Signed In');
    }
  });

  signUp = asyncWrapper(async (req: Request) => {
    const { firstName, lastName, email, phoneNumber, country, password } = req.body;
    const { user, userInfo } = await this.userService.signUp(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country,
    );
    const verificationKey = await this.otpService.sendOTP(OTPTypes.email, user);
    return new SuccessResponse(
      { userInfo, verificationKey },
      'Sign Up Successful, Check your email for Verification Code',
    );
  });

  logOut = asyncWrapper(async (req: Request) => {
    await TokenService.logout(req.body.refreshToken);
    return new SuccessResponse(null, 'Logout Successfully', 204);
  });

  refreshToken = asyncWrapper(async (req: Request) => {
    const data = await this.userService.refreshAuth(req.body.refreshToken);
    return new SuccessResponse(data, 'Refresh Token');
  });

  verifyOtp = asyncWrapper(async (req: Request) => {
    const { otp, verificationKey, entity, type } = req.body;
    await this.userService.checkVerificationStatus(type, entity);
    await this.otpService.verifyOTP(verificationKey, otp, entity);
    await this.userService.verifyUser(type, entity);
    return new SuccessResponse(null, 'Verification Successful');
  });

  resendOtp = asyncWrapper(async (req: Request) => {
    const { entity, type } = req.body;
    const user = await this.userService.checkVerificationStatus(type, entity);
    const verificationKey = await this.otpService.sendOTP(type, user);
    return new SuccessResponse(verificationKey, 'OTP resent Successful');
  });

  forgotPassword = asyncWrapper(async (req: Request) => {
    const { email } = req.body;
    const user = await this.userService.getCurrentUser({ email });
    if(!user) throw new BadRequestError("User not Found");
    const verificationKey = await this.otpService.sendOTP("forgotPassword", user);
    return new SuccessResponse(verificationKey, 'Forgot Password Email Sent Successful');
  });

  resetPassword = asyncWrapper(async (req: Request) => {
    const { otp, verificationKey, email, password } = req.body;
    await this.userService.getCurrentUser({ email });
    await this.otpService.verifyOTP(verificationKey, otp, email);
    await this.userService.resetPassword(email, password);
    return new SuccessResponse(null, 'Password Reset Successfully');
  });

  changePassword = asyncWrapper(async (req: Request) => { 
    const { oldPassword, newPassword } = req.body;
    await this.userService.changePassword(req.user.email, oldPassword, newPassword);
    return new SuccessResponse(null, 'Password Changed Successfully');
  });

  completeTwoFA = asyncWrapper(async (req: Request) => {
    const { email, otp, verificationKey, type, rememberMe = false } = req.body;
    const userInfo = await this.userService.getCurrentUser({ email });
    if(!userInfo) throw new BadRequestError("User not Found")
    if(type === TwoFATypes.totp) await this.otpService.verifyTOTP(userInfo.twoFA.totpSecret, otp);
    else { await this.otpService.verifyOTP(verificationKey, otp, email) }
    const user = await this.userService.updateTwoFA(email);
    const tokens = await TokenService.generateAuthTokens({ ...user?.toJSON(), rememberMe });
    return new SuccessResponse({ user, tokens }, 'Two Factor Authentication Verification Successful');
  });

  updateTwoFA = asyncWrapper(async (req: Request) => {
    const { type } = req.body;
    const user = req.user;

    if(user.twoFA.type === type) throw new BadRequestError("Two Factor Authentication Type already in place");
    
    if(type === TwoFATypes.totp) {
      // await this.userService.updateTwoFA(user.email, true);
      const temp_secret = speakeasy.generateSecret();
      const qrImage = await qrcode.toDataURL(temp_secret.otpauth_url);
      return new SuccessResponse({ qr: qrImage, secret: temp_secret.base32, type }, 'TOTP 2FA Setup Initialized');
    }

    if(type === TwoFATypes.email) {
      const twoFA = await this.userService.trigger2FA(user, type, true); 
      return new SuccessResponse(twoFA, 'Email 2FA code sent Successful');
    }
  });

  verifyTwoFA = asyncWrapper(async (req: Request) => {
    const { secret, verificationKey, otp, type } = req.body;
    const user = req.user;
    const is2FAEnabled = user.twoFA.enabled
    const condition = is2FAEnabled && user.twoFA.type === TwoFATypes.totp;
    const secretKey = condition ? user.twoFA.totpSecret : secret

    if(type === TwoFATypes.email) {
      await this.otpService.verifyOTP(verificationKey, otp, user.email);
    }
    if(type === TwoFATypes.totp) {
      await this.otpService.verifyTOTP(secretKey, otp);
    }

    const _data = { twoFA: { needed: false, type, totpSecret: secretKey } };
    await this.userService.updateUser({ _id: user._id }, _data);
    return new SuccessResponse(null, 'Two Factor Authentication Setup Successful');
  });

  getCurrentUser = asyncWrapper(async (req: Request) => {
    const user = await this.userService.getProfile(req.user._id);
    return new SuccessResponse(user, "Current User Fetched");
  });

  phoneVerification = asyncWrapper(async (req: Request) => {
    const phoneNumber = req.user.phoneNumber;
    const user = await this.userService.checkVerificationStatus(OTPTypes.phone, phoneNumber);

    const verificationKey = await this.otpService.sendOTP("phone", user);
    return new SuccessResponse(verificationKey, 'OTP sent to Phone Number Successfully');
  });

  verifyPhoneOtp = asyncWrapper(async (req: Request) => {
    const { otp, verificationKey } = req.body;
    const phoneNumber = req.user.phoneNumber;
    const userID = req.user._id;
    await this.userService.checkVerificationStatus(OTPTypes.phone, phoneNumber);
    await this.otpService.verifyOTP(verificationKey, otp, phoneNumber);
    await this.userService.verifyUser(OTPTypes.phone, phoneNumber);
    await this.userService.upgradeKYCLevel(userID, KYCLevels.Level_1);
    return new SuccessResponse(null, 'Verification Successful');
  });
}
