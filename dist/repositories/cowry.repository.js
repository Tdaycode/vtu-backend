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
const typedi_1 = require("typedi");
const cowry_model_1 = __importDefault(require("../models/cowry.model"));
const ApiError_1 = require("../utils/ApiError");
let CowryRepository = class CowryRepository {
    constructor() {
        this.create = async (data) => {
            const document = new cowry_model_1.default(data);
            return await document.save();
        };
        this.findAll = async () => {
            return await cowry_model_1.default.find();
        };
        this.findById = async (id) => {
            return await cowry_model_1.default.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            const result = await cowry_model_1.default.findOne(filter);
            if (!result)
                throw new ApiError_1.BadRequestError('Cowry with the given credential does not exist.');
            return result;
        };
        this.updateOne = async (filter, data) => {
            const response = await cowry_model_1.default.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
    }
};
CowryRepository = __decorate([
    (0, typedi_1.Service)()
], CowryRepository);
exports.default = CowryRepository;
