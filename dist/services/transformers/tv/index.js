"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TVTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_tv_transformer_1 = require("./primeairtime.tv.transformer");
class TVTransformer {
    static tv(rawData, provider) {
        const transFormer = TVTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static getTransformer(factoryName) {
        const factory = TVTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static validate(rawData, provider) {
        const transFormer = TVTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.TVTransformer = TVTransformer;
TVTransformer.transformers = {
    primeairtime: primeairtime_tv_transformer_1.primeairtimeTVTransformer,
};
