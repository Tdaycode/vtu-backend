"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BettingTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_betting_transformer_1 = require("./primeairtime.betting.transformer");
class BettingTransformer {
    static betting(rawData, provider) {
        const transFormer = BettingTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static validate(rawData, provider) {
        const transFormer = BettingTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static getTransformer(factoryName) {
        const factory = BettingTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.BettingTransformer = BettingTransformer;
BettingTransformer.transformers = {
    primeairtime: primeairtime_betting_transformer_1.primeairtimeBettingTransformer,
};
