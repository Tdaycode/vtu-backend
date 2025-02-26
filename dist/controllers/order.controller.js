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
const mongodb_1 = require("mongodb");
const user_service_1 = __importDefault(require("../services/user.service"));
const order_service_1 = __importDefault(require("../services/order.service"));
const payment_service_1 = __importDefault(require("../services/payment.service"));
const product_service_1 = __importDefault(require("../services/product.service"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
const ApiError_1 = require("../utils/ApiError");
let OrderController = class OrderController {
    constructor(userService, orderService, paymentService, productService) {
        this.userService = userService;
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.productService = productService;
        this.createOrderSummary = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { productID, product_id, amount, recipient, electricityType } = req.body;
            const { country } = req.query;
            if (!country)
                throw new ApiError_1.BadRequestError("Country Required");
            const orderRequest = {
                productID, product_id, amount, recipient, electricityType, country
            };
            const product = await this.productService.getProductByCredentials({ _id: new mongodb_1.ObjectId(productID) });
            const order = await this.orderService.createOrderSummary(orderRequest, product);
            return new SuccessResponse_1.SuccessResponse(order, "Order Summary Created Successfully, Proceed to pay");
        });
        this.getAllOrders = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { page, limit, searchTerm } = req.query;
            const userId = req.user._id;
            const orders = await this.orderService.getAllOrders(userId, page, limit, searchTerm);
            return new SuccessResponse_1.SuccessResponse(orders, "Orders Fetched Successfully");
        });
        this.getOrderById = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const userId = req.user._id;
            const order = await this.orderService.getOrderByCredentials({ _id: new mongodb_1.ObjectId(req.params.id), userId: new mongodb_1.ObjectId(userId) });
            return new SuccessResponse_1.SuccessResponse(order, "Order fetched Successfully");
        });
    }
};
OrderController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.default,
        order_service_1.default,
        payment_service_1.default,
        product_service_1.default])
], OrderController);
exports.default = OrderController;
