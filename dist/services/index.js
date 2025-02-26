"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerClient = exports.CurrencyService = exports.CategoryService = exports.TokenService = exports.UserService = exports.PinService = exports.ProductService = exports.OTPService = exports.PaymentService = exports.OrderService = exports.NotificationService = exports.KYCService = exports.CowryService = void 0;
const cowry_service_1 = __importDefault(require("./cowry.service"));
exports.CowryService = cowry_service_1.default;
const kyc_service_1 = __importDefault(require("./kyc.service"));
exports.KYCService = kyc_service_1.default;
const notification_service_1 = __importDefault(require("./notification.service"));
exports.NotificationService = notification_service_1.default;
const order_service_1 = __importDefault(require("./order.service"));
exports.OrderService = order_service_1.default;
const payment_service_1 = __importDefault(require("./payment.service"));
exports.PaymentService = payment_service_1.default;
const otp_service_1 = __importDefault(require("./otp.service"));
exports.OTPService = otp_service_1.default;
const product_service_1 = __importDefault(require("./product.service"));
exports.ProductService = product_service_1.default;
const pin_service_1 = require("./pin.service");
Object.defineProperty(exports, "PinService", { enumerable: true, get: function () { return pin_service_1.PinService; } });
const user_service_1 = __importDefault(require("./user.service"));
exports.UserService = user_service_1.default;
const token_service_1 = __importDefault(require("./token.service"));
exports.TokenService = token_service_1.default;
const category_service_1 = __importDefault(require("./category.service"));
exports.CategoryService = category_service_1.default;
const currency_service_1 = __importDefault(require("./currency.service"));
exports.CurrencyService = currency_service_1.default;
const logger_service_1 = require("./logger.service");
Object.defineProperty(exports, "LoggerClient", { enumerable: true, get: function () { return logger_service_1.LoggerClient; } });
