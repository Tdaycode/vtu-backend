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
const category_model_1 = __importDefault(require("../models/category.model"));
const typedi_1 = require("typedi");
let CategoryRepository = class CategoryRepository {
    constructor() {
        this.create = async (data) => {
            const category = new category_model_1.default(data);
            return await category.save();
        };
        this.findAll = async (filter = {}) => {
            return await category_model_1.default.find(filter);
        };
        this.getAllProductByCategory = async (filter = {}, country = "NG") => {
            const _filter = {
                $or: [
                    { displayCountries: "GLC" },
                    { displayCountries: { $in: [country] } }
                ]
            };
            const query = [
                { "$match": filter },
                {
                    $lookup: {
                        from: "products",
                        localField: '_id',
                        foreignField: 'category',
                        as: "products",
                        pipeline: [
                            { "$match": _filter },
                            { $project: { name: 1, imageUrl: 1, type: 1, sid: 1, category: 1 } },
                        ],
                    }
                }
            ];
            return await category_model_1.default.aggregate(query);
        };
        this.findById = async (id) => {
            return await category_model_1.default.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            return await category_model_1.default.findOne(filter);
        };
        this.updateOne = async (filter, data) => {
            const response = await category_model_1.default.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
    }
};
CategoryRepository = __decorate([
    (0, typedi_1.Service)()
], CategoryRepository);
exports.default = CategoryRepository;
