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
const category_repository_1 = __importDefault(require("../repositories/category.repository"));
const logger_service_1 = require("./logger.service");
const ApiError_1 = require("../utils/ApiError");
let CategoryService = class CategoryService {
    constructor(logger, categoryRepository) {
        this.logger = logger;
        this.categoryRepository = categoryRepository;
        this.createCategory = async (data) => {
            return await this.categoryRepository.create(data);
        };
        this.getAllCategories = async () => {
            return await this.categoryRepository.findAll();
        };
        this.getCategoriesByCredentials = async (data) => {
            return await this.categoryRepository.findAll(data);
        };
        this.getAllProductByCategory = async (data, country) => {
            return await this.categoryRepository.getAllProductByCategory(data, country);
        };
        this.getCategoryByCredentials = async (data) => {
            const response = await this.categoryRepository.findOne(data);
            if (!response)
                throw new ApiError_1.BadRequestError('Category with the given credential does not exist.');
            return response;
        };
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        category_repository_1.default])
], CategoryService);
exports.default = CategoryService;
