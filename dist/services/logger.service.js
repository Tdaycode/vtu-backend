"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerClient = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const morgan_1 = __importDefault(require("morgan"));
const typedi_1 = require("typedi");
const { combine, timestamp, json } = winston_1.format;
let LoggerClient = class LoggerClient {
    constructor(service = 'general-purpose') {
        this.info = (message) => {
            this.logger.info(message);
        };
        this.error = (message) => {
            this.logger.error(message);
        };
        this.errorFilter = (0, winston_1.format)((info, opts) => {
            return info.level === 'error' ? info : false;
        });
        this.infoFilter = (0, winston_1.format)((info, opts) => {
            return info.level === 'info' ? info : false;
        });
        this.httpFilter = (0, winston_1.format)((info, opts) => {
            return info.level === 'http' ? info : false;
        });
        this.getInfoLoggerTransport = () => {
            return new winston_daily_rotate_file_1.default({
                filename: 'logs/info-%DATE%.log',
                datePattern: 'HH-DD-MM-YYYY',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: '14d',
                level: 'info',
                format: winston_1.format.combine(this.infoFilter(), winston_1.format.timestamp(), json()),
            });
        };
        this.getErrorLoggerTransport = () => {
            return new winston_daily_rotate_file_1.default({
                filename: 'logs/error-%DATE%.log',
                datePattern: 'HH-DD-MM-YYYY',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: '14d',
                level: 'error',
                format: winston_1.format.combine(this.errorFilter(), winston_1.format.timestamp(), json()),
            });
        };
        this.getHttpLoggerTransport = () => {
            return new winston_daily_rotate_file_1.default({
                filename: 'logs/http-%DATE%.log',
                datePattern: 'HH-DD-MM-YYYY',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: '14d',
                level: 'http',
                format: winston_1.format.combine(this.httpFilter(), winston_1.format.timestamp(), json()),
            });
        };
        this.getHttpLoggerInstance = () => {
            const stream = {
                write: (message) => this.logger.http(message),
            };
            const skip = () => {
                const env = process.env.NODE_ENV || 'development';
                return env !== 'development';
            };
            const morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :remote-addr', {
                stream,
                skip,
            });
            return morganMiddleware;
        };
        this.logger = (0, winston_1.createLogger)({
            defaultMeta: { service },
            format: combine(timestamp(), json(), winston_1.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
            transports: [
                new winston_1.transports.Console(),
                this.getHttpLoggerTransport(),
                this.getInfoLoggerTransport(),
                this.getErrorLoggerTransport(),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
            }));
        }
    }
};
LoggerClient = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], LoggerClient);
exports.LoggerClient = LoggerClient;
