"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
class SuccessResponse {
    constructor(data, message = 'Successful', statusCode = 200) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
exports.SuccessResponse = SuccessResponse;
