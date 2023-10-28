"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../middlewares/validator/file/user.validator");
const validation_1 = __importDefault(require("../middlewares/validator/validation"));
const userRouter = express_1.default.Router();
userRouter
    .route("/")
    .get(user_controller_1.getAllUsers)
    .post(user_validator_1.userRegisterValidator, validation_1.default, user_controller_1.createUser);
// bulk user create
userRouter.route("/bulk").post(user_controller_1.bulkCreateUsers).delete(user_controller_1.bulkDeleteUsers);
userRouter
    .route("/:id")
    .get(user_controller_1.getUserById)
    .put(user_controller_1.updateUserById)
    .delete(user_controller_1.deleteUserById);
// get all post of user
userRouter.route("/:id/posts").get(user_controller_1.getAllPostsOfUser);
// export
exports.default = userRouter;
