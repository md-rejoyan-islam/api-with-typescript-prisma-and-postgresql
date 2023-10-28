"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedOut = exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const secret_1 = require("../secret");
const responseHandler_1 = require("../helper/responseHandler");
const customError_1 = __importDefault(require("../helper/customError"));
const client_1 = __importDefault(require("../prisma/client/client"));
exports.isLoggedIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = req.headers.authorization; // || req.headers.Authorization;
    const authToken = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    let token;
    if (authHeader || authToken) {
        token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]) || authToken;
    }
    if (!token) {
        throw new customError_1.default("Unauthorized, Access token not found. Please login.", 401);
    }
    jsonwebtoken_1.default.verify(token, secret_1.jwtLoginTokenSecret, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return (0, responseHandler_1.errorResponse)(res, {
                statusCode: 400,
                message: "Unauthorized, Invalid access token.Please login again",
            });
        }
        const loginUser = yield client_1.default.user.findUnique({
            where: { email: decode.email },
        });
        req.me = Object.assign(Object.assign({}, loginUser), { id: Number(loginUser === null || loginUser === void 0 ? void 0 : loginUser.id) });
        next();
    }));
}));
exports.isLoggedOut = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authHeader = req.headers.authorization; //|| req.headers.Authorization;
    const authToken = (_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken;
    let token;
    if (!authHeader && !authToken) {
        token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]) || authToken;
    }
    if (token) {
        throw (0, http_errors_1.default)(400, "User is already logged in");
    }
    next();
}));
