"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = __importDefault(require("../middlewares/validator/validation"));
const user_validator_1 = require("../middlewares/validator/file/user.validator");
const auth_controllers_1 = require("../controllers/auth.controllers");
const protect_1 = require("../middlewares/protect");
const authRouter = express_1.default.Router();
authRouter
    .route("/register")
    .post(user_validator_1.userRegisterValidator, validation_1.default, protect_1.isLoggedOut, auth_controllers_1.userRegister);
// active user account by code
authRouter
    .route("/activate")
    .post(protect_1.isLoggedOut, user_validator_1.userVerifyCodeValidator, validation_1.default, auth_controllers_1.activeUserAccountByCode);
// resend verification code  to email
authRouter
    .route("/resend-active-code")
    .post(protect_1.isLoggedOut, user_validator_1.userResendCodeValidator, validation_1.default, auth_controllers_1.resendActivationCode);
authRouter
    .route("/login")
    .post(protect_1.isLoggedOut, user_validator_1.userLoginValidator, validation_1.default, auth_controllers_1.userLogin);
authRouter.route("/logout").post(protect_1.isLoggedIn, auth_controllers_1.userLogout);
authRouter.route("/me").get(protect_1.isLoggedIn, auth_controllers_1.me);
// export
exports.default = authRouter;
