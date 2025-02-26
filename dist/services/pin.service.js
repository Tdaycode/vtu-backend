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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _PinService_rounds;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typedi_1 = require("typedi");
const Config_1 = __importDefault(require("../config/Config"));
const ApiError_1 = require("../utils/ApiError");
let PinService = class PinService {
    constructor(rounds) {
        _PinService_rounds.set(this, 8);
        __classPrivateFieldSet(this, _PinService_rounds, rounds || __classPrivateFieldGet(this, _PinService_rounds, "f"), "f");
    }
    async hash(pin) {
        if (!pin)
            throw new ApiError_1.BadRequestError("Please provide a valid pin");
        return await bcrypt_1.default.hash(pin, __classPrivateFieldGet(this, _PinService_rounds, "f"));
    }
    static async check(pin, hash) {
        if (!pin)
            throw new ApiError_1.BadRequestError("Please provide a valid pin");
        return await bcrypt_1.default.compare(pin, hash);
    }
    async checkConfirmationCode(confirmationCode, hash) {
        if (!confirmationCode)
            throw Error("Provide a confirmation code");
        return await bcrypt_1.default.compare(confirmationCode, hash);
    }
    verifyToken(token) {
        if (!token)
            throw Error("Provide a confirmation code");
        const decoded = jsonwebtoken_1.default.verify(token, Config_1.default.jwtSecret, function (err, decoded) {
            if (err)
                throw Error("Retry again code expired");
            return decoded;
        });
        return decoded;
    }
};
_PinService_rounds = new WeakMap();
PinService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Number])
], PinService);
exports.PinService = PinService;
