"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ApiError_1 = require("../utils/ApiError");
const logger_service_1 = require("../services/logger.service");
const typedi_1 = require("typedi");
const logger = new logger_service_1.LoggerClient();
let RequestValidator = class RequestValidator {
};
RequestValidator.validate = (classInstance, value = "body") => {
    return async (req, res, next) => {
        const convertedObject = (0, class_transformer_1.plainToInstance)(classInstance, req[value]);
        await (0, class_validator_1.validate)(convertedObject).then((errors) => {
            if (errors.length > 0) {
                let rawErrors = [];
                for (const errorItem of errors) {
                    rawErrors = rawErrors.concat(...rawErrors, Object.values(errorItem.constraints ?? []));
                }
                const validationErrorText = 'Request validation failed!';
                logger.error(rawErrors.toString());
                next(new ApiError_1.ValidationError(validationErrorText, rawErrors));
            }
        });
        next();
    };
};
RequestValidator = __decorate([
    (0, typedi_1.Service)()
], RequestValidator);
exports.default = RequestValidator;
