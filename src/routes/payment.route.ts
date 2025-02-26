import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import WebhookMiddleware from '../middlewares/webhook.middleware';
import { Container } from 'typedi';
import PaymentController from '../controllers/payment.controller';
import { CreatePaymentValidation } from '../validations/payments';

const router = express.Router();

const paymentController = Container.get(PaymentController);
const authMiddleware = Container.get(AuthMiddleware);
const webhookMiddleware = Container.get(WebhookMiddleware); 

router.post('/', [authMiddleware.user, RequestValidator.validate(CreatePaymentValidation), authMiddleware.verifyPin, 
    authMiddleware.verifyPhone, authMiddleware.checkUserTransactionLimit], paymentController.initiatePayment);
router.post('/webhook/flutterwave', webhookMiddleware.validateFlutterwaveWebhook, paymentController.completeFlutterwavePayment);
router.patch('/test/:paymentId', paymentController.completeOrder);

export default router;
