"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TVProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class TVProviderFactory {
    static getProvider(factoryName) {
        const factory = TVProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.TVProviderFactory = TVProviderFactory;
TVProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
