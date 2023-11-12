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

const postRouter = express.Router();

postRouter
  .route("/")
  .get(getAllPosts)
  // admin and superAdmin can create post
  .post(
    postValidator,
    runValidation,
    authorization("admin", "superAdmin"),
    createPost
  );

// bulk post create and delete
postRouter
  .route("/bulk")
  .post(authorization("admin", "superAdmin"), bulkCreatePosts)
  .delete(authorization("admin", "superAdmin"), bulkDeletePosts);

postRouter
  .route("/:id")
  .get(getPostById)
  .put(authorization("admin", "superAdmin"), updatePostById)
  .delete(authorization("admin", "superAdmin"), deletePostById);

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
