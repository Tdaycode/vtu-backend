"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtimeProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class AirtimeProviderFactory {
    static getProvider(factoryName) {
        const factory = AirtimeProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.AirtimeProviderFactory = AirtimeProviderFactory;
AirtimeProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
