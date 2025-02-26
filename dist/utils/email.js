"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const Config_1 = __importDefault(require("../config/Config"));
mail_1.default.setApiKey(Config_1.default.sendGridAPIKey);
const sendEmail = async (data) => {
    const { subject, email, html } = data;
    try {
        await mail_1.default.send({
            to: email,
            from: Config_1.default.emailSender,
            subject,
            html,
        });
    }
    catch (error) {
        console.error(error);
    }
};
exports.default = sendEmail;
