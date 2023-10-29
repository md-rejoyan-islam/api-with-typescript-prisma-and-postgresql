"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const comment_validator_1 = require("../middlewares/validator/file/comment.validator");
const validation_1 = __importDefault(require("../middlewares/validator/validation"));
const commentRouter = express_1.default.Router();
commentRouter
    .route("/")
    .get(comment_controller_1.getAllComments)
    .post(comment_validator_1.commentValidator, validation_1.default, comment_controller_1.createComment);
// bulk comment create and  delete
commentRouter.route("/bulk").delete(comment_controller_1.deleteAllComments).post(comment_controller_1.bulkCommentsCreate);
// delete by ids
commentRouter.delete("/delete-by-ids", comment_controller_1.deleteCommentsByIds);
commentRouter
    .route("/:id")
    .get(comment_controller_1.getCommentById)
    .put(comment_controller_1.updateCommentById)
    .delete(comment_controller_1.deleteCommentById);
// export
exports.default = commentRouter;
