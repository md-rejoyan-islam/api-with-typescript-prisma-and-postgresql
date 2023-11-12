"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPass = exports.emailUser = exports.smtpPort = exports.smtpHost = exports.jwtSecret = exports.jwtLoginTokenExpire = exports.verifyKeyExpire = exports.verifyKey = exports.jwtLoginTokenSecret = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// config dotenv
dotenv_1.default.config();
exports.PORT = process.env.SERVER_PORT || 8000;
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.jwtLoginTokenSecret = process.env.JWT_LOGIN_TOKEN_SECRET || "secret";
// account verification key and expire
exports.verifyKey = process.env.JWT_VERIFY_SECRET_KEY || "secret";
exports.verifyKeyExpire = process.env.VERIFY_JWT_EXPIRE || "300s";
exports.jwtLoginTokenExpire = process.env.JWT_LOGIN_EXPIRE || "365d";
exports.jwtSecret = process.env.JWT_SECRET_KEY || "secret";
exports.smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
exports.smtpPort = Number(process.env.SMTP_PORT) || 587;
exports.emailUser = process.env.EMAIL_HOST_USER || "";
exports.emailPass = process.env.EMAIL_HOST_PASSWORD || "";
