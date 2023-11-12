"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const post_validator_1 = require("../middlewares/validator/file/post.validator");
const validation_1 = __importDefault(require("../middlewares/validator/validation"));
const authorization_1 = require("../middlewares/authorization");
const protect_1 = require("../middlewares/protect");
const postRouter = express_1.default.Router();
postRouter
    .route("/")
    .get(post_controller_1.getAllPosts)
    .post(protect_1.isLoggedIn, post_validator_1.postValidator, validation_1.default, post_controller_1.createPost);
// bulk post create and delete
postRouter
    .route("/bulk")
    .post((0, authorization_1.authorization)("admin", "superAdmin"), post_controller_1.bulkCreatePosts)
    .delete((0, authorization_1.authorization)("admin", "superAdmin"), post_controller_1.bulkDeletePosts);
postRouter
    .route("/:id")
    .get(post_controller_1.getPostById)
    .put(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin", "user"), post_controller_1.updatePostById)
    .delete(protect_1.isLoggedIn, (0, authorization_1.authorization)("admin", "superAdmin", "user"), post_controller_1.deletePostById);
// comment add in post
postRouter.put("/:id/add-comment", post_validator_1.postCommentDataValidator, validation_1.default, post_controller_1.commentOnPost);
// get all post comments
postRouter.route("/:id/comments").get(post_controller_1.getAllCommentsOfPost);
// get user of post
postRouter.route("/:id/user").get(post_controller_1.getUserOfPost);
// export
exports.default = postRouter;
