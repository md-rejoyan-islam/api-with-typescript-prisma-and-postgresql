import { User } from "./../types/types";
import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import { Request, Response } from "express";
import CustomError from "../helper/customError";
import { successResponse } from "../helper/responseHandler";
import hashPassword from "../helper/hashPassword";

/**
 * @method GET
 * @route /api/users
 * @description Get all users
 * @access Public
 */

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await client.user.findMany({
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
    },
  });

  if (!users.length) throw new CustomError("Couldn't find any user data", 404);
  successResponse(res, {
    statusCode: 200,
    message: "All users data",
    payload: {
      data: users,
    },
  });
});

/**
 * @method GET
 * @route /api/users/:id
 * @description Get user by id
 * @access Public
 */

export const getUserById = asyncHandler(async (req, res) => {
  const user = await client.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      posts: true,
    },
  });

  if (!user) throw new CustomError("Couldn't find any user data", 404);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User data",
    payload: {
      data: user,
    },
  });
});

/**
 * @method POST
 * @route /api/users
 * @description Create new user
 * @access Public
 */

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existEmail = await client.user.findUnique({
    where: { email },
  });
  const existUsername = await client.user.findUnique({
    where: { username: req.body.username },
  });
  if (existEmail) throw new CustomError("Email already exist", 400);
  if (existUsername) throw new CustomError("Username already exist", 400);

  // create user
  const user = await client.user.create({
    data: req.body,
  });

  // response send
  successResponse(res, {
    statusCode: 201,
    message: "User created successfully",
    payload: {
      ...user,
      password: hashPassword(req.body.password),
    },
  });
});

/**
 * @method PUT
 * @route /api/users/:id
 * @description Update user by id
 * @access Public
 */

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await client.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      posts: true,
    },
  });

  if (!user) throw new CustomError("Couldn't find any user data", 404);

  const updatedData = await client.user.update({
    where: { id: Number(req.params.id) },
    include: {
      posts: true,
    },
    data: req.body,
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User data updated successfully",
    payload: updatedData,
  });
});

/**
 * @method DELETE
 * @route /api/users/:id
 * @description Delete user by id
 * @access Public
 */

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await client.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      posts: true,
    },
  });

  if (!user) throw new CustomError("Couldn't find any user data", 404);

  // if user has posts then delete all posts
  if (user.posts.length) {
    await client.post.deleteMany({
      where: { userId: Number(req.params.id) },
    });
  }

  // deleted data
  const deletedData = await client.user.delete({
    where: { id: Number(req.params.id) },
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "User data deleted successfully",
    payload: deletedData,
  });
});

/**
 * @method GET
 * @route /api/users/:id/posts
 * @description Get all posts of a user
 * @access Public
 */

export const getAllPostsOfUser = asyncHandler(async (req, res) => {
  // user check
  const user = await client.user
    .findUnique({
      where: { id: Number(req.params.id) },
    })
    .posts();

  if (!user) throw new CustomError("Couldn't find any user data", 404);

  if (!user) throw new CustomError("Couldn't find any post data", 404);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All posts data of user",
    payload: {
      posts: user,
    },
  });
});

/**
 * @method GET
 * @route /api/users/:id/comments
 * @description Get all comments of a user
 * @access Public
 */

export const getAllCommentsOfUser = asyncHandler(async (req, res) => {});

/**
 * @method POST
 * @route /api/users/bulk-create
 * @description Bulk create users
 * @access Admin
 */

export const bulkCreateUsers = asyncHandler(async (req, res) => {
  // before all data delete
  await client.user.deleteMany();

  // only array of users accept
  if (!Array.isArray(req.body))
    throw new CustomError("Only array of users accept", 400);

  // password hash
  const newUsersData = req.body.map((user) => {
    return {
      ...user,
      password: hashPassword(user.password),
    };
  });

  // create users
  const createdUsers = await client.user.createMany({
    data: newUsersData,
  });

  // created users data
  const users = await client.user.findMany();

  // response send
  successResponse(res, {
    statusCode: 201,
    message: "Users created successfully",
    payload: {
      data: users,
    },
  });
});

/**
 * @method PUT
 * @route /api/users/
 * @description Bulk update users
 * @access Admin
 */

export const bulkUpdateUsers = asyncHandler(async (req, res) => {});

/**
 * @method DELETE
 * @route /api/users/
 * @description Bulk delete users
 * @access Admin
 */

export const bulkDeleteUsers = asyncHandler(async (req, res) => {
  // before all comment delete
  await client.comment.deleteMany();

  // before all post delete
  await client.post.deleteMany();

  await client.user.deleteMany();

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All users data deleted successfully",
  });
});

/**
 * @method DELETE
 * @route /api/users/
 * @description Delete users by ids
 * @access Admin
 */

export const deleteUsersByIds = asyncHandler(async (req, res) => {});
