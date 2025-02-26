"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("../utils/crypto");
// A Schema corresponding to the document interface.
const cowrySchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 16,
        maxlength: 16
    },
    pin: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    },
    value: {
        type: Number,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});
// Check if pin matches the user's pin
cowrySchema.methods.isPinMatch = async function (pin) {
    return bcrypt_1.default.compare(pin, this.pin);
};
// Hash pin before save
cowrySchema.pre('save', async function (next) {
    if (this.isModified('pin')) {
        this.pin = await (0, crypto_1.hashPassword)(this.pin);
    }
    next();
});
// Cowry Model
const Cowry = (0, mongoose_1.model)('Cowry', cowrySchema);
exports.default = Cowry;
