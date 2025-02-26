"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("../utils/ApiError");
const typedi_1 = require("typedi");
const logger_service_1 = require("./logger.service");
const token_model_1 = __importDefault(require("../models/token.model"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_interface_1 = require("../interfaces/token.interface");
const Config_1 = __importDefault(require("../config/Config"));
const logger = new logger_service_1.LoggerClient();
let TokenService = class TokenService {
    // Method that generates JWT Token
    static generateToken(userId, expires, type, secret = Config_1.default.jwtSecret) {
        try {
            const payload = {
                sub: userId,
                iat: (0, moment_1.default)().unix(),
                exp: expires.unix(),
                type,
            };
            return jsonwebtoken_1.default.sign(payload, secret);
        }
        catch (error) {
            logger.error(error.message);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
    // Method that stores token in the database
    static async saveToken(token, userId, expires, type) {
        try {
            await token_model_1.default.updateOne({ user: userId, type }, {
                token,
                user: userId,
                expires: expires.toDate(),
                type,
            }, { upsert: true });
        }
        catch (error) {
            logger.error(error.message);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
    //  Method that verifies JWT Token
    static verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, Config_1.default.jwtSecret);
            return payload;
        }
        catch (error) {
            console.log(error);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
    // Method that generates access and refresh token
    static async generateAuthTokens(user) {
        try {
            const accessTokenExpires = (0, moment_1.default)().add(user?.rememberMe ? 10080 : Config_1.default.jwtAcessExpirationMinutes, 'minutes');
            const accessToken = this.generateToken(user._id, accessTokenExpires, token_interface_1.TokenTypes.Access);
            const refreshTokenExpires = (0, moment_1.default)().add(Config_1.default.jwtRefreshExpirationDays, 'days');
            const refreshToken = this.generateToken(user._id, refreshTokenExpires, token_interface_1.TokenTypes.Refresh);
            await this.saveToken(refreshToken, user._id, refreshTokenExpires, token_interface_1.TokenTypes.Refresh);
            return {
                access: {
                    token: accessToken,
                    expires: accessTokenExpires.toDate(),
                },
                refresh: {
                    token: refreshToken,
                    expires: refreshTokenExpires.toDate(),
                },
            };
        }
        catch (e) {
            console.log(e);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
    static async logout(refreshToken) {
        const refreshTokenDoc = await token_model_1.default.findOne({ token: refreshToken, type: token_interface_1.TokenTypes.Refresh });
        if (!refreshTokenDoc) {
            throw new ApiError_1.NotFoundError('Not found');
        }
        await refreshTokenDoc.remove();
    }
    static async storeToken(token, expires, type) {
        try {
            await token_model_1.default.updateOne({ type }, {
                token,
                expires,
                type,
            }, { upsert: true });
        }
        catch (error) {
            logger.error(error.message);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
    static async retrieveToken(type) {
        try {
            const token = await token_model_1.default.findOne({ type });
            return token;
        }
        catch (error) {
            logger.error(error.message);
            throw new ApiError_1.BadRequestError('An error occured');
        }
    }
};
TokenService.verifyRefreshToken = async (token) => {
    const payload = jsonwebtoken_1.default.verify(token, Config_1.default.jwtSecret);
    const tokenDoc = await token_model_1.default.findOne({ token, type: token_interface_1.TokenTypes.Refresh, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
        throw new ApiError_1.BadRequestError('Token not found');
    }
    return tokenDoc;
};
TokenService = __decorate([
    (0, typedi_1.Service)()
], TokenService);
exports.default = TokenService;
