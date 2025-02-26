"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const typedi_1 = require("typedi");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const order_1 = require("../validations/order");
const helpers_1 = require("../utils/helpers");
const router = express_1.default.Router();
const orderController = typedi_1.Container.get(order_controller_1.default);
const authMiddleware = typedi_1.Container.get(auth_middleware_1.default);
router.post('/', validate_middleware_1.default.validate(order_1.CreateOrderValidation), orderController.createOrderSummary);
router.get('/', authMiddleware.user, validate_middleware_1.default.validate(order_1.GetOrdersValidation, helpers_1.responseType.query), orderController.getAllOrders);
router.get('/:id', authMiddleware.user, validate_middleware_1.default.validate(order_1.GetOrdersValidation, helpers_1.responseType.query), orderController.getOrderById);
exports.default = router;
