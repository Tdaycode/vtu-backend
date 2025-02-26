import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import PaymentController from '../controllers/payment.controller';
import { CreatePaymentValidation, GetAvailablePaymentMethodsValidation, GetPaymentsValidation } from '../validations/payments';

const router = express.Router();

const paymentController = Container.get(PaymentController);
const authMiddleware = Container.get(AuthMiddleware);

router.post('/', [authMiddleware.user, RequestValidator.validate(CreatePaymentValidation), authMiddleware.checkSpendingStatus, authMiddleware.verifyPin, 
    authMiddleware.verifyPhone, authMiddleware.checkUserTransactionLimit], paymentController.initiatePayment);
router.get('/', RequestValidator.validate(GetPaymentsValidation), authMiddleware.validateAdminUser, paymentController.getPayments);
router.get('/methods', [authMiddleware.user, RequestValidator.validate(GetAvailablePaymentMethodsValidation, "query")], 
    paymentController.getAvailablePaymentMethods); 
router.get('/:id', authMiddleware.validateAdminUser, paymentController.getPaymentsById);
router.patch('/test/:paymentId', paymentController.completeOrder);

export default router;
