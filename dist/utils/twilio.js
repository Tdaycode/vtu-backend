"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.initatePhoneVerification = void 0;
const twilio_1 = __importDefault(require("twilio"));
const Config_1 = __importDefault(require("../config/Config"));
const client = (0, twilio_1.default)(Config_1.default.twilioSID, Config_1.default.twilioToken);
const twillioVerify = client.verify.v2.services(Config_1.default.twilioVerifySID);
async function initatePhoneVerification(phoneNumber) {
    try {
        const response = await twillioVerify.verifications
            .create({ to: phoneNumber, channel: "sms" });
        return response;
    }
    catch (error) {
        throw Error("Error Initiating Phone Verification");
    }
}
exports.initatePhoneVerification = initatePhoneVerification;
async function verifyCode(phoneNumber, otp) {
    try {
        const response = await twillioVerify.verificationChecks.
            create({ to: phoneNumber, code: otp });
        if (!response.valid)
            throw Error("Retry again code expired");
        return response;
    }
    catch (err) {
        throw Error("Retry again code expired");
    }
}
exports.verifyCode = verifyCode;
