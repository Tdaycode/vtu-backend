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
const services_1 = require("../services");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
const ApiError_1 = require("../utils/ApiError");
const payment_interface_1 = require("../interfaces/payment.interface");
const Config_1 = __importDefault(require("../config/Config"));
let PaymentController = class PaymentController {
    constructor(userService, orderService, paymentService) {
        this.userService = userService;
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.initiatePayment = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const user = req.user;
            const { productID, product_id, amount, recipient, electricityType, type, pin } = req.body;
            const orderRequest = {
                productID, product_id, amount, recipient, electricityType, pin,
                country: user.country, userId: user._id, paymentMethod: type
            };
            const payment = await this.paymentService.initiatePayment(orderRequest);
            return new SuccessResponse_1.SuccessResponse(payment?.data, payment?.message);
        });
        this.completeFlutterwavePayment = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { event, data } = req.body;
            if (event === "charge.completed") {
                const payment = await this.paymentService.verifyPayment(data.id, payment_interface_1.PaymentTypes.Flutterwave);
                if (payment)
                    await this.orderService.completeOrder(payment);
            }
            return new SuccessResponse_1.SuccessResponse(null, "Payment Verified Successfully");
        });
        this.completeOrder = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { paymentId } = req.params;
            if (Config_1.default.activeEnvironment !== "development")
                throw new ApiError_1.BadRequestError("Service Unavailable");
            const payment = await this.paymentService.getPaymentByCredentials({ _id: paymentId });
            if (payment)
                await this.orderService.completeOrder(payment);
            return new SuccessResponse_1.SuccessResponse(null, "Payment Verified Successfully");
        });
    }
};
PaymentController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.UserService,
        services_1.OrderService,
        services_1.PaymentService])
], PaymentController);
exports.default = PaymentController;
