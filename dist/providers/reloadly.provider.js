"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadlyProvider = void 0;
const http_client_util_1 = require("../utils/http-client.util");
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
let ReloadlyProvider = class ReloadlyProvider {
    getInternetInfo(receipient, productType, serviceId, product_id) {
        throw new Error('Method not implemented.');
    }
    getTVInfo(receipient, productType, serviceId, product_id) {
        throw new Error('Method not implemented.');
    }
    getElectricityInfo(receipient, productType, serviceId, product_id) {
        throw new Error('Method not implemented.');
    }
    getBettingInfo(id) {
        throw new Error('Method not implemented.');
    }
    getAirtimeTopUpInfo(id) {
        throw new Error('Method not implemented.');
    }
    getDataTopUpInfo(id) {
        throw new Error('Method not implemented.');
    }
    getBillPaymentInfo(id) {
        throw new Error('Method not implemented.');
    }
    //   constructor(public httpClient: HttpClient) { }
    async getPrepaidProductByOperatorID(id) {
        const audience = Config_1.default.reloadlyTopupBaseUrl;
        const url = `${Config_1.default.reloadlyTopupBaseUrl}/operators/${id}`;
        const accessToken = await this.getAccessToken(audience);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async getPrepaidProductsByCountry(countryCode) {
        const audience = Config_1.default.reloadlyTopupBaseUrl;
        const url = `${Config_1.default.reloadlyTopupBaseUrl}/operators/countries/${countryCode}?suggestedAmountsMap=true&suggestedAmounts=true&includeData=true`;
        const accessToken = await this.getAccessToken(audience);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async getAccessToken(audience) {
        const url = `${Config_1.default.reloadlyAuthBaseUrl}/oauth/token`;
        const body = {
            client_id: Config_1.default.reloadlyClientId,
            client_secret: Config_1.default.reloadlyClientSecret,
            grant_type: "client_credentials",
            audience
        };
        const response = await new http_client_util_1.HttpClient(url).post('', body);
        return response.access_token;
    }
};
ReloadlyProvider = __decorate([
    (0, typedi_1.Service)()
], ReloadlyProvider);
exports.ReloadlyProvider = ReloadlyProvider;
