"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnAuthorizedError = exports.ApplicationError = exports.ValidationError = exports.BadRequestError = exports.NotFoundError = exports.ApiError = void 0;
const http_status_codes_1 = require("http-status-codes");
class ApiError extends Error {
    constructor(statusCode, message, errors) {
        super(message);
        this.errors = [];
        this.statusCode = statusCode;
        if (errors)
            this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class NotFoundError extends ApiError {
    constructor(path) {
        super(http_status_codes_1.StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ApiError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends ApiError {
    constructor(message, errors) {
        super(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, message, errors);
    }
}
exports.ValidationError = ValidationError;
class ApplicationError extends ApiError {
    constructor(message, errors) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, message, errors);
    }
}
exports.ApplicationError = ApplicationError;
class UnAuthorizedError extends ApiError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.UNAUTHORIZED, message);
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class ForbiddenError extends ApiError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.FORBIDDEN, message);
    }
}
exports.ForbiddenError = ForbiddenError;
