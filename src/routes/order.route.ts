import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import OrderController from '../controllers/order.controller';
import { CreateOrderValidation,  FulfillOrderValidation,  GetOrdersStatsValidation,  GetOrdersValidation } from '../validations/order';
import { responseType } from '../utils/helpers';

const router = express.Router();

const orderController = Container.get(OrderController);
const authMiddleware = Container.get(AuthMiddleware);

router.post('/', RequestValidator.validate(CreateOrderValidation), orderController.createOrderSummary);
router.get('/', authMiddleware.user, RequestValidator.validate(GetOrdersValidation, responseType.query), orderController.getAllOrders);
router.get('/stats', authMiddleware.user, RequestValidator.validate(GetOrdersStatsValidation, responseType.query), orderController.getOrderStats);
router.get('/all', authMiddleware.validateAdminUser, RequestValidator.validate(GetOrdersValidation, responseType.query), orderController.getAllOrders);
router.get('/:id', authMiddleware.user, orderController.getOrderById);
router.get('/:id/ref', authMiddleware.user, orderController.getOrderByRef);
router.patch('/:id', authMiddleware.user, orderController.cancelOrder);
router.patch('/:id/refund', authMiddleware.validateAdminUser, orderController.refundOrder);
router.patch('/:id/fulfill', authMiddleware.validateAdminUser, RequestValidator.validate(FulfillOrderValidation), orderController.fulfillOrder);

export default router;
