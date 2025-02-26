"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const typedi_1 = require("typedi");
let UserRepository = class UserRepository {
    constructor() {
        this.createUser = async (firstName, lastName, email, password, phoneNumber, country) => {
            const user = new user_model_1.User({
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                country,
            });
            return await user.save();
        };
        this.findByEmail = async (email) => {
            return await user_model_1.User.findOne({ email });
        };
        this.findUser = async (filter) => {
            return await user_model_1.User.findOne(filter);
        };
        this.updateUser = async (filter, data, session = null) => {
            const sessionOption = session ? { session } : {};
            const response = await user_model_1.User.findOneAndUpdate(filter, data, { new: true, ...sessionOption });
            return response;
        };
        this.getAllUsers = async () => {
            return await user_model_1.User.find();
        };
        this.getUser = async (filter) => {
            return await user_model_1.User.findOne(filter);
        };
        this.getUserProfile = async (id) => {
            return await user_model_1.User.findOne({ _id: id }).select("-password -twoFA -__v")
                .populate({ path: 'kycLevel', select: '-_id level dailyLimit monthlyLimit baseCurrency' });
        };
        this.findAllWithPagination = async (filter = {}, sort = {}, skip, limit) => {
            const options = {
                sort: sort,
                lean: true,
                leanWithId: false,
                offset: skip,
                limit: limit
            };
            return await user_model_1.PaginatedUser.paginate(filter, options);
        };
    }
};
UserRepository = __decorate([
    (0, typedi_1.Service)()
], UserRepository);
exports.default = UserRepository;
