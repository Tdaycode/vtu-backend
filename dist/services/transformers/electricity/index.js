"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricityTransformer = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const primeairtime_electricity_transformer_1 = require("./primeairtime.electricity.transformer");
class ElectricityTransformer {
    static electricity(rawData, provider) {
        const transFormer = ElectricityTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        return transformedData;
    }
    static getTransformer(factoryName) {
        const factory = ElectricityTransformer.transformers[factoryName];
        if (!factory)
            throw new ApiError_1.NotFoundError('Transformer not found');
        return factory;
    }
    static validate(rawData, provider) {
        const transFormer = ElectricityTransformer.getTransformer(provider);
        const transformedData = transFormer(rawData);
        if (transformedData?.valid === true)
            return true;
        return false;
    }
    static isResponseFormatted(rawData) {
        return (rawData.type && rawData.provider && rawData.products);
    }
}
exports.ElectricityTransformer = ElectricityTransformer;
ElectricityTransformer.transformers = {
    primeairtime: primeairtime_electricity_transformer_1.primeairtimeElectricityTransformer,
};
