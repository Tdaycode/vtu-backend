"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.decode = exports.encode = exports.hashString = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Config_1 = __importDefault(require("../config/Config"));
const password = Config_1.default.jwtSecret;
const iv = Buffer.from(Config_1.default.cryptoSecret);
const ivstring = iv.toString('hex');
function sha1(input) {
    return crypto_1.default.createHash('sha1').update(input).digest();
}
function hashString(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
exports.hashString = hashString;
const password_derive_bytes = (password, salt, iterations, len) => {
    let key = Buffer.from(password + salt);
    for (let i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        const hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (let counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
};
const encode = async (string) => {
    const key = password_derive_bytes(password, '', 100, 32);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, ivstring);
    const part1 = cipher.update(string, 'utf8');
    const part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
};
exports.encode = encode;
const decode = async (string) => {
    const key = password_derive_bytes(password, '', 100, 32);
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, ivstring);
    let decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
};
exports.decode = decode;
const hashPassword = async (password) => {
    return bcrypt_1.default.hash(password, 8);
};
exports.hashPassword = hashPassword;
