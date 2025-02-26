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
const payment_repository_1 = __importDefault(require("../repositories/payment.repository"));
const ApiError_1 = require("../utils/ApiError");
const payment_interface_1 = require("../interfaces/payment.interface");
const uuidv4_1 = require("uuidv4");
const user_service_1 = __importDefault(require("./user.service"));
const order_service_1 = __importDefault(require("./order.service"));
const currency_service_1 = __importDefault(require("./currency.service"));
const cowry_service_1 = __importDefault(require("./cowry.service"));
const logger_service_1 = require("./logger.service");
const providers_1 = require("../providers");
const currency_interface_1 = require("../interfaces/currency.interface");
let PaymentService = class PaymentService {
    constructor(logger, paymentRepository, userService, orderService, cowryService, currencyService, flutterwaveProvider) {
        this.logger = logger;
        this.paymentRepository = paymentRepository;
        this.userService = userService;
        this.orderService = orderService;
        this.cowryService = cowryService;
        this.currencyService = currencyService;
        this.flutterwaveProvider = flutterwaveProvider;
        this.createPayment = async (data) => {
            return await this.paymentRepository.create(data);
        };
        this.createPaymentLink = async (payment) => {
            const user = await this.userService.getCurrentUser({ _id: payment.userId });
            let link;
            if (payment.paymentMethod === payment_interface_1.PaymentTypes.Flutterwave) {
                if (!user)
                    throw new ApiError_1.BadRequestError("User Not Found");
                link = await this.flutterwaveProvider.generatePaymentLink(payment, user);
            }
            else {
                throw new ApiError_1.BadRequestError("Payment Method not Available");
            }
            return { data: link, message: "Payment Link Generated Successfully" };
        };
        this.verifyPayment = async (txID, paymentMethod) => {
            if (paymentMethod === payment_interface_1.PaymentTypes.Flutterwave) {
                const paymentInfo = await this.flutterwaveProvider.verifyPayment(txID);
                const payment = await this.getPaymentByCredentials({ txRef: paymentInfo.tx_ref });
                const amount = Number(paymentInfo.amount);
                if (paymentInfo.status === "successful"
                    && amount === payment.amount
                    && paymentInfo.currency === payment.currency) {
                    const paymentResponse = await this.updatePaymentByCredentials({ txRef: paymentInfo.tx_ref }, { status: payment_interface_1.PaymentStatus.Successful });
                    return paymentResponse;
                }
                else {
                    throw new ApiError_1.BadRequestError("Payment Method not Available");
                }
            }
        };
        this.getAllPayments = async () => {
            return await this.paymentRepository.findAll();
        };
        this.initiatePayment = async (orderRequest) => {
            const order = await this.orderService.createOrder(orderRequest);
            const txRef = (0, uuidv4_1.uuid)();
            const paymentData = {
                orderId: order._id,
                userId: order.userId,
                txRef: txRef,
                currency: order.currency,
                paymentMethod: orderRequest.paymentMethod,
                amount: order.total
            };
            const payment = await this.createPayment(paymentData);
            await this.orderService.updateOrderByCredentials({ _id: order._id }, { paymentId: payment._id });
            if (orderRequest.paymentMethod === payment_interface_1.PaymentTypes.Flutterwave) {
                return await this.createPaymentLink(payment);
            }
            else if (orderRequest.paymentMethod === payment_interface_1.PaymentTypes.Cowry) {
                return await this.payWithCowry(payment);
            }
        };
        this.payWithCowry = async (payment) => {
            // Convert amount to USD then to cowry
            const amountCOY = await this.currencyService.convertToCowry(payment.amount, payment.currency);
            // Debit user
            await this.cowryService.debitCowry(Number(amountCOY), payment.userId.toString());
            // Mark payment as successful
            await this.updatePaymentByCredentials({ _id: payment._id }, { status: payment_interface_1.PaymentStatus.Successful, amount: amountCOY, currency: currency_interface_1.ICurrencyTypes.COWRY });
            // Complete order
            const order = await this.orderService.completeOrder(payment);
            return { data: order, message: "Payment Via Cowry Successful" };
        };
        this.getPaymentsByCredentials = async (data) => {
            return await this.paymentRepository.findAll(data);
        };
        this.getAllPaymentByCategory = async (data) => {
            return await this.paymentRepository.findAll(data);
        };
        this.getPaymentByCredentials = async (data) => {
            const response = await this.paymentRepository.findOne(data);
            if (!response)
                throw new ApiError_1.BadRequestError('Payment with the given credential does not exist.');
            return response;
        };
        this.updatePaymentByCredentials = async (filter, data) => {
            return await this.paymentRepository.updateOne(filter, data);
        };
    }
};
PaymentService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        payment_repository_1.default,
        user_service_1.default,
        order_service_1.default,
        cowry_service_1.default,
        currency_service_1.default,
        providers_1.FlutterwaveProvider])
], PaymentService);
exports.default = PaymentService;
