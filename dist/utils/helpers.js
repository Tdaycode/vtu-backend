"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseType = exports.removeNameDuplicates = exports.dataConversion = exports.generateCowryVoucherCode = exports.generateShortID = exports.generateUserName = exports.generateOrderNumber = exports.mergeArraysByKey = void 0;
const order_id_1 = __importDefault(require("order-id"));
const Config_1 = __importDefault(require("../config/Config"));
const unique_username_generator_1 = require("unique-username-generator");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
function mergeArraysByKey(arr1, arr2, key) {
    const lookup = {};
    const result = [];
    // build lookup object using key
    for (const item of arr1) {
        lookup[item[key].toString()] = item;
    }
    for (const item of arr2) {
        const itemId = item[key].toString();
        const lookupItem = lookup[itemId];
        if (lookupItem) {
            // merge objects with the same key
            const mergedObject = { ...lookupItem, ...item };
            result.push(mergedObject);
        }
        else {
            result.push(item);
        }
    }
    return result;
}
exports.mergeArraysByKey = mergeArraysByKey;
const generateOrderNumber = () => {
    const orderid = (0, order_id_1.default)(Config_1.default.cryptoSecret);
    const orderNumber = orderid.generate();
    return "GC-" + orderNumber;
};
exports.generateOrderNumber = generateOrderNumber;
const generateUserName = (email) => {
    const username = (0, unique_username_generator_1.generateFromEmail)(email, 3);
    return username;
};
exports.generateUserName = generateUserName;
const generateShortID = () => {
    const uid = new short_unique_id_1.default({
        dictionary: 'number',
        length: 6
    });
    return uid().toString();
};
exports.generateShortID = generateShortID;
const generateCowryVoucherCode = () => {
    const uid = new short_unique_id_1.default({
        dictionary: 'alphanum_upper',
        length: 16
    });
    return uid().toString();
};
exports.generateCowryVoucherCode = generateCowryVoucherCode;
const dataConversion = (amount, validity) => {
    let dataAmount = parseInt(amount);
    let dataUnit = 'MB';
    if (dataAmount >= 1000) {
        dataAmount /= 1000;
        dataUnit = 'GB';
    }
    if (dataAmount >= 1000) {
        dataAmount /= 1000;
        dataUnit = 'TB';
    }
    const name = `${dataAmount}${dataUnit} ${validity}`;
    return (0, exports.removeNameDuplicates)(name);
};
exports.dataConversion = dataConversion;
const removeNameDuplicates = (name) => {
    const words = name.split(' ');
    const uniqueWords = Array.from(new Set(words));
    const uniqueName = uniqueWords.join(' ');
    return uniqueName;
};
exports.removeNameDuplicates = removeNameDuplicates;
exports.responseType = {
    body: 'body',
    query: 'query',
    params: 'params',
    headers: 'headers'
};
