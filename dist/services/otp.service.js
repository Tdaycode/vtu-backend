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
const otp_generator_1 = __importDefault(require("otp-generator"));
const moment_1 = __importDefault(require("moment"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const otp_repository_1 = __importDefault(require("../repositories/otp.repository"));
const notification_service_1 = __importDefault(require("../services/notification.service"));
const logger_service_1 = require("./logger.service");
const ApiError_1 = require("../utils/ApiError");
const Config_1 = __importDefault(require("../config/Config"));
const crypto_1 = require("../utils/crypto");
const twilio_1 = require("../utils/twilio");
let OTPService = class OTPService {
    constructor(otpRepository, notificationService, logger) {
        this.otpRepository = otpRepository;
        this.notificationService = notificationService;
        this.logger = logger;
        this.generateOTP = () => {
            const otp = otp_generator_1.default.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            return otp;
        };
        this.sendOTP = async (type, user, twoFA = false) => {
            const otp = this.generateOTP();
            const expiration = (0, moment_1.default)().add(Config_1.default.otpExpirationMinutes, 'minutes').toDate();
            const otpDoc = await this.otpRepository.createOTP(otp, expiration);
            const details = {
                timestamp: new Date(),
                otpId: otpDoc._id,
            };
            const name = user.firstName + ' ' + user.lastName;
            const email = user.email;
            details.entity = user.email;
            if (type === 'email') {
                if (twoFA) {
                    await this.notificationService.sendtwoFAEmail(name, otp, email);
                }
                else {
                    await this.notificationService.sendEmailVerificationEmail(name, otp, email);
                }
            }
            if (type === "phone") {
                await (0, twilio_1.initatePhoneVerification)(user.phoneNumber);
                return true;
            }
            if (type === 'forgotPassword')
                await this.notificationService.sendForgotPasswordEmail(name, otp, email);
            const encoded = await (0, crypto_1.encode)(JSON.stringify(details));
            return encoded;
        };
        this.verifyOTP = async (verificationKey, otp, entity) => {
            if (!verificationKey)
                throw new ApiError_1.BadRequestError("Verification Key Required");
            const decoded = await (0, crypto_1.decode)(verificationKey);
            const obj = JSON.parse(decoded);
            if (entity !== obj.entity)
                throw new ApiError_1.BadRequestError('OTP was not sent to this particular email or phone number');
            const otpDoc = await this.otpRepository.findOne(obj.otpId);
            if (otpDoc) {
                const timeDiff = (0, moment_1.default)(otpDoc.expires).diff((0, moment_1.default)(), 'seconds');
                if (timeDiff >= 0) {
                    if (otp === otpDoc.otp) {
                        await this.otpRepository.deleteOne(obj.otpId);
                        return true;
                    }
                    else
                        throw new ApiError_1.BadRequestError('Invalid OTP');
                }
                else
                    throw new ApiError_1.BadRequestError('Invalid OTP');
            }
            else
                throw new ApiError_1.BadRequestError('Invalid OTP');
        };
        this.verifyTOTP = async (secret, otp) => {
            const verified = speakeasy_1.default.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: otp,
                window: 1
            });
            if (!verified)
                throw new ApiError_1.BadRequestError("OTP is invalid or has expired");
        };
        this.verifyPhoneOTP = async (phoneNumber, otp) => {
            try {
                await (0, twilio_1.verifyCode)(phoneNumber, otp);
            }
            catch (error) {
                throw new ApiError_1.BadRequestError("OTP is invalid or has expired");
            }
        };
    }
};
OTPService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [otp_repository_1.default,
        notification_service_1.default,
        logger_service_1.LoggerClient])
], OTPService);
exports.default = OTPService;
