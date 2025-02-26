"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentTypes = void 0;
var PaymentTypes;
(function (PaymentTypes) {
    PaymentTypes["Adyen"] = "adyen";
    PaymentTypes["BinancePay"] = "binance-pay";
    PaymentTypes["Flutterwave"] = "flutterwave";
    PaymentTypes["Cowry"] = "cowry";
})(PaymentTypes = exports.PaymentTypes || (exports.PaymentTypes = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Successful"] = "successful";
    PaymentStatus["Failed"] = "failed";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
