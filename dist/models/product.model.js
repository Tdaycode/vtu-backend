"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.PaginatedProduct = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const product_interface_1 = require("../interfaces/product.interface");
const helpers_1 = require("../utils/helpers");
// A Schema corresponding to the document interface.
const ProductSchema = new mongoose_1.Schema({
    sid: { type: String, index: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    serviceFeeType: { type: String, enum: product_interface_1.ServiceFeeType, default: product_interface_1.ServiceFeeType.Global },
    serviceFeeAmount: {
        type: { type: String, enum: product_interface_1.ServiceFeeAmountType },
        value: { type: Number },
    },
    discountType: { type: String, enum: product_interface_1.DiscountType, default: product_interface_1.DiscountType.Global },
    discountAmount: {
        type: { type: String, enum: product_interface_1.DiscountAmountType },
        value: { type: Number },
    },
    providers: [{
            name: { type: String, enum: product_interface_1.Providers },
            serviceId: { type: String, enum: product_interface_1.ServiceTypes },
            productId: { type: String },
            active: { type: Boolean },
        }],
    label: { type: String },
    minPrice: { type: String },
    maxPrice: { type: String },
    currency: { type: String, default: "NGN" },
    paymentOptions: { type: String, enum: product_interface_1.PaymentOptions, default: product_interface_1.PaymentOptions.Global },
    allowedPaymentOptions: [{ type: String, enum: product_interface_1.PaymentTypes }, { min: 1 }],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    isAvailable: { type: Boolean, default: true },
    displayCountries: [{ type: String, required: true }, { min: 1 }],
    type: { type: String, enum: product_interface_1.ProductTypes },
}, {
    timestamps: true,
});
ProductSchema.pre('save', function (next) {
    this.sid = (0, helpers_1.generateShortID)();
    next();
});
ProductSchema.plugin(mongoose_paginate_v2_1.default);
ProductSchema.index({ name: "text" });
// Product Model
const Product = (0, mongoose_1.model)('Product', ProductSchema);
exports.Product = Product;
// create the paginated model
const PaginatedProduct = (0, mongoose_1.model)('Product', ProductSchema, 'products');
exports.PaginatedProduct = PaginatedProduct;
