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
const big_js_1 = __importDefault(require("big.js"));
const logger_service_1 = require("./logger.service");
const ApiError_1 = require("../utils/ApiError");
const currency_repository_1 = __importDefault(require("../repositories/currency.repository"));
const exchangerate_provider_1 = require("../providers/exchangerate.provider");
const currency_interface_1 = require("../interfaces/currency.interface");
let CurrencyService = class CurrencyService {
    constructor(logger, currencyRepository, exchangeRateProvider) {
        this.logger = logger;
        this.currencyRepository = currencyRepository;
        this.exchangeRateProvider = exchangeRateProvider;
        this.getAllCurrency = async () => {
            return await this.currencyRepository.findAll();
        };
        this.getCurrency = async (code) => {
            const response = await this.currencyRepository.findOne({ code });
            if (!response)
                throw new ApiError_1.BadRequestError('Currency with the given credential does not exist.');
            return response;
        };
        this.updateCurrencyRate = async (code, rate, expires = new Date()) => {
            const response = await this.currencyRepository.updateOne({ code }, { rate, expires });
            if (!response)
                throw new ApiError_1.BadRequestError('Currency with the given credential does not exist.');
            return response;
        };
        this.convertLocalCurrency = async (amount, fromCurrency, toCurrency) => {
            try {
                // Get the exchange rates for both currencies
                const [fromRate, toRate] = await Promise.all([
                    this.getCurrency(fromCurrency),
                    this.getCurrency(toCurrency)
                ]);
                // Convert the amount using the exchange rates
                const convertedAmount = new big_js_1.default(amount).times(toRate.rate).div(fromRate.rate);
                // Round the result to two decimal places
                return convertedAmount.toFixed(2);
            }
            catch (error) {
                console.log(error);
                throw new ApiError_1.BadRequestError('Error occurred while fetching conversion rates');
            }
        };
        this.convertCurrency = async (amount, fromCurrency, toCurrency) => {
            const data = await this.exchangeRateProvider.getExchangeRate(`${fromCurrency},${toCurrency}`);
            const fromRate = new big_js_1.default(data.rates[fromCurrency]);
            const toRate = new big_js_1.default(data.rates[toCurrency]);
            const convertedAmount = new big_js_1.default(amount).times(toRate).div(fromRate);
            return convertedAmount.toFixed(2);
        };
        this.convertNGNCurrency = async (amount, currency) => {
            try {
                // Get the exchange rates for both currencies
                const fromRate = await this.getCurrency(currency);
                const toRate = await this.exchangeRateProvider.retrieveNGNUSDRate();
                // Convert the amount using the exchange rates
                const convertedAmount = new big_js_1.default(amount).times(toRate).div(fromRate.rate);
                // Round the result to two decimal places
                return convertedAmount.toFixed(2);
            }
            catch (error) {
                console.log(error);
                throw new ApiError_1.BadRequestError('Error occurred while fetching conversion rates');
            }
        };
        this.convertToCowry = async (amount, currency) => {
            let amountUSD = amount;
            if (currency !== currency_interface_1.ICurrencyTypes.US_DOLLARS) {
                const convertFunction = currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
                const _amount = await this[convertFunction](amount, currency, currency_interface_1.ICurrencyTypes.US_DOLLARS);
                amountUSD = Number(_amount);
            }
            const amountCOY = await this.convertLocalCurrency(amountUSD, currency_interface_1.ICurrencyTypes.US_DOLLARS, currency_interface_1.ICurrencyTypes.COWRY);
            return amountCOY;
        };
    }
};
CurrencyService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        currency_repository_1.default,
        exchangerate_provider_1.ExchangeRateProvider])
], CurrencyService);
exports.default = CurrencyService;
