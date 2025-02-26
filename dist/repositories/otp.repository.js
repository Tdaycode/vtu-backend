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
const otp_model_1 = __importDefault(require("../models/otp.model"));
const typedi_1 = require("typedi");
let OTPRepository = class OTPRepository {
    constructor() {
        this.createOTP = async (otp, date) => {
            const user = new otp_model_1.default({
                otp,
                expires: date,
            });
            return await user.save();
        };
        this.findOne = async (id) => {
            return await otp_model_1.default.findOne({ _id: id });
        };
        this.deleteOne = async (id) => {
            return await otp_model_1.default.remove({ _id: id });
        };
    }
};
OTPRepository = __decorate([
    (0, typedi_1.Service)()
], OTPRepository);
exports.default = OTPRepository;
