"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtLoginTokenSecret = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// config dotenv
dotenv_1.default.config();
exports.PORT = process.env.SERVER_PORT || 8000;
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.jwtLoginTokenSecret = process.env.JWT_LOGIN_TOKEN_SECRET || 'secret';
