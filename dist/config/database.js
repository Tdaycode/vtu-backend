"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Config_1 = __importDefault(require("./Config"));
class Database {
    async initDatabase() {
        try {
            await (0, mongoose_1.connect)(Config_1.default.dbUrl);
            console.log('Database connected successfully');
        }
        catch (err) {
            console.error('Could not connect to db', err);
        }
    }
    async disconnectDatabase() {
        try {
            await mongoose_1.connection.close();
            console.log('Database disconnected successfully');
        }
        catch (err) {
            console.error('Could not disconnect db', err);
        }
    }
}
exports.default = Database;
