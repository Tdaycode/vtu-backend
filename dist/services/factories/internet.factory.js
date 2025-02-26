"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternetProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class InternetProviderFactory {
    static getProvider(factoryName) {
        const factory = InternetProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.InternetProviderFactory = InternetProviderFactory;
InternetProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
