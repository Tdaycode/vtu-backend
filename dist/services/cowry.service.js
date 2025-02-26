"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const big_js_1 = __importDefault(require("big.js"));
const ApiError_1 = require("../utils/ApiError");
const country_to_currency_1 = __importDefault(require("country-to-currency"));
const helpers_1 = require("../utils/helpers");
const cowry_model_1 = __importDefault(require("../models/cowry.model"));
const repositories_1 = require("../repositories");
const cowry_transaction_interface_1 = require("../interfaces/cowry-transaction.interface");
const runInTransaction_util_1 = __importDefault(require("../utils/runInTransaction.util"));
const logger_service_1 = require("./logger.service");
const currency_service_1 = __importDefault(require("./currency.service"));
let CowryService = class CowryService {
    constructor(logger, currencyService, userRepository, cowryRepository, cowryTransactionRepository) {
        this.logger = logger;
        this.currencyService = currencyService;
        this.userRepository = userRepository;
        this.cowryRepository = cowryRepository;
        this.cowryTransactionRepository = cowryTransactionRepository;
        this.getCowryProductInfo = async (data) => {
            const { type, productName, provider, product_id, country, productCurrency } = data;
            const currency = country_to_currency_1.default[country];
            if (!currency)
                throw new ApiError_1.BadRequestError("Invalid Country Code");
            const baseCurrency = "USD";
            const pricebaseCurrency = await this.currencyService.convertLocalCurrency(product_id, productCurrency, baseCurrency);
            let price = pricebaseCurrency;
            if (currency !== baseCurrency) {
                const convertFunction = currency === "NGN" ? "convertNGNCurrency" : "convertCurrency";
                price = await this.currencyService[convertFunction](parseFloat(pricebaseCurrency), baseCurrency, currency);
            }
            return {
                type, provider,
                products: [
                    {
                        currency: currency,
                        amount: price,
                        hasOpenRange: false,
                        name: productName,
                        product_id: `${country}-${product_id}`
                    }
                ]
            };
        };
        this.creditCowry = async (userId, amount) => {
            const update = { $inc: { cowryBalance: amount } };
            const user = await this.userRepository.updateUser({ _id: userId }, update);
            if (!user)
                throw new ApiError_1.BadRequestError("Unable to Credit Cowry");
        };
        this.checkCowryVoucher = async (code) => {
            const cowry = await this.cowryRepository.findOne({ code });
            const cowryInfo = cowry.toObject();
            delete cowryInfo['pin'];
            return cowryInfo;
        };
        this.loadCowryVoucher = async (code, pin, userId) => {
            const cowry = await this.cowryRepository.findOne({ code, isValid: true });
            if (!(await cowry.isPinMatch(pin)))
                throw new ApiError_1.BadRequestError('Invalid Code or Pin');
            await this.creditCowry(userId, cowry.value);
            await this.cowryRepository.updateOne({ code }, { isValid: false });
            await this.recordCowryTransaction(userId, cowry_transaction_interface_1.Transactiontype.Credit, cowry_transaction_interface_1.TransactionStatus.Successful, cowry.value);
            return cowry;
        };
        this.recordCowryTransaction = async (userId, type, status, amount, sender = "GiftCop") => {
            const transaction = await this.cowryTransactionRepository.create(userId, type, amount, status, sender);
            return transaction;
        };
        this.transferCowry = async (transferData) => {
            await (0, runInTransaction_util_1.default)(async (session) => {
                const sourceUser = await this.userRepository.findUser({ _id: transferData.senderUserId });
                const destinationUser = await this.userRepository.findUser({ userName: transferData.recipientUsername });
                if (!sourceUser || !destinationUser)
                    throw new ApiError_1.BadRequestError('User not found.');
                // Check sender balance
                const balance = ((0, big_js_1.default)(sourceUser.cowryBalance).minus(transferData.amount)).toFixed(2);
                // Check if the sender has enough balance to make the transfer.
                if ((0, big_js_1.default)(balance).lt(0))
                    throw new ApiError_1.BadRequestError('Insufficient balance.');
                const sourceUserUpdate = { $inc: { cowryBalance: -1 * transferData.amount } };
                const destinationUserUpdate = { $inc: { cowryBalance: transferData.amount } };
                const description = "Cowry Transfer";
                // Debit Sender
                await this.userRepository.updateUser({ _id: transferData.senderUserId }, sourceUserUpdate, session);
                await this.cowryTransactionRepository.create(sourceUser._id, cowry_transaction_interface_1.Transactiontype.Debit, transferData.amount, cowry_transaction_interface_1.TransactionStatus.Successful, sourceUser.userName, description, session);
                // Credit Recipient
                await this.userRepository.updateUser({ userName: transferData.recipientUsername }, destinationUserUpdate, session);
                await this.cowryTransactionRepository.create(destinationUser._id, cowry_transaction_interface_1.Transactiontype.Credit, transferData.amount, cowry_transaction_interface_1.TransactionStatus.Successful, sourceUser.userName, description, session);
            });
        };
        this.debitCowry = async (amount, userId) => {
            await (0, runInTransaction_util_1.default)(async (session) => {
                const user = await this.userRepository.findUser({ _id: userId });
                if (!user)
                    throw new ApiError_1.BadRequestError('User not found.');
                // Check sender balance
                const balance = ((0, big_js_1.default)(user.cowryBalance).minus(amount)).toFixed(2);
                // Check if the sender has enough balance to make the transfer.
                if ((0, big_js_1.default)(balance).lt(0))
                    throw new ApiError_1.BadRequestError('Insufficient balance.');
                const userUpdate = { $inc: { cowryBalance: -1 * amount } };
                const description = "Cowry Payment";
                // Debit Sender
                await this.userRepository.updateUser({ _id: userId }, userUpdate, session);
                await this.cowryTransactionRepository.create(user._id, cowry_transaction_interface_1.Transactiontype.Debit, amount, cowry_transaction_interface_1.TransactionStatus.Successful, user.userName, description, session);
            });
        };
        this.getCowryTransactions = async (userId, page, limit) => {
            const _page = parseInt(page) ? parseInt(page) : 1;
            const _limit = parseInt(limit) ? parseInt(limit) : 10;
            const skip = (_page - 1) * _limit;
            const filter = { userId }, sort = { createdAt: -1 };
            return await this.cowryTransactionRepository.findAllWithPagination(filter, sort, skip, _limit);
        };
    }
};
CowryService.createCowryVoucher = async (value) => {
    const code = (0, helpers_1.generateCowryVoucherCode)();
    const pin = (0, helpers_1.generateShortID)();
    const cowry = new cowry_model_1.default({ value, code, pin });
    await cowry.save();
    return { code, pin };
};
CowryService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        currency_service_1.default,
        repositories_1.UserRepository,
        repositories_1.CowryRepository,
        repositories_1.CowryTransactionRepository])
], CowryService);
exports.default = CowryService;
