"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedUser = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("../interfaces/user.interface");
const crypto_1 = require("../utils/crypto");
const helpers_1 = require("../utils/helpers");
// A Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true },
    cowryBalance: { type: Number, default: 0 },
    phoneNumber: { type: String, required: true },
    country: { type: String, max: 2, required: true },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    pin: { type: String, default: null },
    identityHash: { type: String },
    imageURL: { type: String },
    dob: { type: Date },
    isIdentityVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    kycLevel: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'KYCLevel' },
    twoFA: {
        needed: {
            type: Boolean,
            default: false,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            trim: true,
            enum: [user_interface_1.TwoFATypes.email, user_interface_1.TwoFATypes.totp],
            default: user_interface_1.TwoFATypes.email,
        },
        totpSecret: {
            type: String,
            trim: true,
        },
    },
}, {
    timestamps: true,
});
// Check if email is taken
userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};
// Check if password matches the user's password
userSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
// Hash password before save
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await (0, crypto_1.hashPassword)(this.password);
        this.userName = (0, helpers_1.generateUserName)(this.email);
    }
    next();
});
userSchema.plugin(mongoose_paginate_v2_1.default);
userSchema.index({ firstName: "text", lastName: "text", email: "text" });
// User Model
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
// create the paginated model
const PaginatedUser = (0, mongoose_1.model)('User', userSchema, 'users');
exports.PaginatedUser = PaginatedUser;
