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
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
const ApiError_1 = require("../utils/ApiError");
const logger_service_1 = require("../services/logger.service");
let WebhookMiddleware = class WebhookMiddleware {
    constructor(logger) {
        this.logger = logger;
        this.validateIdentityPassWebhook = async (req, res, next) => {
            try {
                const payloadSignature = req.headers["x-identitypass-signature"];
                if (payloadSignature) {
                    const publicKey = Buffer.from(payloadSignature.toString(), 'base64').toString('utf8');
                    if (publicKey !== Config_1.default.identityPassPublicKey)
                        throw new Error('Request not from identity pass');
                }
                else {
                    next(new ApiError_1.UnAuthorizedError('Unauthorized'));
                }
                next();
            }
            catch (err) {
                console.log(err);
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
        this.validateFlutterwaveWebhook = async (req, res, next) => {
            try {
                const hash = req.headers["verif-hash"];
                if (!hash)
                    throw new Error("Unauthorized");
                const secret_hash = Config_1.default.flutterwaveSecretHash;
                if (secret_hash !== hash)
                    throw new Error('Request not from flutterwave');
                next();
            }
            catch (err) {
                console.log(err);
                next(new ApiError_1.UnAuthorizedError('Unauthorized'));
            }
        };
    }
};
WebhookMiddleware = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient])
], WebhookMiddleware);
exports.default = WebhookMiddleware;
