"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.commentValidator = [
    (0, express_validator_1.body)("body")
        .trim()
        .notEmpty()
        .withMessage("Body is required.Please provide a body.")
        .isLength({ min: 5 })
        .withMessage("Body must be at least 5 characters long."),
    (0, express_validator_1.body)("postId")
        .trim()
        .notEmpty()
        .withMessage("Post Id is required.Please provide a post id."),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.Please provide an email.")
        .isEmail()
        .withMessage("Please provide a valid email address."),
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.Please provide a name.")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long."),
];
