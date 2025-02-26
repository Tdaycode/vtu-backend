"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("../models/product.model");
const typedi_1 = require("typedi");
let ProductRepository = class ProductRepository {
    constructor() {
        this.create = async (data) => {
            const product = new product_model_1.Product(data);
            return await product.save();
        };
        this.findAll = async (filter = {}) => {
            return await product_model_1.Product.find(filter).lean();
        };
        this.search = async (searchString, country) => {
            const regexQuery = new RegExp(searchString, 'i');
            const query = {
                name: { $regex: regexQuery },
                $or: [
                    { displayCountries: "GLC" },
                    { displayCountries: { $in: [country] } }
                ]
            };
            return await product_model_1.Product.find(query)
                .select("name imageUrl type category sid").lean();
        };
        this.findById = async (id) => {
            return await product_model_1.Product.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            return await product_model_1.Product.findOne(filter);
        };
        this.updateOne = async (filter, data) => {
            const response = await product_model_1.Product.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
        this.deleteMany = async (filter = {}) => {
            await product_model_1.Product.deleteMany(filter);
        };
        this.findAllWithPagination = async (filter = {}, sort = {}, skip, limit) => {
            const options = {
                sort: sort,
                lean: true,
                leanWithId: false,
                offset: skip,
                limit: limit
            };
            return await product_model_1.PaginatedProduct.paginate(filter, options);
        };
    }
};
ProductRepository = __decorate([
    (0, typedi_1.Service)()
], ProductRepository);
exports.default = ProductRepository;
