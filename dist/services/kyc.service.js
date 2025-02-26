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
const big_js_1 = __importDefault(require("big.js"));
const kyc_repository_1 = __importDefault(require("../repositories/kyc.repository"));
const ApiError_1 = require("../utils/ApiError");
const order_service_1 = __importDefault(require("./order.service"));
const user_service_1 = __importDefault(require("./user.service"));
const logger_service_1 = require("./logger.service");
let KYCService = class KYCService {
    constructor(orderService, userService, logger, kycRepository) {
        this.orderService = orderService;
        this.userService = userService;
        this.logger = logger;
        this.kycRepository = kycRepository;
        this.getAllKYC = async () => {
            return await this.kycRepository.findAll();
        };
        this.getKYCByID = async (id) => {
            const response = await this.kycRepository.findOne({ _id: id });
            if (!response)
                throw new ApiError_1.BadRequestError('KYC with the given credential does not exist.');
            return response;
        };
        this.getKYCbyLevel = async (kyc) => {
            const response = await this.kycRepository.findOne({ level: kyc });
            if (!response)
                throw new ApiError_1.BadRequestError('KYC with the given credential does not exist.');
            return response;
        };
        this.updateKYCLimit = async (id, dailyLimit, monthlyLimit) => {
            const response = await this.kycRepository.updateOne({ _id: id }, { dailyLimit, monthlyLimit });
            if (!response)
                throw new ApiError_1.BadRequestError('KYC with the given credential does not exist.');
            return response;
        };
        this.isLimitExceeded = async (userId, limit, interval) => {
            try {
                if (limit === "unlimited")
                    return false;
                const totalAmount = await this.orderService.getTransactionVolumeByInterval(userId, interval);
                if (totalAmount.length > 0 && (0, big_js_1.default)(totalAmount[0].totalAmount).gte(limit))
                    return true;
                return false;
            }
            catch (error) {
            }
        };
        this.checkTransactionLimits = async (userId, kycLevel) => {
            const { dailyLimit, monthlyLimit, baseCurrency } = await this.getKYCByID(kycLevel);
            // Check the daily limit
            if (await this.isLimitExceeded(userId, dailyLimit, "day"))
                throw new ApiError_1.BadRequestError(`Daily transaction limit of ${baseCurrency} ${dailyLimit} exceeded, Kindly Upgrade your KYC Level.`);
            // Check the monthly limit
            if (await this.isLimitExceeded(userId, monthlyLimit, "month"))
                throw new ApiError_1.BadRequestError(`Monthly transaction limit of ${baseCurrency} ${monthlyLimit} exceeded, Kindly Upgrade your KYC Level.`);
        };
    }
};
KYCService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [order_service_1.default,
        user_service_1.default,
        logger_service_1.LoggerClient,
        kyc_repository_1.default])
], KYCService);
exports.default = KYCService;
