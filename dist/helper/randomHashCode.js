"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomstring_1 = __importDefault(require("randomstring"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const randomHashCode = (length) => {
    const code = randomstring_1.default.generate({
        length,
        charset: "numeric",
    });
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hashCode = bcryptjs_1.default.hashSync(code, salt);
    return {
        code,
        hashCode,
    };
};
exports.default = randomHashCode;
