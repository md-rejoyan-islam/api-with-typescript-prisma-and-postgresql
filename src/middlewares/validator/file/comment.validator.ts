import { body } from "express-validator";

export const commentValidator = [
  body("body")
    .trim()
    .notEmpty()
    .withMessage("Body is required.Please provide a body.")
    .isLength({ min: 5 })
    .withMessage("Body must be at least 5 characters long."),

  body("postId")
    .trim()
    .notEmpty()
    .withMessage("Post Id is required.Please provide a post id."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide an email.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),
];
