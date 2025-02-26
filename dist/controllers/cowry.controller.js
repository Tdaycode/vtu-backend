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
const cowry_service_1 = __importDefault(require("../services/cowry.service"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
let CowryController = class CowryController {
    constructor(userService, cowryService) {
        this.userService = userService;
        this.cowryService = cowryService;
        this.checkCowryVoucher = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { code } = req.params;
            const cowry = await this.cowryService.checkCowryVoucher(code);
            return new SuccessResponse_1.SuccessResponse(cowry, "Cowry Voucher Fetched Successfully");
        });
        this.loadCowryVoucher = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { code, pin } = req.body;
            const userId = req.user._id;
            const cowry = await this.cowryService.loadCowryVoucher(code, pin, userId);
            return new SuccessResponse_1.SuccessResponse(cowry, "Cowry Voucher Loaded Successfully");
        });
        this.transferCowry = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { amount, recipient } = req.body;
            const userId = req.user._id;
            const transferData = {
                senderUserId: userId, amount,
                recipientUsername: recipient
            };
            const cowry = await this.cowryService.transferCowry(transferData);
            return new SuccessResponse_1.SuccessResponse(cowry, "Cowry Transfer Successful");
        });
        this.getCowryTransactions = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { page, limit } = req.query;
            const userId = req.user._id;
            const orders = await this.cowryService.getCowryTransactions(userId, page, limit);
            return new SuccessResponse_1.SuccessResponse(orders, "Cowry Transactions Fetched Successfully");
        });
    }
};
CowryController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.default,
        cowry_service_1.default])
], CowryController);
exports.default = CowryController;
