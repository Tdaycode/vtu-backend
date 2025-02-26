"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const runInTransaction = async (callback) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        await callback(session);
        // Commit the changes
        await session.commitTransaction();
    }
    catch (error) {
        // Rollback any changes made in the database
        await session.abortTransaction();
        // logging the error
        console.error(error);
        // Rethrow the error
        throw error;
    }
    finally {
        // Ending the session
        session.endSession();
    }
};
exports.default = runInTransaction;
