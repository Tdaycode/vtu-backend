"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class DataProviderFactory {
    static getProvider(factoryName) {
        const factory = DataProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.DataProviderFactory = DataProviderFactory;
DataProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
