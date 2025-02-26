"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.primeairtimeInternetTransformer = void 0;
const big_js_1 = __importDefault(require("big.js"));
function primeairtimeInternetTransformer(data) {
    let serviceData = {};
    serviceData.type = data.type;
    serviceData.provider = data.provider;
    serviceData.products = data.products;
    const newArr = serviceData.products.map((element, index) => {
        const dataElement = data.products[index];
        return {
            currency: dataElement.topup_currency,
            amount: (dataElement.topup_value).toString(),
            hasOpenRange: false,
            name: `${data.productName} - ${dataElement.name}`,
            product_id: dataElement.code
        };
    });
    if (data?.validate) {
        const isFound = newArr.some(item => {
            if (item.product_id === data.product_id &&
                (0, big_js_1.default)(data?.amount).eq(item.amount)) {
                return true;
            }
            return false;
        });
        serviceData.valid = isFound;
    }
    serviceData.products = newArr;
    return serviceData;
}
exports.primeairtimeInternetTransformer = primeairtimeInternetTransformer;
