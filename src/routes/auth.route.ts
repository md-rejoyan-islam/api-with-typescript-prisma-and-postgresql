import express from "express";

import runValidation from "../middlewares/validator/validation";
import {
  userLoginValidator,
  userRegisterValidator,
  userResendCodeValidator,
  userVerifyCodeValidator,
} from "../middlewares/validator/file/user.validator";
import {
  activeUserAccountByCode,
  me,
  resendActivationCode,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/auth.controllers";
import { isLoggedIn, isLoggedOut } from "../middlewares/protect";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(userRegisterValidator, runValidation, isLoggedOut, userRegister);

// active user account by code
authRouter
  .route("/activate")
  .post(
    isLoggedOut,
    userVerifyCodeValidator,
    runValidation,
    activeUserAccountByCode
  );

// resend verification code  to email
authRouter
  .route("/resend-active-code")
  .post(
    isLoggedOut,
    userResendCodeValidator,
    runValidation,
    resendActivationCode
  );

authRouter
  .route("/login")
  .post(userLoginValidator, runValidation, isLoggedOut, userLogin);

authRouter.route("/logout").post(isLoggedIn, userLogout);

authRouter.route("/me").get(isLoggedIn, me);

// export
export default authRouter;
