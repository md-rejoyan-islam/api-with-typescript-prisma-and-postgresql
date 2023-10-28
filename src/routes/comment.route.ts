import express from "express";
import {
  bulkCommentsCreate,
  createComment,
  deleteAllComments,
  deleteCommentById,
  deleteCommentsByIds,
  getAllComments,
  getCommentById,
  updateCommentById,
} from "../controllers/comment.controller";
import { commentValidator } from "../middlewares/validator/file/comment.validator";
import runValidation from "../middlewares/validator/validation";

const commentRouter = express.Router();

commentRouter
  .route("/")
  .get(getAllComments)
  .post(commentValidator, runValidation, createComment);

// bulk comment create

// bulk comment delete
commentRouter.route("/bulk").delete(deleteAllComments).post(bulkCommentsCreate);

// delete by ids
commentRouter.delete("/delete-by-ids", deleteCommentsByIds);

commentRouter
  .route("/:id")
  .get(getCommentById)
  .put(updateCommentById)
  .delete(deleteCommentById);

// export
export default commentRouter;
