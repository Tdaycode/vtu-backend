"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_data_transformer_1 = require("./primeairtime.data.transformer");
class DataTransformer {
    static Data(rawData, provider) {
        const transFormer = DataTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static validate(rawData, provider) {
        const transFormer = DataTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static getTransformer(factoryName) {
        const factory = DataTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.DataTransformer = DataTransformer;
DataTransformer.transformers = {
    primeairtime: primeairtime_data_transformer_1.primeairtimeDataTransformer,
};
