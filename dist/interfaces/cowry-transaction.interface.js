"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactiontype = exports.TransactionStatus = void 0;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["Pending"] = "pending";
    TransactionStatus["Successful"] = "successful";
    TransactionStatus["Failed"] = "failed";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
var Transactiontype;
(function (Transactiontype) {
    Transactiontype["Credit"] = "credit";
    Transactiontype["Debit"] = "debit";
})(Transactiontype = exports.Transactiontype || (exports.Transactiontype = {}));
