"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../middlewares/validator/file/user.validator");
const validation_1 = __importDefault(require("../middlewares/validator/validation"));
const protect_1 = require("../middlewares/protect");
const authorization_1 = require("../middlewares/authorization");
const userRouter = express_1.default.Router();
userRouter
    .route("/")
    .get(user_controller_1.getAllUsers)
    .post(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin"), user_validator_1.userRegisterValidator, validation_1.default, user_controller_1.createUser);
// bulk user create and delete
userRouter
    .route("/bulk")
    .post(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin"), user_controller_1.bulkCreateUsers)
    .delete(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin"), user_controller_1.bulkDeleteUsers);
userRouter
    .route("/:id")
    .get(user_controller_1.getUserById)
    .put(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin", "user"), user_controller_1.updateUserById)
    .delete(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin", "user"), user_controller_1.deleteUserById);
// get all post of user
userRouter.route("/:id/posts").get(user_controller_1.getAllPostsOfUser);
// export
exports.default = userRouter;
