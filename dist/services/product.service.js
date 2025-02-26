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
const product_repository_1 = __importDefault(require("../repositories/product.repository"));
const ApiError_1 = require("../utils/ApiError");
const product_interface_1 = require("../interfaces/product.interface");
const providers_1 = require("../providers");
const factories_1 = require("./factories");
const transformers_1 = require("./transformers");
const logger_service_1 = require("./logger.service");
const currency_service_1 = __importDefault(require("./currency.service"));
const _1 = require(".");
let ProductService = class ProductService {
    constructor(logger, productRepository, primeAirtimeProvider, currencyService, cowryService) {
        this.logger = logger;
        this.productRepository = productRepository;
        this.primeAirtimeProvider = primeAirtimeProvider;
        this.currencyService = currencyService;
        this.cowryService = cowryService;
        this.creatProduct = async (data) => {
            return await this.productRepository.create(data);
        };
        this.getAllProducts = async (page, limit, searchTerm) => {
            const _page = parseInt(page) ? parseInt(page) : 1;
            const _limit = parseInt(limit) ? parseInt(limit) : 10;
            const skip = (_page - 1) * _limit;
            let filter = {}, sort = {};
            if (searchTerm) {
                const regexQuery = new RegExp(searchTerm, 'i');
                filter = {
                    ...filter,
                    name: { $regex: regexQuery }
                };
                sort = {};
            }
            return await this.productRepository.findAllWithPagination(filter, sort, skip, _limit);
        };
        this.getProducts = async () => {
            return await this.productRepository.findAll();
        };
        this.getProductsByCredentials = async (data) => {
            return await this.productRepository.findAll(data);
        };
        this.getProductById = async (productId) => {
            const _productId = new mongodb_1.ObjectId(productId.toString());
            return await this.productRepository.findOne({ _id: new mongodb_1.ObjectId(_productId) });
        };
        this.getAllProductByCategory = async (data) => {
            return await this.productRepository.findAll(data);
        };
        this.getProductByCredentials = async (data) => {
            const response = await this.productRepository.findOne(data);
            if (!response)
                throw new ApiError_1.BadRequestError('Product with the given credential does not exist.');
            return response;
        };
        this.searchProduct = async (searchTerm, country) => {
            const response = await this.productRepository.search(searchTerm, country);
            return response;
        };
        this.getProductInfo = async (productId, receipient) => {
            let provider, rawInfo = {}, transformedData;
            const response = await this.productRepository.findOne({ sid: productId });
            if (!response)
                throw new ApiError_1.BadRequestError('Product with the given credential does not exist.');
            // Check Active Provider
            const providers = response.providers?.filter(item => item.active === true);
            if (!providers || providers.length === 0)
                throw new ApiError_1.BadRequestError("No Provider available");
            const product_id = providers[0].productId;
            const serviceId = providers[0].serviceId;
            const currentProvider = providers[0].name;
            const productType = response.type;
            const rawData = {
                type: productType,
                provider: currentProvider,
                productName: response.name
            };
            switch (productType) {
                case product_interface_1.ProductTypes.Airtime:
                    provider = factories_1.AirtimeProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getAirtimeTopUpInfo(receipient);
                    transformedData = transformers_1.AirtimeTransformer.airtime({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Data:
                    provider = factories_1.AirtimeProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getDataTopUpInfo(receipient);
                    transformedData = transformers_1.DataTransformer.Data({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Betting:
                    provider = factories_1.BettingProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getBettingInfo(receipient, productType, serviceId, product_id);
                    transformedData = transformers_1.BettingTransformer.betting({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Electricity:
                    provider = factories_1.ElectricityProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getElectricityInfo(receipient, productType, serviceId, product_id);
                    transformedData = transformers_1.ElectricityTransformer.electricity({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.TV:
                    provider = factories_1.TVProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getTVInfo(receipient, productType, serviceId, product_id);
                    transformedData = transformers_1.TVTransformer.tv({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Internet:
                    provider = factories_1.InternetProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getInternetInfo(receipient, productType, serviceId, product_id);
                    transformedData = transformers_1.InternetTransformer.internet({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                // case ProductTypes.GiftCard:
                //   rawInfo = { product_id, country, productCurrency: response.currency };
                //   transformedData = this.cowryService.getCowryProductInfo({ ...rawInfo, ...rawData });
                //   break; 
                default:
                    throw new ApiError_1.BadRequestError(`Product Type "${productType}" not found`);
            }
            return transformedData;
        };
    }
};
ProductService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        product_repository_1.default,
        providers_1.PrimeAirtimeProvider,
        currency_service_1.default,
        _1.CowryService])
], ProductService);
exports.default = ProductService;
