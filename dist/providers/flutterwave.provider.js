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
exports.FlutterwaveProvider = void 0;
const http_client_util_1 = require("../utils/http-client.util");
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
let FlutterwaveProvider = class FlutterwaveProvider {
    async generatePaymentLink(payment, user) {
        const url = `${Config_1.default.flutterwaveBaseUrl}/payments`;
        const accessToken = Config_1.default.flutterwaveSecret;
        const headers = { Authorization: `Bearer ${accessToken}` };
        const body = {
            tx_ref: payment.txRef,
            currency: payment.currency,
            amount: (payment.amount).toString(),
            redirect_url: Config_1.default.flutterwaveRedirectUrl,
            meta: {
                paymentId: (payment._id).toString(),
                orderId: (payment.orderId).toString(),
            },
            customer: {
                email: user.email,
                name: user.firstName + " " + user.lastName
            },
        };
        const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
        return response.data.link;
    }
    async verifyPayment(txID) {
        const url = `${Config_1.default.flutterwaveBaseUrl}/transactions/${txID}/verify`;
        const accessToken = Config_1.default.flutterwaveSecret;
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response.data;
    }
};
FlutterwaveProvider = __decorate([
    (0, typedi_1.Service)()
], FlutterwaveProvider);
exports.FlutterwaveProvider = FlutterwaveProvider;
