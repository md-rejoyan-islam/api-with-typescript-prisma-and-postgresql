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
exports.commentOnPost = exports.bulkUpdatePosts = exports.deletePostsByIds = exports.bulkDeletePosts = exports.bulkCreatePosts = exports.getUserOfPost = exports.getAllCommentsOfPost = exports.deletePostById = exports.updatePostById = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client/client"));
const customError_1 = __importDefault(require("../helper/customError"));
const responseHandler_1 = require("../helper/responseHandler");
const filterQuery_1 = __importDefault(require("../helper/filterQuery"));
const pagination_1 = __importDefault(require("../helper/pagination"));
/**
 * @method GET
 * @route /api/posts
 * @description Get all posts
 * @access Public
 */
exports.getAllPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // filter query
    const { queries, filters } = (0, filterQuery_1.default)(req);
    const posts = yield client_1.default.post.findMany({
        include: {
            comments: true,
            user: true,
        },
        where: Object.assign({}, filters),
        // select: {
        //   ...queries.select,    // select and include not work together
        // },
        skip: queries.skip,
        take: queries.take,
        orderBy: queries.orderBy,
    });
    if (!posts.length)
        throw new customError_1.default("Couldn't find any post data", 404);
    //count
    const count = yield client_1.default.post.count({ where: Object.assign({}, filters) });
    // pagination
    const pagination = (0, pagination_1.default)(queries, count);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All posts data",
        payload: {
            pagination,
            data: posts,
        },
    });
}));
/**
 * @method GET
 * @route /api/posts/:id
 * @description Get post by id
 * @access Public
 */
exports.getPostById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            comments: true,
            user: true,
        },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Post data",
        payload: {
            data: post,
        },
    });
}));
/**
 * @method POST
 * @route /api/posts
 * @description Create new post
 * @access Public
 */
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let userId;
    //if admin or super admin
    if (((_a = req.me) === null || _a === void 0 ? void 0 : _a.role) === "admin" || ((_b = req.me) === null || _b === void 0 ? void 0 : _b.role) === "superAdmin") {
        userId = req.body.userId;
    }
    // if user
    else {
        userId = (_c = req.me) === null || _c === void 0 ? void 0 : _c.id;
    }
    // check user id
    if (!userId)
        throw new customError_1.default("User id not found", 404);
    const user = yield client_1.default.user.findUnique({
        where: { id: Number(userId) },
    });
    if (!user)
        throw new customError_1.default("User not found", 404);
    const post = yield client_1.default.post.create({
        data: Object.assign(Object.assign({}, req.body), { userId: Number(userId) }),
    });
    // success response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 201,
        message: "Post created successfully",
        payload: post,
    });
}));
/**
 * @method PUT
 * @route /api/posts/:id
 * @description Update post by id
 * @access Public
 */
exports.updatePostById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            comments: true,
            user: true,
        },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // if update user id
    if (req.body.userId) {
        const user = yield client_1.default.user.findUnique({
            where: { id: req.body.userId },
        });
        if (!user)
            throw new customError_1.default("User not found", 404);
    }
    // updated post
    const updatedPost = yield client_1.default.post.update({
        where: { id: Number(req.params.id) },
        include: {
            comments: true,
            user: true,
        },
        data: req.body,
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Post data updated successfully",
        payload: updatedPost,
    });
}));
/**
 * @method DELETE
 * @route /api/posts/:id
 * @description Delete post by id
 * @access Public
 */
exports.deletePostById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            comments: true,
            user: true,
        },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // deleted post
    const deletedPost = yield client_1.default.post.delete({
        where: { id: Number(req.params.id) },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Post data deleted successfully",
        payload: deletedPost,
    });
}));
/**
 * @method GET
 * @route /api/posts/:id/comments
 * @description Get all comments of a post
 * @access Public
 */
exports.getAllCommentsOfPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            comments: true,
            user: true,
        },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: `All comments of post ${post.id}`,
        payload: {
            comments: post.comments,
        },
    });
})); /**

 * @method GET
 * @route /api/posts/:id/user
 * @description Get user of a post
 * @access Public
 */
exports.getUserOfPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            user: true,
        },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "User data of post id :" + post.id,
        payload: {
            user: post.user,
        },
    });
}));
/**
 * @method POST
 * @route /api/posts/
 * @description Bulk create posts
 * @access Admin
 */
exports.bulkCreatePosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // before all data delete
    yield client_1.default.post.deleteMany({});
    if (!Array.isArray(req.body))
        throw new customError_1.default("Invalid format.Support array type data", 400);
    // user id check
    // all users
    const users = yield client_1.default.user.findMany();
    req.body.forEach((item) => {
        const user = users.find((user) => user.id === Number(item.userId));
        if (!user)
            throw new customError_1.default("User not found", 404);
    });
    const createdPosts = yield client_1.default.post.createMany({
        data: req.body,
    });
    // created posts data
    const posts = yield client_1.default.post.findMany();
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 201,
        message: "Posts created successfully",
        payload: {
            data: posts,
        },
    });
}));
/**
 * @method DELETE
 * @route /api/posts/
 * @description Bulk delete posts
 * @access Admin
 */
exports.bulkDeletePosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
/**
 * @method DELETE
 * @route /api/posts
 * @description Delete posts by ids
 * @access Admin
 */
exports.deletePostsByIds = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
/**
 * @method PUT
 * @route /api/posts
 * @description Bulk update posts
 * @access Admin
 */
exports.bulkUpdatePosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
/**
 * @method PUT
 * @route /api/posts/comment/1
 * @description add comment in a post
 * @access  Public
 */
exports.commentOnPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield client_1.default.post.findUnique({
        where: { id: Number(req.params.id) },
    });
    if (!post)
        throw new customError_1.default("Couldn't find any post data", 404);
    // comment on post
    const data = yield client_1.default.post.update({
        where: { id: Number(req.params.id) },
        data: {
            comments: {
                create: Object.assign({}, req.body),
            },
        },
        include: {
            comments: true,
        },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "Comment Added",
        payload: {
            data,
        },
    });
}));
