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
exports.PaginatedCowryTransaction = exports.CowryTransaction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const cowry_transaction_interface_1 = require("../interfaces/cowry-transaction.interface");
// A Schema corresponding to the document interface.
const cowryTransactionSchema = new mongoose_1.Schema({
    sender: { type: String, required: true },
    description: { type: String },
    userId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: cowry_transaction_interface_1.TransactionStatus,
        default: cowry_transaction_interface_1.TransactionStatus.Pending
    },
    type: {
        type: String,
        enum: cowry_transaction_interface_1.Transactiontype,
        required: true
    },
    amount: { type: Number, required: true }
}, {
    timestamps: true,
});
cowryTransactionSchema.plugin(mongoose_paginate_v2_1.default);
// CowryTransaction Model
const CowryTransaction = (0, mongoose_1.model)('CowryTransaction', cowryTransactionSchema);
exports.CowryTransaction = CowryTransaction;
// create the paginated model
const PaginatedCowryTransaction = (0, mongoose_1.model)('CowryTransaction', cowryTransactionSchema, 'cowrytransactions');
exports.PaginatedCowryTransaction = PaginatedCowryTransaction;
