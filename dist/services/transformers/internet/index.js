"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternetTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_internet_transformer_1 = require("./primeairtime.internet.transformer");
class InternetTransformer {
    static internet(rawData, provider) {
        const transFormer = InternetTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static getTransformer(factoryName) {
        const factory = InternetTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static validate(rawData, provider) {
        const transFormer = InternetTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.InternetTransformer = InternetTransformer;
InternetTransformer.transformers = {
    primeairtime: primeairtime_internet_transformer_1.primeairtimeInternetTransformer,
};
