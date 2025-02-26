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
const mjml_utils_1 = __importDefault(require("mjml-utils"));
const path_1 = __importDefault(require("path"));
const ApiError_1 = require("../utils/ApiError");
const logger_service_1 = require("./logger.service");
const email_1 = __importDefault(require("../utils/email"));
const htmlVerificationEmail = path_1.default.join(__dirname, '../templates/email-verification/email-verification.html');
const htmlForgotPasswordEmail = path_1.default.join(__dirname, '../templates/forgot-password/forgot-password.html');
const htmlBillPaymentSuccessEmail = path_1.default.join(__dirname, '../templates/bill-payment-successful/index.html');
const htmlGiftCardPaymentSuccessEmail = path_1.default.join(__dirname, '../templates/giftcard-payment-successful/index.html');
const htmlTwoFaAuthenticationEmail = path_1.default.join(__dirname, '../templates/two-fa-authentication/two-fa-authentication.html');
let NotificationService = class NotificationService {
    constructor(logger) {
        this.logger = logger;
        this.sendEmailVerificationEmail = async (name, code, email) => {
            try {
                const contentHtml = await mjml_utils_1.default.inject(htmlVerificationEmail, { name, email, code });
                const _data = await (0, email_1.default)({
                    subject: 'Verify your GiftCop Account',
                    email,
                    html: contentHtml,
                });
                return _data;
            }
            catch (error) {
                this.logger.error('Unable to send email');
                throw new ApiError_1.BadRequestError('Unable to send email');
            }
        };
        this.sendtwoFAEmail = async (name, code, email) => {
            try {
                const contentHtml = await mjml_utils_1.default.inject(htmlTwoFaAuthenticationEmail, { name, email, code });
                const _data = await (0, email_1.default)({
                    subject: 'Two Factor Authentication',
                    email,
                    html: contentHtml,
                });
                return _data;
            }
            catch (error) {
                this.logger.error('Unable to send email');
                throw new ApiError_1.BadRequestError('Unable to send email');
            }
        };
        this.sendForgotPasswordEmail = async (name, code, email) => {
            try {
                const contentHtml = await mjml_utils_1.default.inject(htmlForgotPasswordEmail, { name, email, code });
                const _data = await (0, email_1.default)({
                    subject: 'Forgot Password - Reset Your Gift Cop Password',
                    email,
                    html: contentHtml,
                });
                return _data;
            }
            catch (error) {
                this.logger.error('Unable to send email');
                throw new ApiError_1.BadRequestError('Unable to send email');
            }
        };
        this.sendBillPaymentSuccessEmail = async (data) => {
            const { currency, amount, name, txRef, recipient, type, paymentMethod, date, email } = data;
            try {
                const contentHtml = await mjml_utils_1.default.inject(htmlBillPaymentSuccessEmail, { currency, amount, name, txRef, recipient, type, paymentMethod, date });
                const _data = await (0, email_1.default)({
                    subject: 'Bill Payment Successful',
                    email,
                    html: contentHtml,
                });
                return _data;
            }
            catch (error) {
                this.logger.error('Unable to send email');
                throw new ApiError_1.BadRequestError('Unable to send email');
            }
        };
        this.sendGiftcardPaymentSuccessEmail = async (data) => {
            const { currency, amount, name, txRef, recipient, type, paymentMethod, date, email, cardSerialNumber, cardPIN, claimLink } = data;
            try {
                const contentHtml = await mjml_utils_1.default.inject(htmlGiftCardPaymentSuccessEmail, { currency, amount, name, txRef, recipient,
                    type, paymentMethod, date, cardSerialNumber, cardPIN, claimLink });
                const _data = await (0, email_1.default)({
                    subject: 'Gift Card Purchase Successful',
                    email,
                    html: contentHtml,
                });
                return _data;
            }
            catch (error) {
                this.logger.error('Unable to send email');
                throw new ApiError_1.BadRequestError('Unable to send email');
            }
        };
    }
};
NotificationService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient])
], NotificationService);
exports.default = NotificationService;
