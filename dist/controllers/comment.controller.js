"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentsByIds = exports.deleteAllComments = exports.bulkCommentsCreate = exports.deleteCommentById = exports.updateCommentById = exports.createComment = exports.getCommentById = exports.getAllComments = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client/client"));
const customError_1 = __importDefault(require("../helper/customError"));
const responseHandler_1 = require("../helper/responseHandler");
/**
 * @method GET
 * @route /api/comments
 * @description Get all comments
 * @access Public
 */
exports.getAllComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield client_1.default.comment.findMany({
        include: {
            post: true,
        },
    });
    if (!comments.length)
        throw new customError_1.default("Couldn't find any comment data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All comments data",
        payload: {
            data: comments,
        },
    });
}));
/**
 * @method GET
 * @route /api/comments/:id
 * @description Get comment by id
 * @access Public
 */
exports.getCommentById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield client_1.default.comment.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            post: true,
        },
    });
    if (!comment)
        throw new customError_1.default("Couldn't find any comment data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Comment data",
        payload: comment,
    });
}));
/**
 * @method POST
 * @route /api/comments
 * @description Create new comment
 * @access Public
 */
exports.createComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // post find
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.body.postId) },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data.", 404);
    const newComment = yield client_1.default.comment.create({
        data: Object.assign(Object.assign({}, req.body), { postId: Number(req.body.postId) }),
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Comment created",
        payload: newComment,
    });
}));
/**
 * @method PUT
 * @route /api/comments/:id
 * @description Update comment by id
 * @access Public
 */
exports.updateCommentById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // comment find
    const comment = yield client_1.default.comment.findUnique({
        where: { id: Number(id) },
    });
    if (!comment)
        throw new customError_1.default("Couldn't find any comment data.", 404);
    const updatedComment = yield client_1.default.comment.update({
        where: { id: Number(id) },
        data: Object.assign({}, req.body),
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Comment updated",
        payload: updatedComment,
    });
}));
/**
 * @method DELETE
 * @route /api/comments/:id
 * @description Delete comment by id
 * @access Public
 */
exports.deleteCommentById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // comment find
    const comment = yield client_1.default.comment.findUnique({
        where: { id: Number(id) },
    });
    if (!comment)
        throw new customError_1.default("Couldn't find any comment data.", 404);
    const deletedComment = yield client_1.default.comment.delete({
        where: { id: Number(id) },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Comment deleted",
        payload: deletedComment,
    });
}));
/**
 * @method Bulk DELETE
 * @route /api/comments/bulk
 * @description Delete all comments
 * @access Admin
 */
exports.bulkCommentsCreate = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // array check
    if (!Array.isArray(req.body))
        throw new customError_1.default("Please provide an array of comments", 400);
    // before all comments delete
    yield client_1.default.comment.deleteMany();
    // post id check
    const posts = yield client_1.default.post.findMany();
    req.body.forEach((comment) => {
        const post = posts.find((post) => post.id === comment.postId);
        if (!post)
            throw new customError_1.default(`Post id ${comment.postId} not found`, 404);
    });
    // bulk create
    yield client_1.default.comment.createMany({
        data: req.body,
    });
    // created comments
    const comments = yield client_1.default.comment.findMany({
        include: {
            post: true,
        },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Some comments created",
        payload: {
            data: comments,
        },
    });
}));
/**
 * @method Bulk POST
 * @route /api/comments/bulk
 * @description Delete all comments
 * @access Admin
 */
exports.deleteAllComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.comment.deleteMany();
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All comments deleted",
    });
}));
/**
 * @method DELETE
 * @route /api/comments/
 * @description Delete =comment by ids
 * @access Admin
 */
exports.deleteCommentsByIds = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentsId = yield client_1.default.comment.findMany({
        select: {
            id: true,
        },
    });
    let ids = [];
    commentsId.forEach((item) => {
        ids.push(Number(item.id));
    });
    const idsArray = req.body.ids;
    console.log(ids);
    idsArray.forEach((item) => {
        const includeId = ids.includes(item);
        if (!includeId)
            throw new customError_1.default(`No Comment found for id:${item}`, 404);
    });
    // delete
    yield client_1.default.comment.deleteMany({
        where: {
            id: {
                in: req.body.ids,
            },
        },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Successfully deleted ids data",
    });
}));
