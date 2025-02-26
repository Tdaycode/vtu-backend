"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GiftCardProviderFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftCardProviderFactory = void 0;
const typedi_1 = require("typedi");
const providers_1 = require("../../providers");
const giftly_provider_1 = require("../../providers/giftly.provider");
const ApiError_1 = require("../../utils/ApiError");
let GiftCardProviderFactory = GiftCardProviderFactory_1 = class GiftCardProviderFactory {
    static getProvider(factoryName) {
        const factory = GiftCardProviderFactory_1.factories[factoryName];
        if (!factory) {
            throw new ApiError_1.NotFoundError('Provider not found');
        }
        return factory;
    }
};
GiftCardProviderFactory.factories = {
    giftly: new giftly_provider_1.GiftlyProvider(),
    giftcop: new providers_1.GiftCopProvider()
};
GiftCardProviderFactory = GiftCardProviderFactory_1 = __decorate([
    (0, typedi_1.Service)()
], GiftCardProviderFactory);
exports.GiftCardProviderFactory = GiftCardProviderFactory;
