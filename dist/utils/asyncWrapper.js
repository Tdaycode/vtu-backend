"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const asyncWrapper = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next))
        .then((response) => res.status(response.statusCode).send({
        success: true,
        data: response.data,
        message: response.message,
    }))
        .catch((err) => next(err));
};
exports.asyncWrapper = asyncWrapper;
