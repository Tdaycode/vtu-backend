"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.primeairtimeAirtimeTransformer = void 0;
const big_js_1 = __importDefault(require("big.js"));
function primeairtimeAirtimeTransformer(data) {
    let serviceData = {};
    serviceData.type = data.type;
    serviceData.provider = data.provider;
    serviceData.products = data.products;
    const newArr = serviceData.products.map((element, index) => {
        const dataElement = data.products[index];
        return {
            currency: dataElement.currency,
            max_amount: (dataElement.openRangeMax).toString(),
            min_amount: "50",
            hasOpenRange: true,
            name: data.opts.operator,
            product_id: dataElement.product_id
        };
    });
    if (data?.validate) {
        const isFound = newArr.some(item => {
            if (item.product_id === data.product_id) {
                return true;
            }
            return false;
        });
        const result = (0, big_js_1.default)(data?.amount).lte(newArr[0].max_amount) && (0, big_js_1.default)(data?.amount).gte(newArr[0].min_amount);
        serviceData.valid = result && isFound;
    }
    serviceData.products = newArr;
    return serviceData;
}
exports.primeairtimeAirtimeTransformer = primeairtimeAirtimeTransformer;
