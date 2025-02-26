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
const user_service_1 = __importDefault(require("../services/user.service"));
const kyc_service_1 = __importDefault(require("../services/kyc.service"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
const ApiError_1 = require("../utils/ApiError");
const kyc_interface_1 = require("../interfaces/kyc.interface");
let AuthController = class AuthController {
    constructor(userService, kycService) {
        this.userService = userService;
        this.kycService = kycService;
        this.getUserProfile = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const user = await this.userService.getUserProfile(req.user._id);
            return new SuccessResponse_1.SuccessResponse(user, "Current User Profile Fetched");
        });
        this.getUsers = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { page, limit, searchTerm } = req.query;
            const usera = await this.userService.getAllUsers(page, limit, searchTerm);
            return new SuccessResponse_1.SuccessResponse(usera, "Users Fetched");
        });
        this.updateUserProfile = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { firstName, lastName, userName } = req.body;
            const data = { firstName, lastName, userName };
            const user = await this.userService.updateUserProfile(req.user._id, data);
            return new SuccessResponse_1.SuccessResponse(user, "User Profile Updated Successfully");
        });
        this.getAllUsers = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { page, limit, searchTerm } = req.query;
            const orders = await this.userService.getAllUsers(page, limit, searchTerm);
            return new SuccessResponse_1.SuccessResponse(orders, "Users Fetched Successfully");
        });
        this.setupNewPin = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { pin } = req.body;
            await this.userService.setupPin(req.user._id, pin);
            return new SuccessResponse_1.SuccessResponse(null, "Pin setup successfully");
        });
        this.verifyPin = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { pin } = req.body;
            await this.userService.verifyPin(req.user, pin);
            return new SuccessResponse_1.SuccessResponse(null, "Pin verified successfully");
        });
        this.updatePin = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { pin } = req.body;
            await this.userService.setupPin(req.user._id, pin);
            return new SuccessResponse_1.SuccessResponse(null, "Pin updated successfully");
        });
        this.initiateCodeVerification = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const user = req.user;
            if (!user?.twoFA?.enabled)
                throw new ApiError_1.BadRequestError("2FA Not enabled");
            const twoFA = await this.userService.trigger2FA(user, user.twoFA.type, true);
            return new SuccessResponse_1.SuccessResponse(twoFA, "Code verification initiated successfully");
        });
        this.verifyUserIdentity = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const identity = req.identity;
            const { status, response_code, face_data, user_info } = req.body;
            if (!status || response_code !== "00" || face_data.response_code !== "00")
                throw new ApiError_1.BadRequestError("Identity Verification Failed");
            const userID = user_info.user_ref;
            await this.userService.checkIdentityVerificationStatus(userID);
            await this.userService.upgradeKYCLevel(userID, kyc_interface_1.KYCLevels.Level_2);
            await this.userService.updateUser({ _id: userID }, { ...identity, isIdentityVerified: true });
            return new SuccessResponse_1.SuccessResponse("user", "User Identity Updated Successfully");
        });
    }
};
AuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.default,
        kyc_service_1.default])
], AuthController);
exports.default = AuthController;
