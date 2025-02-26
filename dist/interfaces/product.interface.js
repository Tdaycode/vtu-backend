"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricityType = exports.DiscountType = exports.ServiceTypes = exports.ProductTypes = exports.DiscountAmountType = exports.ServiceFeeAmountType = exports.PaymentOptions = exports.ServiceFeeType = exports.Providers = exports.PaymentTypes = void 0;
var PaymentTypes;
(function (PaymentTypes) {
    PaymentTypes["Adyen"] = "adyen";
    PaymentTypes["BinancePay"] = "binance-pay";
    PaymentTypes["Flutterwave"] = "flutterwave";
    PaymentTypes["Cowry"] = "cowry";
})(PaymentTypes = exports.PaymentTypes || (exports.PaymentTypes = {}));
var Providers;
(function (Providers) {
    Providers["PrimeAirtime"] = "primeairtime";
    Providers["Giftly"] = "giftly";
    Providers["GiftCop"] = "giftcop";
})(Providers = exports.Providers || (exports.Providers = {}));
var ServiceFeeType;
(function (ServiceFeeType) {
    ServiceFeeType["Global"] = "global";
    ServiceFeeType["Specific"] = "specific";
})(ServiceFeeType = exports.ServiceFeeType || (exports.ServiceFeeType = {}));
var PaymentOptions;
(function (PaymentOptions) {
    PaymentOptions["Global"] = "global";
    PaymentOptions["Specific"] = "specific";
})(PaymentOptions = exports.PaymentOptions || (exports.PaymentOptions = {}));
var ServiceFeeAmountType;
(function (ServiceFeeAmountType) {
    ServiceFeeAmountType["Percentage"] = "percentage";
    ServiceFeeAmountType["Flat"] = "flat";
})(ServiceFeeAmountType = exports.ServiceFeeAmountType || (exports.ServiceFeeAmountType = {}));
var DiscountAmountType;
(function (DiscountAmountType) {
    DiscountAmountType["Percentage"] = "percentage";
    DiscountAmountType["Flat"] = "flat";
})(DiscountAmountType = exports.DiscountAmountType || (exports.DiscountAmountType = {}));
var ProductTypes;
(function (ProductTypes) {
    ProductTypes["Airtime"] = "airtime";
    ProductTypes["Data"] = "data";
    ProductTypes["Electricity"] = "electricity";
    ProductTypes["TV"] = "dstv";
    ProductTypes["Betting"] = "Betting";
    ProductTypes["Internet"] = "internet";
    ProductTypes["Misc"] = "misc";
    ProductTypes["GiftCard"] = "giftcard";
    ProductTypes["Cowry"] = "cowry";
})(ProductTypes = exports.ProductTypes || (exports.ProductTypes = {}));
var ServiceTypes;
(function (ServiceTypes) {
    ServiceTypes["Electricity"] = "electricity";
    ServiceTypes["TV"] = "dstv";
    ServiceTypes["Lottery"] = "lottery";
    ServiceTypes["Internet"] = "internet";
    ServiceTypes["Misc"] = "misc";
    ServiceTypes["GiftCard"] = "giftcard";
    ServiceTypes["Cowry"] = "cowry";
})(ServiceTypes = exports.ServiceTypes || (exports.ServiceTypes = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["Global"] = "global";
    DiscountType["Specific"] = "specific";
})(DiscountType = exports.DiscountType || (exports.DiscountType = {}));
var ElectricityType;
(function (ElectricityType) {
    ElectricityType["POSTPAID"] = "postpaid";
    ElectricityType["PREPAID"] = "prepaid";
})(ElectricityType = exports.ElectricityType || (exports.ElectricityType = {}));
