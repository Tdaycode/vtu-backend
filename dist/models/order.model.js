"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedOrder = exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const order_interface_1 = require("../interfaces/order.interface");
// A Schema corresponding to the document interface.
const orderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, required: true },
    reference: { type: String },
    orderStatusMessage: { type: String },
    userId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
    },
    product: {
        id: {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: 'Product',
            required: true
        },
        externalId: { type: String, required: true },
        name: { type: String },
        type: { type: String },
        amount: { type: Number }
    },
    status: {
        type: String,
        enum: order_interface_1.OrderStatus,
        default: order_interface_1.OrderStatus.Pending
    },
    prepaid: { type: Boolean },
    currency: { type: String, default: "NGN" },
    additionalInfo: { type: Object, default: {} },
    recipient: { type: String, required: true },
    amount: { type: Number, required: true },
    amountUSD: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
}, {
    timestamps: true,
});
orderSchema.plugin(mongoose_paginate_v2_1.default);
orderSchema.index({ orderNumber: "text" });
// Order Model
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.Order = Order;
// create the paginated model
const PaginatedOrder = (0, mongoose_1.model)('Order', orderSchema, 'orders');
exports.PaginatedOrder = PaginatedOrder;
