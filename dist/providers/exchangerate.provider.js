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
exports.ExchangeRateProvider = void 0;
const moment_1 = __importDefault(require("moment"));
const http_client_util_1 = require("../utils/http-client.util");
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
const currency_repository_1 = __importDefault(require("../repositories/currency.repository"));
const ApiError_1 = require("../utils/ApiError");
let ExchangeRateProvider = class ExchangeRateProvider {
    constructor(currencyRepository) {
        this.currencyRepository = currencyRepository;
    }
    async getExchangeRate(currency) {
        const url = `${Config_1.default.openExchangeRateBaseUrl}/latest.json?app_id=${Config_1.default.openExchangeRateAppId}&symbols=${currency}`;
        const response = await new http_client_util_1.HttpClient(url).get('');
        return response;
    }
    async getBinanceNGNUSDRate() {
        const url = "https://api4.binance.com/api/v3/ticker/bookTicker?symbol=USDTNGN";
        const response = await new http_client_util_1.HttpClient(url).get('');
        return parseFloat(response.askPrice);
    }
    async getQuidaxNGNUSDRate() {
        const url = "https://www.quidax.com/api/v1/markets/tickers/usdtngn";
        const response = await new http_client_util_1.HttpClient(url).get('');
        return parseFloat(response.data.ticker.sell);
    }
    async getLunoNGNUSDRate() {
        const url = "https://api.luno.com/api/1/ticker?pair=USDCNGN";
        const response = await new http_client_util_1.HttpClient(url).get('');
        return parseFloat(response.ask);
    }
    async getNGNUSDRate() {
        const [quidaxRate, lunoRate] = await Promise.all([
            this.getQuidaxNGNUSDRate(),
            this.getLunoNGNUSDRate(),
        ]);
        const highestRate = Math.max(quidaxRate, lunoRate);
        const rate = Math.ceil(highestRate / 5) * 5;
        return parseFloat(rate.toFixed(2));
    }
    async updateNGNRate(rate) {
        const expires = ((0, moment_1.default)().add(5, 'minutes')).toDate();
        await this.currencyRepository.updateOne({ code: "NGN" }, { rate, expires });
    }
    async retrieveNGNUSDRate() {
        const response = await this.currencyRepository.findOne({ code: "NGN" });
        if (!response)
            throw new ApiError_1.BadRequestError("Cannot fetch currency by credentials");
        const expiryDate = new Date(response.expires);
        if (expiryDate > new Date()) {
            return response.rate;
        }
        else {
            const rate = await this.getNGNUSDRate();
            await this.updateNGNRate(rate);
            return rate;
        }
    }
};
ExchangeRateProvider = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [currency_repository_1.default])
], ExchangeRateProvider);
exports.ExchangeRateProvider = ExchangeRateProvider;
