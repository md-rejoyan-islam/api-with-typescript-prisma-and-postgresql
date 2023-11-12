import express from "express";
import {
  bulkCreateUsers,
  bulkDeleteUsers,
  createUser,
  deleteUserById,
  getAllPostsOfUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user.controller";
import { userRegisterValidator } from "../middlewares/validator/file/user.validator";
import runValidation from "../middlewares/validator/validation";
import { isLoggedIn } from "../middlewares/protect";
import { authorization } from "../middlewares/authorization";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(
    isLoggedIn,
    authorization("admin", "superAdmin"),
    userRegisterValidator,
    runValidation,
    createUser
  );

// bulk user create and delete
userRouter
  .route("/bulk")
  .post(bulkCreateUsers)
  .delete(isLoggedIn, authorization("admin", "superAdmin"), bulkDeleteUsers);

userRouter
  .route("/:id")
  .get(getUserById)
  .put(isLoggedIn, authorization("admin", "superAdmin", "user"), updateUserById)
  .delete(
    isLoggedIn,
    authorization("admin", "superAdmin", "user"),
    deleteUserById
  );

// get all post of user
userRouter.route("/:id/posts").get(getAllPostsOfUser);

// export
export default userRouter;
