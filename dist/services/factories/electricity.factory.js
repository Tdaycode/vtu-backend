"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricityProviderFactory = void 0;
const primeAirtime_provider_1 = require("../../providers/primeAirtime.provider");
const ApiError_1 = require("../../utils/ApiError");
class ElectricityProviderFactory {
    static getProvider(factoryName) {
        const factory = ElectricityProviderFactory.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
}
exports.ElectricityProviderFactory = ElectricityProviderFactory;
ElectricityProviderFactory.factories = {
    primeairtime: new primeAirtime_provider_1.PrimeAirtimeProvider()
};
