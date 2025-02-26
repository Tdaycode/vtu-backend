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
const currency_model_1 = __importDefault(require("../models/currency.model"));
const typedi_1 = require("typedi");
let CurrencyRepository = class CurrencyRepository {
    constructor() {
        this.create = async (data) => {
            const document = new currency_model_1.default(data);
            return await document.save();
        };
        this.findAll = async () => {
            return await currency_model_1.default.find();
        };
        this.findById = async (id) => {
            return await currency_model_1.default.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            return await currency_model_1.default.findOne(filter);
        };
        this.updateOne = async (filter, data) => {
            const response = await currency_model_1.default.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
    }
};
CurrencyRepository = __decorate([
    (0, typedi_1.Service)()
], CurrencyRepository);
exports.default = CurrencyRepository;
