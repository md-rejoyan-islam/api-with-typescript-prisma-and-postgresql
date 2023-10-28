"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginValidator = exports.userRegisterValidator = void 0;
const express_validator_1 = require("express-validator");
const customError_1 = __importDefault(require("../../../helper/customError"));
exports.userRegisterValidator = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.Please provide a name.")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long."),
    (0, express_validator_1.body)("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.Please provide a username.")
        .isLength({ min: 2 })
        .withMessage("Username must be at least 2 characters long."),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.Please provide a email.")
        .isEmail()
        .withMessage("Please provide a valid email."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.Please provide a password.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("gender")
        .notEmpty()
        .withMessage("Gender is required.Please provide a gender.")
        .custom((value) => {
        if (!/^(male|female)$/.test(value))
            throw new customError_1.default("Gender value can be only male or female", 400);
        return true;
    }),
];
exports.userLoginValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.Please provide a email.")
        .isEmail()
        .withMessage("Please provide a valid email."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.Please provide a password.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
];
const passwordResetValidator = [
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.Please provide a password.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("Code is required.Please provide a code.")
        .isLength({ min: 4 })
        .withMessage("Code must be  4 characters long."),
];
const userVerifyCodeValidator = [
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("Code is required.Please provide a code.")
        .isLength({ min: 4 })
        .withMessage("Code must be at least 4 characters long."),
];
const userResendCodeValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.Please provide a email.")
        .isEmail()
        .withMessage("Please provide a valid email."),
];
const userPasswordUpdateValidator = [
    (0, express_validator_1.body)("oldPassword").notEmpty().withMessage("Old password is required"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            // throw createHttpError(400, "Password does not match");
        }
        return true;
    }),
];
const userResetPasswordValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.Please provide a email.")
        .isEmail()
        .withMessage("Please provide a valid email."),
];
const resetPasswordValidatorByCode = [
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.Please provide a password.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            // throw createHttpError(400, "Password does not match");
        }
        return true;
    }),
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("Code is required.Please provide a code.")
        .isLength({ min: 4 })
        .withMessage("Code must be at least 4 characters long."),
];
const resetPasswordValidatorByURL = [
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.Please provide a password.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            // throw createHttpError(400, "Password does not match");
        }
        return true;
    }),
];
