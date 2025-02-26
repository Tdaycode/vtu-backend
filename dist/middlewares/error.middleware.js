"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../config/Config"));
const logger_service_1 = require("../services/logger.service");
const logger = new logger_service_1.LoggerClient();
class ErrorHandler {
}
exports.default = ErrorHandler;
_a = ErrorHandler;
ErrorHandler.handle = () => {
    return async (err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        logger.error('error occurred: ' + err.toString() + ' ' + statusCode.toString());
        const data = {
            success: false,
            message: err.message,
            errors: err.errors ?? [],
        };
        if (Config_1.default.environment === 'development')
            data.stack = err.stack;
        res.status(statusCode).send(data);
    };
};
ErrorHandler.initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error(reason.name + ' ' + reason.message);
        logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
        throw reason;
    });
    process.on('uncaughtException', (err) => {
        logger.error(err.name + ' ' + err.message);
        logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        process.exit(1);
    });
};
