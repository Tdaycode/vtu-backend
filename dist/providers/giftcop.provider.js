"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftCopProvider = void 0;
const uuidv4_1 = require("uuidv4");
const typedi_1 = require("typedi");
const cowry_service_1 = __importDefault(require("../services/cowry.service"));
let GiftCopProvider = class GiftCopProvider {
    async getCatalogAvailability() {
        return true;
    }
    async fulfillOrder(productId, amount, recipient) {
        const reference = (0, uuidv4_1.uuid)();
        const cowry = await cowry_service_1.default.createCowryVoucher(amount);
        const response = {
            "Gift Card Number": cowry.code,
            "Gift Card PIN": cowry.pin
        };
        const cardInfo = {
            "cardSerialNumber": cowry.code,
            "cardPIN": cowry.pin,
            "claimLink": "N/A"
        };
        return { reference, data: response, cardInfo };
    }
};
GiftCopProvider = __decorate([
    (0, typedi_1.Service)()
], GiftCopProvider);
exports.GiftCopProvider = GiftCopProvider;
