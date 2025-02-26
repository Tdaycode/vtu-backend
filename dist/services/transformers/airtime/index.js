"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtimeTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_airtime_transformer_1 = require("../airtime/primeairtime.airtime.transformer");
class AirtimeTransformer {
    static airtime(rawData, provider) {
        const transFormer = AirtimeTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static validate(rawData, provider) {
        const transFormer = AirtimeTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static getTransformer(factoryName) {
        const factory = AirtimeTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.AirtimeTransformer = AirtimeTransformer;
AirtimeTransformer.transformers = {
    primeairtime: primeairtime_airtime_transformer_1.primeairtimeAirtimeTransformer,
};
