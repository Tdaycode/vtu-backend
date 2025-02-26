"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BettingProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class BettingProviderFactory {
    static getProvider(factoryName) {
        const factory = BettingProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.BettingProviderFactory = BettingProviderFactory;
BettingProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
