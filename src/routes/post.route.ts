import express from "express";
import {
  bulkCreatePosts,
  bulkDeletePosts,
  commentOnPost,
  createPost,
  deletePostById,
  getAllCommentsOfPost,
  getAllPosts,
  getPostById,
  getUserOfPost,
  updatePostById,
} from "../controllers/post.controller";
import {
  postCommentDataValidator,
  postValidator,
} from "../middlewares/validator/file/post.validator";
import runValidation from "../middlewares/validator/validation";
import { authorization } from "../middlewares/authorization";
import { isLoggedIn } from "../middlewares/protect";

const postRouter = express.Router();

postRouter
  .route("/")
  .get(getAllPosts)
  .post(isLoggedIn, postValidator, runValidation, createPost);

// bulk post create and delete
postRouter
  .route("/bulk")
  .post(authorization("admin", "superAdmin"), bulkCreatePosts)
  .delete(authorization("admin", "superAdmin"), bulkDeletePosts);

postRouter
  .route("/:id")
  .get(getPostById)
  .put(isLoggedIn, authorization("admin", "superAdmin", "user"), updatePostById)
  .delete(
    isLoggedIn,
    authorization("admin", "superAdmin", "user"),
    deletePostById
  );

// comment add in post
postRouter.put(
  "/:id/add-comment",
  postCommentDataValidator,
  runValidation,
  commentOnPost
);

// get all post comments
postRouter.route("/:id/comments").get(getAllCommentsOfPost);

// get user of post
postRouter.route("/:id/user").get(getUserOfPost);

// export
export default postRouter;
