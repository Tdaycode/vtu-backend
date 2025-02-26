"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// A Schema corresponding to the document interface.
const CurrencySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    expires: { type: Date },
    symbol: { type: String, required: true },
    base: { type: String, required: true, default: "USD" },
    rate: { type: Number, required: true },
    status: { type: String, default: "active" },
    default: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Currency Schema Model
const Currency = (0, mongoose_1.model)('Currency', CurrencySchema);
exports.default = Currency;
