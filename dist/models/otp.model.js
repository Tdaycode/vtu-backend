"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// A Schema corresponding to the document interface.
const otpSchema = new mongoose_1.Schema({
    otp: { type: String, required: true },
    expires: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
// OTP Model
const OTP = (0, mongoose_1.model)('OTP', otpSchema);
exports.default = OTP;
