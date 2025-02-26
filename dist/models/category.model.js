"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const helpers_1 = require("../utils/helpers");
// A Schema corresponding to the document interface.
const categorySchema = new mongoose_1.Schema({
    sid: { type: String, index: true, unique: true },
    name: { type: String, unique: true, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
}, {
    timestamps: true,
});
categorySchema.pre('save', function (next) {
    this.sid = (0, helpers_1.generateShortID)();
    next();
});
// Category Model
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
