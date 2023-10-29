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

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(userRegisterValidator, runValidation, createUser);

// bulk user create and delete
userRouter.route("/bulk").post(bulkCreateUsers).delete(bulkDeleteUsers);

userRouter
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

// get all post of user
userRouter.route("/:id/posts").get(getAllPostsOfUser);

// export
export default userRouter;
