import express from "express";

import runValidation from "../middlewares/validator/validation";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../middlewares/validator/file/user.validator";
import {
  me,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/auth.controllers";
import { isLoggedIn, isLoggedOut } from "../middlewares/protect";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(userRegisterValidator, runValidation, isLoggedOut, userRegister);

authRouter
  .route("/login")
  .post(userLoginValidator, runValidation, isLoggedOut, userLogin);

authRouter.route("/logout").post(isLoggedIn, userLogout);

authRouter.route("/me").get(isLoggedIn, me);

// export
export default authRouter;
