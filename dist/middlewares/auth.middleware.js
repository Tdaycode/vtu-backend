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
const dayjs_1 = __importDefault(require("dayjs"));
const ApiError_1 = require("../utils/ApiError");
const typedi_1 = require("typedi");
const token_service_1 = __importDefault(require("../services/token.service"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const logger_service_1 = require("../services/logger.service");
const crypto_1 = require("../utils/crypto");
const user_interface_1 = require("../interfaces/user.interface");
const pin_service_1 = require("../services/pin.service");
const otp_service_1 = __importDefault(require("../services/otp.service"));
const kyc_service_1 = __importDefault(require("../services/kyc.service"));
let AuthMiddleware = class AuthMiddleware {
    constructor(userRepository, otpService, kycService, logger) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.kycService = kycService;
        this.logger = logger;
        this.user = async (req, res, next) => {
            let idToken;
            // Check Authorization header for token
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                idToken = req.headers.authorization.split('Bearer ')[1];
            }
            else {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
            try {
                // Verify and decode token
                const decodedToken = token_service_1.default.verifyToken(idToken);
                const user = await this.userRepository.getUser({ _id: decodedToken.sub });
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (user?.twoFA.needed && req.path !== "/verify-2fa") {
                    next(new ApiError_1.UnAuthorizedError('Two Factor Authentication Required'));
                }
                // Assign user ID to req user propery
                req.user = user;
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.validateExistingUserIdentity = async (req, res, next) => {
            const { channel, request_data, nin_data, bvn_data } = req.body;
            try {
                let identity = {
                    identityHash: "",
                    imageURL: "",
                    dob: new Date()
                };
                if (channel === "BVN") {
                    const identityHash = (0, crypto_1.hashString)(request_data["number"]);
                    identity = {
                        identityHash,
                        imageURL: request_data.image,
                        dob: (0, dayjs_1.default)(bvn_data.dateOfBirth).toDate()
                    };
                }
                if (channel === "NIN") {
                    const identityHash = (0, crypto_1.hashString)(request_data["number_nin"]);
                    identity = {
                        identityHash,
                        imageURL: request_data.image,
                        dob: (0, dayjs_1.default)(nin_data.birthdate).toDate()
                    };
                }
                if (!identity)
                    next(new ApiError_1.BadRequestError('Identity required'));
                const user = await this.userRepository.getUser({ identityHash: identity.identityHash });
                if (user)
                    next(new ApiError_1.BadRequestError('Identity already in use'));
                req.identity = identity;
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.verifyUsername = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (!user?.userName || user.userName === null) {
                    next(new ApiError_1.UnAuthorizedError('Create your username before performing this operation'));
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.verifyIdentity = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (!user?.isIdentityVerified || user.isIdentityVerified === null) {
                    next(new ApiError_1.UnAuthorizedError('Verify Identity before performing this operation'));
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.verifyPhone = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (!user?.phoneNumber || user.phoneNumber === null || !user.isPhoneVerified) {
                    next(new ApiError_1.UnAuthorizedError('Verify phone number before performing this operation'));
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.verifyPin = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (req.body["pin"]) {
                    if (!user?.pin || user.pin === null) {
                        next(new ApiError_1.UnAuthorizedError('Setup your pin before performing transaction'));
                    }
                    const pin = await pin_service_1.PinService.check(req.body["pin"], user["pin"]);
                    if (!pin)
                        throw new ApiError_1.BadRequestError("Your pin is invalid");
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError(error.message));
            }
        };
        this.validatePin = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (!user?.pin || user.pin === null) {
                    next(new ApiError_1.UnAuthorizedError('Setup your pin before performing transaction'));
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.verifyCode = async (req, res, next) => {
            const user = req.user;
            const { type, verificationKey, otp } = req.body;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (type === user_interface_1.TwoFATypes.totp)
                    await this.otpService.verifyTOTP(user.twoFA.totpSecret, otp);
                else {
                    await this.otpService.verifyOTP(verificationKey, otp, req.user.email);
                }
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.checkUserTransactionLimit = async (req, res, next) => {
            const user = req.user;
            try {
                if (!user) {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                if (!user?.kycLevel)
                    throw new ApiError_1.BadRequestError("KYC Not found");
                await this.kycService.checkTransactionLimits(user._id, user.kycLevel);
                next();
            }
            catch (error) {
                next(new ApiError_1.UnAuthorizedError(error.message));
            }
        };
    }
};
AuthMiddleware = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_repository_1.default,
        otp_service_1.default,
        kyc_service_1.default,
        logger_service_1.LoggerClient])
], AuthMiddleware);
exports.default = AuthMiddleware;
