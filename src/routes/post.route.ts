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

const postRouter = express.Router();

postRouter
  .route("/")
  .get(getAllPosts)
  .post(postValidator, runValidation, createPost);

// bulk post create
postRouter.route("/bulk").post(bulkCreatePosts).delete(bulkDeletePosts);

postRouter
  .route("/:id")
  .get(getPostById)
  .put(updatePostById)
  .delete(deletePostById);

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
