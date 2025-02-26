"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const services_1 = require("../services");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
const ApiError_1 = require("../utils/ApiError");
const otp_interface_1 = require("../interfaces/otp.interface");
const user_interface_1 = require("../interfaces/user.interface");
const kyc_interface_1 = require("../interfaces/kyc.interface");
let AuthController = class AuthController {
    constructor(userService, otpService, kycService) {
        this.userService = userService;
        this.otpService = otpService;
        this.kycService = kycService;
        this.signIn = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { email, password } = req.body;
            const { userInfo, twoFA } = await this.userService.signIn(email, password);
            if (userInfo?.twoFA?.enabled && !userInfo.firstLogin) {
                return new SuccessResponse_1.SuccessResponse(twoFA, 'Complete Two Factor Authentication');
            }
            else {
                userInfo.firstLogin && await this.userService.updateUser({ _id: userInfo._id }, { firstLogin: false });
                const tokens = await services_1.TokenService.generateAuthTokens(userInfo);
                return new SuccessResponse_1.SuccessResponse({ user: userInfo, tokens }, 'Successfully Signed In');
            }
        });
        this.signUp = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { firstName, lastName, email, phoneNumber, country, password } = req.body;
            const { user, userInfo } = await this.userService.signUp(firstName, lastName, email, password, phoneNumber, country);
            const verificationKey = await this.otpService.sendOTP(otp_interface_1.OTPTypes.email, user);
            return new SuccessResponse_1.SuccessResponse({ userInfo, verificationKey }, 'Sign Up Successful, Check your email for Verification Code');
        });
        this.logOut = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            await services_1.TokenService.logout(req.body.refreshToken);
            return new SuccessResponse_1.SuccessResponse(null, 'Logout Successfully', 204);
        });
        this.refreshToken = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const data = await this.userService.refreshAuth(req.body.refreshToken);
            return new SuccessResponse_1.SuccessResponse(data, 'Refresh Token');
        });
        this.verifyOtp = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { otp, verificationKey, entity, type } = req.body;
            await this.userService.checkVerificationStatus(type, entity);
            await this.otpService.verifyOTP(verificationKey, otp, entity);
            await this.userService.verifyUser(type, entity);
            return new SuccessResponse_1.SuccessResponse(null, 'Verification Successful');
        });
        this.resendOtp = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { entity, type } = req.body;
            const user = await this.userService.checkVerificationStatus(type, entity);
            const verificationKey = await this.otpService.sendOTP(type, user);
            return new SuccessResponse_1.SuccessResponse(verificationKey, 'OTP resent Successful');
        });
        this.forgotPassword = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { email } = req.body;
            const user = await this.userService.getCurrentUser({ email });
            if (!user)
                throw new ApiError_1.BadRequestError("User not Found");
            const verificationKey = await this.otpService.sendOTP("forgotPassword", user);
            return new SuccessResponse_1.SuccessResponse(verificationKey, 'Forgot Password Email Sent Successful');
        });
        this.resetPassword = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { otp, verificationKey, email, password } = req.body;
            await this.userService.getCurrentUser({ email });
            await this.otpService.verifyOTP(verificationKey, otp, email);
            await this.userService.resetPassword(email, password);
            return new SuccessResponse_1.SuccessResponse(null, 'Password Reset Successfully');
        });
        this.changePassword = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { oldPassword, newPassword } = req.body;
            await this.userService.changePassword(req.user.email, oldPassword, newPassword);
            return new SuccessResponse_1.SuccessResponse(null, 'Password Changed Successfully');
        });
        this.completeTwoFA = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { email, otp, verificationKey, type, rememberMe = false } = req.body;
            const userInfo = await this.userService.getCurrentUser({ email });
            if (!userInfo)
                throw new ApiError_1.BadRequestError("User not Found");
            if (type === user_interface_1.TwoFATypes.totp)
                await this.otpService.verifyTOTP(userInfo.twoFA.totpSecret, otp);
            else {
                await this.otpService.verifyOTP(verificationKey, otp, email);
            }
            const user = await this.userService.updateTwoFA(email);
            const tokens = await services_1.TokenService.generateAuthTokens({ ...user?.toJSON(), rememberMe });
            return new SuccessResponse_1.SuccessResponse({ user, tokens }, 'Two Factor Authentication Verification Successful');
        });
        this.updateTwoFA = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { type } = req.body;
            const user = req.user;
            if (user.twoFA.type === type)
                throw new ApiError_1.BadRequestError("Two Factor Authentication Type already in place");
            if (type === user_interface_1.TwoFATypes.totp) {
                // await this.userService.updateTwoFA(user.email, true);
                const temp_secret = speakeasy_1.default.generateSecret();
                const qrImage = await qrcode_1.default.toDataURL(temp_secret.otpauth_url);
                return new SuccessResponse_1.SuccessResponse({ qr: qrImage, secret: temp_secret.base32, type }, 'TOTP 2FA Setup Initialized');
            }
            if (type === user_interface_1.TwoFATypes.email) {
                const twoFA = await this.userService.trigger2FA(user, type, true);
                return new SuccessResponse_1.SuccessResponse(twoFA, 'Email 2FA code sent Successful');
            }
        });
        this.verifyTwoFA = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { secret, verificationKey, otp, type } = req.body;
            const user = req.user;
            const is2FAEnabled = user.twoFA.enabled;
            const condition = is2FAEnabled && user.twoFA.type === user_interface_1.TwoFATypes.totp;
            const secretKey = condition ? user.twoFA.totpSecret : secret;
            if (type === user_interface_1.TwoFATypes.email) {
                await this.otpService.verifyOTP(verificationKey, otp, user.email);
            }
            if (type === user_interface_1.TwoFATypes.totp) {
                await this.otpService.verifyTOTP(secretKey, otp);
            }
            const _data = { twoFA: { needed: false, type, totpSecret: secretKey } };
            await this.userService.updateUser({ _id: user._id }, _data);
            return new SuccessResponse_1.SuccessResponse(null, 'Two Factor Authentication Setup Successful');
        });
        this.getCurrentUser = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const user = req.user;
            return new SuccessResponse_1.SuccessResponse(user, "Current User Fetched");
        });
        this.phoneVerification = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const phoneNumber = req.user.phoneNumber;
            const user = await this.userService.checkVerificationStatus(otp_interface_1.OTPTypes.phone, phoneNumber);
            await this.otpService.sendOTP("phone", user);
            return new SuccessResponse_1.SuccessResponse(null, 'OTP sent to Phone Number Successfully');
        });
        this.verifyPhoneOtp = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { otp } = req.body;
            const phoneNumber = req.user.phoneNumber;
            const userID = req.user._id;
            await this.userService.checkVerificationStatus(otp_interface_1.OTPTypes.phone, phoneNumber);
            await this.otpService.verifyPhoneOTP(phoneNumber, otp);
            await this.userService.verifyUser(otp_interface_1.OTPTypes.phone, phoneNumber);
            await this.userService.upgradeKYCLevel(userID, kyc_interface_1.KYCLevels.Level_1);
            return new SuccessResponse_1.SuccessResponse(null, 'Verification Successful');
        });
    }
};
AuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.UserService,
        services_1.OTPService,
        services_1.KYCService])
], AuthController);
exports.default = AuthController;
