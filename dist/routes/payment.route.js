"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const webhook_middleware_1 = __importDefault(require("../middlewares/webhook.middleware"));
const typedi_1 = require("typedi");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const payments_1 = require("../validations/payments");
const router = express_1.default.Router();
const paymentController = typedi_1.Container.get(payment_controller_1.default);
const authMiddleware = typedi_1.Container.get(auth_middleware_1.default);
const webhookMiddleware = typedi_1.Container.get(webhook_middleware_1.default);
router.post('/', [authMiddleware.user, validate_middleware_1.default.validate(payments_1.CreatePaymentValidation), authMiddleware.verifyPin,
    authMiddleware.verifyPhone, authMiddleware.checkUserTransactionLimit], paymentController.initiatePayment);
router.post('/webhook/flutterwave', webhookMiddleware.validateFlutterwaveWebhook, paymentController.completeFlutterwavePayment);
router.patch('/test/:paymentId', paymentController.completeOrder);
exports.default = router;
