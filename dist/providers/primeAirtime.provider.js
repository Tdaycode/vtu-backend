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
exports.PrimeAirtimeProvider = void 0;
const http_client_util_1 = require("../utils/http-client.util");
const uuidv4_1 = require("uuidv4");
const Config_1 = __importDefault(require("../config/Config"));
const typedi_1 = require("typedi");
const token_service_1 = __importDefault(require("../services/token.service"));
const token_interface_1 = require("../interfaces/token.interface");
const crypto_1 = require("../utils/crypto");
const product_interface_1 = require("../interfaces/product.interface");
const ApiError_1 = require("../utils/ApiError");
const order_interface_1 = require("../interfaces/order.interface");
let PrimeAirtimeProvider = class PrimeAirtimeProvider {
    async getAirtimeTopUpInfo(phoneNumber) {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/topup/info/${phoneNumber}`;
        const accessToken = await this.retrieveAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async fulfillOrder(type, productId, amount, recipient, extra) {
        const reference = (0, uuidv4_1.uuid)();
        let response, data = {};
        if (Config_1.default.activeEnvironment === "development")
            return { reference, data };
        switch (type) {
            case product_interface_1.ProductTypes.Airtime || product_interface_1.ProductTypes.Data:
                response = await this.executeAirtimeTopUp(type, recipient, productId, amount.toString(), reference);
                break;
            case product_interface_1.ProductTypes.Electricity:
                const prepaid = extra.prepaid;
                response = await this.executeElectricityTopUp(recipient, productId, amount.toString(), reference, prepaid);
                if (response?.pin_based) {
                    data = {
                        "Electricity PIN": response?.pin_code,
                        "PIN Message": response?.pin_option1
                    };
                }
                break;
            case product_interface_1.ProductTypes.TV:
                response = await this.executeTVTopUp(recipient, productId, reference);
                break;
            case product_interface_1.ProductTypes.Betting:
                response = await this.executeBettingTopUp(recipient, amount.toString(), productId, reference);
                break;
            default:
                throw new Error(`Product Type "${type}" not found`);
        }
        let orderStatus = "";
        if (Number(response.status) === 201) {
            orderStatus = order_interface_1.OrderStatus.Successful;
        }
        else if (Number(response.status) === 208) {
            orderStatus = order_interface_1.OrderStatus.Pending;
        }
        else {
            orderStatus = order_interface_1.OrderStatus.Failed;
        }
        return { reference, data, orderStatusMessage: response.message, orderStatus };
    }
    async getDataTopUpInfo(phoneNumber) {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/datatopup/info/${phoneNumber}`;
        const accessToken = await this.retrieveAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async getBettingInfo(receipient, productType, serviceId, product_id) {
        const response = await this.getBillPayment(receipient, productType, serviceId, product_id);
        return response;
    }
    async getInternetInfo(receipient, productType, serviceId, product_id) {
        const response = await this.getBillPayment(receipient, productType, serviceId, product_id);
        return response;
    }
    async getElectricityInfo(receipient, productType, serviceId, product_id) {
        const response = await this.getBillPayment(receipient, productType, serviceId, product_id);
        return response;
    }
    async getTVInfo(receipient, productType, serviceId, product_id) {
        const response = await this.getBillPayment(receipient, productType, serviceId, product_id);
        return response;
    }
    async getBillPayment(receipient, productType, serviceId, product_id) {
        let result, info;
        if (product_id === "BPE-NGCABENIN-OR") {
            const product = [{
                    currency: "NGN",
                    max_denomination: "300000",
                    minAmount: "500",
                    hasOpenRange: true,
                    name: "Benin Electricity - BEDC",
                    product_id
                }];
            result = await this.validateElectricityInput(receipient, product_id);
            info = { ...result, products: product };
            return info;
        }
        const services = await this.getBillPaymentInfo(serviceId);
        const product = services.products.filter(item => item.product_id === product_id);
        if (product[0]?.hasValidate) {
            if (productType === product_interface_1.ProductTypes.Betting)
                result = await this.validateBettingInput(receipient, product_id);
            if (productType === product_interface_1.ProductTypes.TV && product[0].name.includes("DSTV") || product[0].name.includes("GOTV")) {
                const data = await this.validateTVInput(receipient);
                result = { ...data, productName: product[0].name, products: data.upgrades };
                delete result["upgrades"];
                return result;
            }
            if (productType === product_interface_1.ProductTypes.Electricity)
                result = await this.validateElectricityInput(receipient, product_id);
        }
        info = { products: product, ...result };
        if (product[0]?.hasProductList) {
            const data = await this.getBillPaymentProductList(serviceId, product_id);
            if (data.products.length > 0)
                info = { ...info, products: data.products };
        }
        if (product[0].name === "StarTimes") {
            const data = await this.getBillPaymentProductList(serviceId, product_id);
            if (data.products.length > 0)
                info = { ...info, productName: product[0].name, products: data.products };
        }
        return info;
    }
    async getBillPaymentInfo(type) {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/country/NG/${type}`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async getBillPaymentProductList(type, productId) {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/${type}/${productId}`;
        const accessToken = await this.retrieveAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
    async validateBettingInput(customerId, product_id) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/lottery/validate`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = { customerId, product_id };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw new ApiError_1.BadRequestError("Unrecognized Customer");
        }
    }
    async validateElectricityInput(meterNumber, product_id) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/electricity/${product_id}/validate`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = { "meter": meterNumber };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw new ApiError_1.BadRequestError("Invalid Meter Number");
        }
    }
    async validateTVInput(cardNumber) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/dstvnew/${cardNumber}`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await new http_client_util_1.HttpClient(url).get('', headers);
            return response;
        }
        catch (error) {
            throw new ApiError_1.BadRequestError("Please make sure your operator and Customer ID are correct. Otherwise, please check your account status with your operator.");
        }
    }
    async executeAirtimeTopUp(type, phoneNumber, product_id, denomination, reference) {
        try {
            const productType = product_interface_1.ProductTypes.Airtime ? "topup" : "datatopup";
            const url = `${Config_1.default.primeAirtimeBaseUrl}/${productType}/exec/${phoneNumber}`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = {
                product_id, denomination,
                customer_reference: reference
            };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw Error(error);
        }
    }
    async executeElectricityTopUp(meterNumber, product_id, denomination, reference, prepaid) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/electricity/${meterNumber}`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = {
                product_id, denomination, prepaid,
                customer_reference: reference
            };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw Error(error);
        }
    }
    async executeTVTopUp(cardNumber, product_id, reference) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/dstvnew/${cardNumber}`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = { product_id, customer_reference: reference };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw Error(error);
        }
    }
    async executeBettingTopUp(customerID, amount, product_id, reference) {
        try {
            const url = `${Config_1.default.primeAirtimeBaseUrl}/billpay/lottery/${customerID}`;
            const accessToken = await this.retrieveAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const body = { product_id, customer_reference: reference, amount };
            const response = await new http_client_util_1.HttpClient(url).post('', body, headers);
            return response;
        }
        catch (error) {
            throw Error(error);
        }
    }
    async getAccessToken() {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/auth`;
        const body = {
            username: Config_1.default.primeAirtimeUserName,
            password: Config_1.default.primeAirtimePassword
        };
        const response = await new http_client_util_1.HttpClient(url).post('', body);
        return response;
    }
    async storeAccessToken(tokenObject) {
        const expiryDate = new Date(tokenObject.expires);
        const hashedToken = await (0, crypto_1.encode)(tokenObject.token);
        await token_service_1.default.storeToken(hashedToken, expiryDate, token_interface_1.TokenTypes.PrimeAirtime);
    }
    async retrieveAccessToken() {
        const response = await token_service_1.default.retrieveToken(token_interface_1.TokenTypes.PrimeAirtime);
        if (!response) {
            const tokenObj = await this.getAccessToken();
            await this.storeAccessToken(tokenObj);
            return tokenObj.token;
        }
        const expiryDate = new Date(response.expires);
        if (expiryDate > new Date()) {
            const token = await (0, crypto_1.decode)(response.token);
            return token;
        }
        else {
            const tokenObj = await this.getAccessToken();
            await this.storeAccessToken(tokenObj);
            return tokenObj.token;
        }
    }
    async refreshAccessToken(token) {
        const url = `${Config_1.default.primeAirtimeBaseUrl}/reauth`;
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const response = await new http_client_util_1.HttpClient(url).get('', headers);
        return response;
    }
};
PrimeAirtimeProvider = __decorate([
    (0, typedi_1.Service)()
], PrimeAirtimeProvider);
exports.PrimeAirtimeProvider = PrimeAirtimeProvider;
