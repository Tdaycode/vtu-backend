import express from 'express';
import RequestValidator from '../middlewares/validate.middleware';
import AuthMiddleware from '../middlewares/auth.middleware';
import { Container } from 'typedi';
import OrderController from '../controllers/order.controller';
import { CreateOrderValidation,  GetOrdersValidation } from '../validations/order';
import { responseType } from '../utils/helpers';

const router = express.Router();

const orderController = Container.get(OrderController);
const authMiddleware = Container.get(AuthMiddleware);

router.post('/', RequestValidator.validate(CreateOrderValidation), orderController.createOrderSummary);
router.get('/', authMiddleware.user, RequestValidator.validate(GetOrdersValidation, responseType.query), orderController.getAllOrders);
router.get('/:id', authMiddleware.user, RequestValidator.validate(GetOrdersValidation, responseType.query), orderController.getOrderById);

export default router;
