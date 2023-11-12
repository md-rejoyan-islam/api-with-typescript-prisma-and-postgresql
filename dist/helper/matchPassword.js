"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const matchPassword = (password, hashPassword) => {
    const isMatch = bcryptjs_1.default.compareSync(password, hashPassword);
    if (!isMatch) {
        throw (0, http_errors_1.default)(400, "Wrong password");
    }
};
exports.default = matchPassword;
