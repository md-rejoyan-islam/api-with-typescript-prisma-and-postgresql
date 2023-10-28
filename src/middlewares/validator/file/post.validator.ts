import { body } from "express-validator";

export const postValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.Please provide a title.")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long."),

  body("body")
    .trim()
    .notEmpty()
    .withMessage("Body is required.Please provide a body.")
    .isLength({ min: 10 })
    .withMessage("Body must be at least 10 characters long."),
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("User Id is required.Please provide a user id."),
];

export const postCommentDataValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide user name.")
    .isLength({ min: 3 })
    .withMessage("Body must be at least 3 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide a email.")
    .isEmail()
    .withMessage("Please provide a valid email."),
  body("body")
    .trim()
    .notEmpty()
    .withMessage("Body is required.Please provide a body.")
    .isLength({ min: 10 })
    .withMessage("Body must be at least 10 characters long."),
];
