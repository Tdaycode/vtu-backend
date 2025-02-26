"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidCountryCode = void 0;
const class_validator_1 = require("class-validator");
const iso_3166_1_alpha_2_1 = __importDefault(require("iso-3166-1-alpha-2"));
function IsValidCountryCode(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidCountryCode',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    const country = iso_3166_1_alpha_2_1.default.getCountry(value);
                    const result = country ? true : false;
                    return result;
                },
                defaultMessage(args) {
                    return `${args.value} is not a valid country code`;
                },
            },
        });
    };
}
exports.IsValidCountryCode = IsValidCountryCode;
