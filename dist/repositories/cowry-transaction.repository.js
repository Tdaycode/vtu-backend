"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const cowry_transaction_1 = require("../models/cowry-transaction");
const ApiError_1 = require("../utils/ApiError");
let CowryTransactionRepository = class CowryTransactionRepository {
    constructor() {
        this.create = async (userId, type, amount, status, sender, description = "Cowry Transfer", session = null) => {
            const sessionOption = session ? { session } : {};
            const document = new cowry_transaction_1.CowryTransaction({ type, userId, amount, sender, description, status });
            return await document.save(sessionOption);
        };
        this.findAll = async () => {
            return await cowry_transaction_1.CowryTransaction.find();
        };
        this.findById = async (id) => {
            return await cowry_transaction_1.CowryTransaction.findOne({ _id: id });
        };
        this.findOne = async (filter) => {
            const result = await cowry_transaction_1.CowryTransaction.findOne(filter);
            if (!result)
                throw new ApiError_1.BadRequestError('Cowry Transaction with the given credential does not exist.');
            return result;
        };
        this.updateOne = async (filter, data) => {
            const response = await cowry_transaction_1.CowryTransaction.findOneAndUpdate(filter, data, { new: true });
            return response;
        };
        this.findAllWithPagination = async (filter = {}, sort = {}, skip, limit) => {
            const options = {
                sort: sort,
                lean: true,
                leanWithId: false,
                offset: skip,
                limit: limit
            };
            return await cowry_transaction_1.PaginatedCowryTransaction.paginate(filter, options);
        };
    }
};
CowryTransactionRepository = __decorate([
    (0, typedi_1.Service)()
], CowryTransactionRepository);
exports.default = CowryTransactionRepository;
