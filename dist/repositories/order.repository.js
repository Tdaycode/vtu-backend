"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("../models/order.model");
const typedi_1 = require("typedi");
let OrderRepository = class OrderRepository {
    constructor() {
        this.create = async (data) => {
            const order = new order_model_1.Order(data);
            return await order.save();
        };
        this.findAll = async (filter = {}) => {
            return await order_model_1.Order.find(filter).lean();
        };
        this.findAllWithPagination = async (filter = {}, skip, limit) => {
            const options = {
                sort: { createdAt: -1 },
                lean: true,
                leanWithId: false,
                offset: skip,
                limit: limit
            };
            return await order_model_1.PaginatedOrder.paginate(filter, options);
        };
        this.findById = async (id) => {
            return await order_model_1.Order.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            return await order_model_1.Order.findOne(filter);
        };
        this.aggregate = async (filter) => {
            return await order_model_1.Order.aggregate(filter);
        };
        this.updateOne = async (filter, data) => {
            const response = await order_model_1.Order.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
    }
};
OrderRepository = __decorate([
    (0, typedi_1.Service)()
], OrderRepository);
exports.default = OrderRepository;
