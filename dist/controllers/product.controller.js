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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const services_1 = require("../services");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const SuccessResponse_1 = require("../utils/SuccessResponse");
let AuthController = class AuthController {
    constructor(userService, productService, categoryService) {
        this.userService = userService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.getAllProducts = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { country } = req.query;
            const products = await this.categoryService.getAllProductByCategory({}, country);
            return new SuccessResponse_1.SuccessResponse(products, "Products Fetched Successful");
        });
        this.getProductsById = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const product = await this.productService.getProductByCredentials({ sid: req.params.id });
            return new SuccessResponse_1.SuccessResponse(product, "Product fetched Successful");
        });
        this.getProductsByCategory = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { country } = req.query;
            const products = await this.categoryService.getAllProductByCategory({ sid: req.params.id }, country);
            return new SuccessResponse_1.SuccessResponse(products[0] ?? null, "Products fetched Fetched");
        });
        this.getProductInfo = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { receipient } = req.query;
            const { id } = req.params;
            const info = await this.productService.getProductInfo(id, receipient);
            return new SuccessResponse_1.SuccessResponse(info, "Product Info Fetched");
        });
        this.searchProduct = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { searchTerm, country = "NG" } = req.query;
            const info = await this.productService.searchProduct(searchTerm, country);
            return new SuccessResponse_1.SuccessResponse(info, "Product Search Result Fetched");
        });
        this.getProducts = (0, asyncWrapper_1.asyncWrapper)(async (req) => {
            const { page, limit, searchTerm } = req.query;
            const orders = await this.productService.getAllProducts(page, limit, searchTerm);
            return new SuccessResponse_1.SuccessResponse(orders, "Products Fetched Successfully");
        });
    }
};
AuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [services_1.UserService,
        services_1.ProductService,
        services_1.CategoryService])
], AuthController);
exports.default = AuthController;
