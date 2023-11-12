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
exports.resendActivationCode = exports.activeUserAccountByCode = exports.me = exports.userLogout = exports.userLogin = exports.userRegister = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client/client"));
const customError_1 = __importDefault(require("../helper/customError"));
const randomHashCode_1 = __importDefault(require("../helper/randomHashCode"));
const createJWT_1 = __importDefault(require("../helper/createJWT"));
const secret_1 = require("../secret");
const responseHandler_1 = require("../helper/responseHandler");
const accountActivationMail_1 = __importDefault(require("../utils/email/accountActivationMail"));
const matchPassword_1 = __importDefault(require("../helper/matchPassword"));
const hashPassword_1 = __importDefault(require("../helper/hashPassword"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 *
 * @apiDescription    Create a new user account
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/register
 * @apiAccess         public
 *
 * @apiBody           { name, username, email, password, gender }
 *
 * @apiSuccess        { success: true , message: active your account by verify email, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 * @apiError          ( Bad Request 400 )     Invalid syntax / parameters
 * @apiError          ( Not Found: 404 )      Couldn't find any data!
 * @apiError          ( Conflict: 409 )       Already have an account.
 *
 */
exports.userRegister = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existEmail = yield client_1.default.user.findUnique({
        where: { email },
    });
    console.log(existEmail);
    const existUsername = yield client_1.default.user.findUnique({
        where: { username: req.body.username },
    });
    if (existEmail)
        throw new customError_1.default("Email already exist", 400);
    if (existUsername)
        throw new customError_1.default("Username already exist", 400);
    // random hash code
    const { code, hashCode } = (0, randomHashCode_1.default)(4);
    // create verify token
    const verifyToken = (0, createJWT_1.default)({ email, code: hashCode }, secret_1.verifyKey, secret_1.verifyKeyExpire);
    // create user
    const user = yield client_1.default.user.create({
        data: Object.assign(Object.assign({}, req.body), { password: (0, hashPassword_1.default)(req.body.password) }),
    });
    // prepare email data
    const emailData = {
        email,
        subject: "Account Activation Code.",
        code,
        verifyToken,
    };
    // send email
    yield (0, accountActivationMail_1.default)(emailData);
    // cookie set
    res.cookie("verifyToken", verifyToken, {
        httpOnly: false,
        maxAge: 1000 * 60 * 5,
        secure: true,
        sameSite: "none",
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 201,
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
        payload: {
            data: user,
        },
    });
}));
/**
 *
 * @apiDescription    User login
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/login
 * @apiAccess         public
 *
 * @apiBody           { email, password }
 *
 * @apiDenied         { isBanned: true }
 *
 * @apiSuccess        { success: true , message: Successfully Login, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 * @apiError          ( Bad Request 400 )     Invalid syntax / parameters
 * @apiError          ( Not Found: 404 )      Couldn't find any user account!. Please register.
 *
 */
exports.userLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // get user
    const user = yield client_1.default.user.findUnique({
        where: { email },
    });
    // user check
    if (!user)
        throw new customError_1.default("Couldn't find any user account!. Please register.", 400);
    //  password match
    (0, matchPassword_1.default)(password, user.password);
    // isActivate check
    if (user.isVerified === false) {
        throw new customError_1.default("Please active your account.", 400);
    }
    // create  access token
    const accessToken = (0, createJWT_1.default)({ email }, secret_1.jwtLoginTokenSecret, secret_1.jwtLoginTokenExpire);
    // response send
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 15,
        secure: true,
        sameSite: "none",
    });
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Successfully Login to KIN.",
        payload: {
            data: Object.assign(Object.assign({}, user), { accessToken }),
        },
    });
}));
/**
 *
 * @apiDescription    User Logout
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/logout
 * @apiAccess         Only Logged in user
 *
 * @apiCookie         accessToken
 *
 * @apiSuccess        { success: true , message: Successfully Logout }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
const userLogout = (req, res) => {
    res === null || res === void 0 ? void 0 : res.clearCookie("accessToken", {
        httpOnly: false,
        secure: true,
        sameSite: "none",
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Successfully Logout.",
    });
};
exports.userLogout = userLogout;
/**
 *
 * @apiDescription    Logged in user data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/me
 * @apiAccess         Only Logged in user
 *
 * @apiCookie         accessToken
 *
 * @apiSuccess        { success: true , message: Successfully Logout }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
exports.me = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.me)) {
        throw new customError_1.default("Couldn't find any user account!. Please register.", 404);
    }
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Login User Data.",
        payload: {
            data: req.me,
        },
    });
}));
/**
 *
 * @apiDescription    Active user account by code
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/activate
 * @apiAccess         registered user
 *
 * @apiBody           { code }
 *
 * @apiSuccess        { success: true , message: Successfully activated your account., data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
exports.activeUserAccountByCode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // token
    const token = req.cookies.verifyToken;
    // check token
    if (!token) {
        throw new customError_1.default("Token not found", 400);
    }
    // verify token
    jsonwebtoken_1.default.verify(token, secret_1.jwtSecret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return (0, responseHandler_1.errorResponse)(res, {
                statusCode: 400,
                message: "Time expired! ",
            });
        }
        // check if user is already verified
        const user = yield client_1.default.user.findUnique({
            where: { email: decoded === null || decoded === void 0 ? void 0 : decoded.email },
        });
        // user exist check
        if (!user) {
            return (0, responseHandler_1.errorResponse)(res, {
                statusCode: 400,
                message: "Couldn't find any user account!. Please register.",
            });
        }
        if (user.isVerified === true) {
            return (0, responseHandler_1.errorResponse)(res, {
                statusCode: 400,
                message: "Your account is already active. Please login.",
            });
        }
        // check code
        const code = bcryptjs_1.default.compareSync(req.body.code, decoded.code);
        if (!code) {
            return (0, responseHandler_1.errorResponse)(res, {
                statusCode: 400,
                message: "wrong code",
            });
        }
        else {
            yield client_1.default.user.update({
                where: { email: decoded === null || decoded === void 0 ? void 0 : decoded.email },
                data: { isVerified: true },
            });
            // cookie clear
            res === null || res === void 0 ? void 0 : res.clearCookie("verifyToken", {
                sameSite: "strict",
            });
            // response send
            return (0, responseHandler_1.successResponse)(res, {
                statusCode: 201,
                message: "Successfully activated your account.",
            });
        }
    }));
}));
/**
 *
 * @apiDescription    Resend verification code to email
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/resend-active-code
 * @apiAccess         registered user
 *
 * @apiBody           { email}
 *
 * @apiSuccess        { success: true , message: Email has been sent to email. Follow the instruction to activate your account, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
exports.resendActivationCode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield client_1.default.user.findUnique({ where: { email } });
    // check: user is exist or not.
    if (!user) {
        throw new customError_1.default("Couldn't find any user account!. Please register.", 400);
    }
    // check: user is activate or not
    if (user.isVerified === true) {
        throw new customError_1.default("Your account is already active. Please login.", 400);
    }
    // random hash code
    const { code, hashCode } = (0, randomHashCode_1.default)(4);
    // create verify token
    const verifyToken = (0, createJWT_1.default)({ email, code: hashCode }, secret_1.verifyKey, secret_1.verifyKeyExpire);
    // prepare email data
    const emailData = {
        email,
        subject: "Account Activation Code",
        code,
        verifyToken,
    };
    // send email
    (0, accountActivationMail_1.default)(emailData);
    res.cookie("verifyToken", verifyToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
        secure: true,
        sameSite: "none",
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
    });
}));
