import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import { Request, Response } from "express";
import CustomError from "../helper/customError";
import { successResponse } from "../helper/responseHandler";
import hashPassword from "../helper/hashPassword";
import filterQuery from "../helper/filterQuery";
import paginationData from "../helper/pagination";
import { ApiResponse } from "../types/types";

/**
 * @method GET
 * @route /api/users
 * @description Get all users
 * @access Public
 */

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // filter query
    const { queries, filters } = filterQuery(req);
    const users = await client.user.findMany({
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
      },
      where: {
        ...filters,
      },
      // select: {
      //   ...queries.select,    // select and include not work together
      // },
      skip: queries.skip,
      take: queries.take,
      orderBy: queries.orderBy,
    });

    if (!users.length)
      throw new CustomError("Couldn't find any user data", 404);

    //count
    const count = await client.user.count({ where: { ...filters } });

    // pagination
    const pagination = paginationData(queries, count);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "All users data",
      payload: {
        pagination,
        data: users,
      },
    });
  }
);

/**
 * @method GET
 * @route /api/users/:id
 * @description Get user by id
 * @access Public
 */

export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method POST
 * @route /api/users
 * @description Create new user
 * @access Public
 */

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method PUT
 * @route /api/users/:id
 * @description Update user by id
 * @access Public
 */

export const updateUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method DELETE
 * @route /api/users/:id
 * @description Delete user by id
 * @access Public
 */

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method GET
 * @route /api/users/:id/posts
 * @description Get all posts of a user
 * @access Public
 */

export const getAllPostsOfUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

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

export const bulkCreateUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method PUT
 * @route /api/users/
 * @description Bulk update users
 * @access Admin
 */

export const bulkUpdateUsers = asyncHandler(
  async (req: Request, res: Response) => {}
);

/**
 * @method DELETE
 * @route /api/users/
 * @description Bulk delete users
 * @access Admin
 */

export const bulkDeleteUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  }
);

/**
 * @method DELETE
 * @route /api/users/
 * @description Delete users by ids
 * @access Admin
 */

export const deleteUsersByIds = asyncHandler(async (req, res) => {});
