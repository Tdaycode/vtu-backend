"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kyc_interface_1 = require("../interfaces/kyc.interface");
// A Schema corresponding to the document interface.
const KYCLevelSchema = new mongoose_1.Schema({
    level: { type: String, required: true, unique: true, enum: kyc_interface_1.KYCLevels },
    dailyLimit: { type: String, required: true },
    monthlyLimit: { type: String, required: true },
    baseCurrency: { type: String, required: true, default: "USD" }
}, {
    timestamps: true,
});
// KYCLevel Model
const KYCLevel = (0, mongoose_1.model)('KYCLevel', KYCLevelSchema);
exports.default = KYCLevel;
