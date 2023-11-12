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
exports.deleteUsersByIds = exports.bulkDeleteUsers = exports.bulkUpdateUsers = exports.bulkCreateUsers = exports.getAllCommentsOfUser = exports.getAllPostsOfUser = exports.deleteUserById = exports.updateUserById = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client/client"));
const customError_1 = __importDefault(require("../helper/customError"));
const responseHandler_1 = require("../helper/responseHandler");
const hashPassword_1 = __importDefault(require("../helper/hashPassword"));
const filterQuery_1 = __importDefault(require("../helper/filterQuery"));
const pagination_1 = __importDefault(require("../helper/pagination"));
/**
 * @method GET
 * @route /api/users
 * @description Get all users
 * @access Public
 */
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // filter query
    const { queries, filters } = (0, filterQuery_1.default)(req);
    const users = yield client_1.default.user.findMany({
        include: {
            posts: {
                include: {
                    comments: true,
                },
            },
        },
        where: Object.assign({}, filters),
        // select: {
        //   ...queries.select,    // select and include not work together
        // },
        skip: queries.skip,
        take: queries.take,
        orderBy: queries.orderBy,
    });
    if (!users.length)
        throw new customError_1.default("Couldn't find any user data", 404);
    //count
    const count = yield client_1.default.user.count({ where: Object.assign({}, filters) });
    // pagination
    const pagination = (0, pagination_1.default)(queries, count);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All users data",
        payload: {
            pagination,
            data: users,
        },
    });
}));
/**
 * @method GET
 * @route /api/users/:id
 * @description Get user by id
 * @access Public
 */
exports.getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            posts: true,
        },
    });
    if (!user)
        throw new customError_1.default("Couldn't find any user data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "User data",
        payload: {
            data: user,
        },
    });
}));
/**
 * @method POST
 * @route /api/users
 * @description Create new user
 * @access Public
 */
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existEmail = yield client_1.default.user.findUnique({
        where: { email },
    });
    const existUsername = yield client_1.default.user.findUnique({
        where: { username: req.body.username },
    });
    if (existEmail)
        throw new customError_1.default("Email already exist", 400);
    if (existUsername)
        throw new customError_1.default("Username already exist", 400);
    // create user
    const user = yield client_1.default.user.create({
        data: req.body,
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 201,
        message: "User created successfully",
        payload: Object.assign(Object.assign({}, user), { password: (0, hashPassword_1.default)(req.body.password) }),
    });
}));
/**
 * @method PUT
 * @route /api/users/:id
 * @description Update user by id
 * @access Public
 */
exports.updateUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            posts: true,
        },
    });
    if (!user)
        throw new customError_1.default("Couldn't find any user data", 404);
    const updatedData = yield client_1.default.user.update({
        where: { id: Number(req.params.id) },
        include: {
            posts: true,
        },
        data: Object.assign(Object.assign({}, req.body), { password: (0, hashPassword_1.default)(req.body.password) }),
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "User data updated successfully",
        payload: updatedData,
    });
}));
/**
 * @method DELETE
 * @route /api/users/:id
 * @description Delete user by id
 * @access Public
 */
exports.deleteUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            posts: true,
        },
    });
    if (!user)
        throw new customError_1.default("Couldn't find any user data", 404);
    // if user has posts then delete all posts
    if (user.posts.length) {
        yield client_1.default.post.deleteMany({
            where: { userId: Number(req.params.id) },
        });
    }
    // deleted data
    const deletedData = yield client_1.default.user.delete({
        where: { id: Number(req.params.id) },
    });
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "User data deleted successfully",
        payload: deletedData,
    });
}));
/**
 * @method GET
 * @route /api/users/:id/posts
 * @description Get all posts of a user
 * @access Public
 */
exports.getAllPostsOfUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // user check
    const user = yield client_1.default.user
        .findUnique({
        where: { id: Number(req.params.id) },
    })
        .posts();
    if (!user)
        throw new customError_1.default("Couldn't find any user data", 404);
    if (!user)
        throw new customError_1.default("Couldn't find any post data", 404);
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All posts data of user",
        payload: {
            posts: user,
        },
    });
}));
/**
 * @method GET
 * @route /api/users/:id/comments
 * @description Get all comments of a user
 * @access Public
 */
exports.getAllCommentsOfUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
/**
 * @method POST
 * @route /api/users/bulk-create
 * @description Bulk create users
 * @access Admin
 */
exports.bulkCreateUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // before all data delete
    yield client_1.default.user.deleteMany();
    // only array of users accept
    if (!Array.isArray(req.body))
        throw new customError_1.default("Only array of users accept", 400);
    // password hash
    const newUsersData = req.body.map((user) => {
        return Object.assign(Object.assign({}, user), { password: (0, hashPassword_1.default)(user.password) });
    });
    // create users
    const createdUsers = yield client_1.default.user.createMany({
        data: newUsersData,
    });
    // created users data
    const users = yield client_1.default.user.findMany();
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 201,
        message: "Users created successfully",
        payload: {
            data: users,
        },
    });
}));
/**
 * @method PUT
 * @route /api/users/
 * @description Bulk update users
 * @access Admin
 */
exports.bulkUpdateUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
/**
 * @method DELETE
 * @route /api/users/
 * @description Bulk delete users
 * @access Admin
 */
exports.bulkDeleteUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // before all comment delete
    yield client_1.default.comment.deleteMany();
    // before all post delete
    yield client_1.default.post.deleteMany();
    yield client_1.default.user.deleteMany();
    // response send
    (0, responseHandler_1.successResponse)(res, {
        statusCode: 200,
        message: "All users data deleted successfully",
    });
}));
/**
 * @method DELETE
 * @route /api/users/
 * @description Delete users by ids
 * @access Admin
 */
exports.deleteUsersByIds = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
