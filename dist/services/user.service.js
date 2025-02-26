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
const ApiError_1 = require("../utils/ApiError");
const typedi_1 = require("typedi");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const user_interface_1 = require("../interfaces/user.interface");
const otp_interface_1 = require("../interfaces/otp.interface");
const crypto_1 = require("../utils/crypto");
const logger_service_1 = require("./logger.service");
const otp_service_1 = __importDefault(require("./otp.service"));
const kyc_service_1 = __importDefault(require("./kyc.service"));
const pin_service_1 = require("./pin.service");
const token_service_1 = __importDefault(require("./token.service"));
let UserService = class UserService {
    constructor(userRepository, logger, otpService, kycService, pinService) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.otpService = otpService;
        this.kycService = kycService;
        this.pinService = pinService;
        this.signUp = async (firstName, lastName, email, password, phoneNumber, country) => {
            const isTaken = await this.userRepository.findByEmail(email);
            if (isTaken)
                throw new ApiError_1.BadRequestError('User already exists');
            const user = await this.userRepository.createUser(firstName, lastName, email, password, phoneNumber, country);
            const userInfo = user.toObject();
            delete userInfo['password'];
            return { user, userInfo };
        };
        this.signIn = async (email, password) => {
            const user = await this.userRepository.findByEmail(email);
            if (!user)
                throw new ApiError_1.BadRequestError('No User found with this email');
            if (!user.isEmailVerified)
                throw new ApiError_1.BadRequestError('Email not verified');
            if (!(await user.isPasswordMatch(password)))
                throw new ApiError_1.BadRequestError('Incorrect credentials');
            if (!user.isEmailVerified)
                throw new ApiError_1.BadRequestError('Email not verified');
            const userInfo = user.toObject();
            delete userInfo['password'];
            if (user.twoFA.enabled) {
                const twoFA = await this.trigger2FA(user, user.twoFA.type);
                return { userInfo, twoFA };
            }
            return { userInfo };
        };
        this.checkVerificationStatus = async (type, entity) => {
            let user;
            if (type === otp_interface_1.OTPTypes.email) {
                user = await this.userRepository.findUser({ email: entity });
                if (user?.isEmailVerified)
                    throw new ApiError_1.BadRequestError('Email already verified');
            }
            if (type === otp_interface_1.OTPTypes.phone) {
                user = await this.userRepository.findUser({ phoneNumber: entity });
                if (user?.isPhoneVerified)
                    throw new ApiError_1.BadRequestError('Phone Number already verified');
            }
            return user;
        };
        this.verifyUser = async (type, entity) => {
            let user;
            if (type === otp_interface_1.OTPTypes.email) {
                user = await this.userRepository.updateUser({ email: entity }, { isEmailVerified: true });
            }
            if (type === otp_interface_1.OTPTypes.phone) {
                user = await this.userRepository.updateUser({ phoneNumber: entity }, { isPhoneVerified: true });
            }
            if (!user)
                throw new ApiError_1.BadRequestError('No User found');
            return user;
        };
        this.trigger2FA = async (user, type, update = false) => {
            if (!update)
                await this.userRepository.updateUser({ _id: user?._id }, { "twoFA.needed": true });
            if (type === user_interface_1.TwoFATypes.email) {
                const verificationKey = await this.otpService.sendOTP(otp_interface_1.OTPTypes.email, user, true);
                return { verificationKey, type };
            }
            return { type };
        };
        this.updateTwoFA = async (email, status = false) => {
            const user = await this.userRepository.updateUser({ email }, { "twoFA.needed": status });
            return user;
        };
        this.updateUser = async (filter, data) => {
            const user = await this.userRepository.updateUser(filter, data);
            return user;
        };
        this.upgradeKYCLevel = async (id, kyc) => {
            const response = await this.kycService.getKYCbyLevel(kyc);
            const user = await this.userRepository.updateUser({ _id: id }, { kycLevel: response._id });
            return user;
        };
        this.refreshAuth = async (refreshToken) => {
            const refreshTokenDoc = await token_service_1.default.verifyRefreshToken(refreshToken);
            const user = await this.userRepository.getUser({ _id: refreshTokenDoc.user });
            await refreshTokenDoc.remove();
            return await token_service_1.default.generateAuthTokens(user);
        };
        this.getAllUsers = async (page, limit, searchTerm) => {
            const _page = parseInt(page) ? parseInt(page) : 1;
            const _limit = parseInt(limit) ? parseInt(limit) : 10;
            const skip = (_page - 1) * _limit;
            let filter = {}, sort = {};
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
                };
                sort = {};
            }
            return await this.userRepository.findAllWithPagination(filter, sort, skip, _limit);
        };
        this.getCurrentUser = async (filter) => {
            return await this.userRepository.getUser(filter);
        };
        this.getUserProfile = async (id) => {
            return await this.userRepository.getUserProfile(id);
        };
        this.updateUserProfile = async (id, data) => {
            return await this.userRepository.updateUser({ _id: id }, data);
        };
        this.setupPin = async (id, pin) => {
            const hashedPin = await this.pinService.hash(pin);
            const data = { pin: hashedPin };
            return await this.userRepository.updateUser({ _id: id }, data);
        };
        this.verifyPin = async (user, pin) => {
            const _pin = await pin_service_1.PinService.check(pin, user["pin"]);
            if (!_pin)
                throw new ApiError_1.BadRequestError("Your pin is invalid");
        };
        this.resetPassword = async (email, password) => {
            const hashedPassword = await (0, crypto_1.hashPassword)(password);
            const user = await this.userRepository.updateUser({ email }, { password: hashedPassword });
            return user;
        };
        this.changePassword = async (email, oldPassword, newPassword) => {
            const user = await this.userRepository.findByEmail(email);
            if (!user)
                throw new ApiError_1.BadRequestError('User not found');
            if (oldPassword === newPassword)
                throw new ApiError_1.BadRequestError('Password cannot be the same');
            if (!(await user.isPasswordMatch(oldPassword)))
                throw new ApiError_1.BadRequestError('Password Mismatch');
            const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
            return await this.userRepository.updateUser({ email }, { password: hashedPassword });
        };
        this.checkIdentityVerificationStatus = async (id) => {
            const user = await this.userRepository.findUser({ _id: id });
            if (user?.isIdentityVerified)
                throw new ApiError_1.BadRequestError('Email already verified');
        };
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_repository_1.default,
        logger_service_1.LoggerClient,
        otp_service_1.default,
        kyc_service_1.default,
        pin_service_1.PinService])
], UserService);
exports.default = UserService;
