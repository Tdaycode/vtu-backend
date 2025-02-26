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
exports.GiftlyProvider = void 0;
const moment_1 = __importDefault(require("moment"));
const uuidv4_1 = require("uuidv4");
const http_client_util_1 = require("../utils/http-client.util");
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
const token_service_1 = __importDefault(require("../services/token.service"));
const token_interface_1 = require("../interfaces/token.interface");
const crypto_1 = require("../utils/crypto");
const ApiError_1 = require("../utils/ApiError");
let GiftlyProvider = class GiftlyProvider {
    async getCatalogs() {
        const url = `${Config_1.default.giftlyBaseUrl}/catalogs/`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async getCatalogAvailability(product_sku, price) {
        const url = `${Config_1.default.giftlyBaseUrl}/catalogs/${product_sku}/availability/?item_count=1&price=${price}`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response.availability;
    }
    async fulfillOrder(productId, amount, recipient) {
        const reference = (0, uuidv4_1.uuid)();
        const order = await this.createOrder(reference, productId, amount, recipient);
        const orderCard = await this.getOrderCards(order.reference_code);
        const response = {
            "Gift Card Number": orderCard.card_number,
            "Claim Link": orderCard.claim_url,
            "Gift Card PIN": orderCard.pin_code
        };
        const cardInfo = {
            "cardSerialNumber": orderCard.card_number,
            "cardPIN": orderCard.pin_code,
            "claimLink": orderCard.claim_url
        };
        return { reference, data: response, cardInfo };
    }
    async createOrder(reference, sku, price, recipient) {
        const url = `${Config_1.default.giftlyBaseUrl}/orders/`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const body = {
            sku, quantity: 1, price, reference_code: reference,
            pre_order: false, destination: recipient,
            terminal_id: Config_1.default.giftlyTerminalId,
            terminal_pin: Config_1.default.giftlyTerminalPin
        };
        const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
        return response;
    }
    async getOrderCards(reference) {
        const url = `${Config_1.default.giftlyBaseUrl}/orders/${reference}/cards/`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response.results[0];
    }
    async getAccessToken() {
        try {
            const url = `${Config_1.default.giftlyBaseUrl}/auth/token/`;
            const body = {
                client_id: Config_1.default.giftlyClientId,
                secret_key: Config_1.default.giftlySecretKey
            };
            const response = await new http_client_util_1.HttpClient(url).post('', body);
            return response;
        }
        catch (error) {
            throw new ApiError_1.BadRequestError("error");
        }
    }
    async storeAccessToken(tokenObject) {
        const expiryDate = ((0, moment_1.default)().add(tokenObject.expire, 'seconds')).toDate();
        const hashedToken = await (0, crypto_1.encode)(tokenObject.access);
        await token_service_1.default.storeToken(hashedToken, expiryDate, token_interface_1.TokenTypes.Giftly);
    }
    async retrieveAccessToken() {
        const response = await token_service_1.default.retrieveToken(token_interface_1.TokenTypes.Giftly);
        if (!response) {
            const tokenObj = await this.getAccessToken();
            await this.storeAccessToken(tokenObj);
            return tokenObj.access;
        }
        const expiryDate = new Date(response.expires);
        if (expiryDate > new Date()) {
            const token = await (0, crypto_1.decode)(response.token);
            return token;
        }
        else {
            const tokenObj = await this.getAccessToken();
            await this.storeAccessToken(tokenObj);
            return tokenObj.access;
        }
    }
};
GiftlyProvider = __decorate([
    (0, typedi_1.Service)()
], GiftlyProvider);
exports.GiftlyProvider = GiftlyProvider;
