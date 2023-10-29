import { log } from "console";
import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import CustomError from "../helper/customError";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";
import filterQuery from "../helper/filterQuery";
import paginationData from "../helper/pagination";

/**
 * @method GET
 * @route /api/posts
 * @description Get all posts
 * @access Public
 */

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  // filter query
  const { queries, filters } = filterQuery(req);

  const posts = await client.post.findMany({
    include: {
      comments: true,
      user: true,
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
  if (!posts.length) throw new CustomError("Couldn't find any post data", 404);

  //count
  const count = await client.post.count({ where: { ...filters } });

  // pagination
  const pagination = paginationData(queries, count);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All posts data",
    payload: {
      pagination,
      data: posts,
    },
  });
});

/**
 * @method GET
 * @route /api/posts/:id
 * @description Get post by id
 * @access Public
 */

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const post = await client.post.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      comments: true,
      user: true,
    },
  });

  if (!post) throw new CustomError("Couldn't find any post data", 404);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Post data",
    payload: {
      data: post,
    },
  });
});

/**
 * @method POST
 * @route /api/posts
 * @description Create new post
 * @access Public
 */

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  const user = await client.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) throw new CustomError("User not found", 404);

  const post = await client.post.create({
    data: {
      ...req.body,
      userId: Number(userId),
    },
  });

  // success response send
  successResponse(res, {
    statusCode: 201,
    message: "Post created successfully",
    payload: post,
  });
});

/**
 * @method PUT
 * @route /api/posts/:id
 * @description Update post by id
 * @access Public
 */

export const updatePostById = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await client.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: true,
        user: true,
      },
    });

    if (!post) throw new CustomError("Couldn't find any post data", 404);

    // if update user id
    if (req.body.userId) {
      const user = await client.user.findUnique({
        where: { id: req.body.userId },
      });

      if (!user) throw new CustomError("User not found", 404);
    }

    // updated post
    const updatedPost = await client.post.update({
      where: { id: Number(req.params.id) },
      include: {
        comments: true,
        user: true,
      },
      data: req.body,
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Post data updated successfully",
      payload: updatedPost,
    });
  }
);

/**
 * @method DELETE
 * @route /api/posts/:id
 * @description Delete post by id
 * @access Public
 */

export const deletePostById = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await client.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: true,
        user: true,
      },
    });

    if (!post) throw new CustomError("Couldn't find any post data", 404);

    // deleted post
    const deletedPost = await client.post.delete({
      where: { id: Number(req.params.id) },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Post data deleted successfully",
      payload: deletedPost,
    });
  }
);

/**
 * @method GET
 * @route /api/posts/:id/comments
 * @description Get all comments of a post
 * @access Public
 */

export const getAllCommentsOfPost = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await client.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: true,
        user: true,
      },
    });

    if (!post) throw new CustomError("Couldn't find any post data", 404);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: `All comments of post ${post.id}`,
      payload: {
        comments: post.comments,
      },
    });
  }
); /**

 * @method GET
 * @route /api/posts/:id/user
 * @description Get user of a post
 * @access Public
 */

export const getUserOfPost = asyncHandler(
  async (req: Request, res: Response) => {
    const post = await client.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
      },
    });

    if (!post) throw new CustomError("Couldn't find any post data", 404);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "User data of post id :" + post.id,
      payload: {
        user: post.user,
      },
    });
  }
);

/**
 * @method POST
 * @route /api/posts/
 * @description Bulk create posts
 * @access Admin
 */

export const bulkCreatePosts = asyncHandler(
  async (req: Request, res: Response) => {
    // before all data delete
    await client.post.deleteMany({});

    if (!Array.isArray(req.body))
      throw new CustomError("Invalid format.Support array type data", 400);

    // user id check

    // all users
    const users = await client.user.findMany();

    req.body.forEach((item) => {
      const user = users.find((user) => user.id === Number(item.userId));
      if (!user) throw new CustomError("User not found", 404);
    });

    const createdPosts = await client.post.createMany({
      data: req.body,
    });

    // created posts data
    const posts = await client.post.findMany();

    // response send
    successResponse(res, {
      statusCode: 201,
      message: "Posts created successfully",
      payload: {
        data: posts,
      },
    });
  }
);

/**
 * @method DELETE
 * @route /api/posts/
 * @description Bulk delete posts
 * @access Admin
 */

export const bulkDeletePosts = asyncHandler(
  async (req: Request, res: Response) => {}
);

/**
 * @method DELETE
 * @route /api/posts
 * @description Delete posts by ids
 * @access Admin
 */

export const deletePostsByIds = asyncHandler(async (req, res) => {});

/**
 * @method PUT
 * @route /api/posts
 * @description Bulk update posts
 * @access Admin
 */

export const bulkUpdatePosts = asyncHandler(async (req, res) => {});

/**
 * @method PUT
 * @route /api/posts/comment/1
 * @description add comment in a post
 * @access  Public
 */

export const commentOnPost = asyncHandler(
  async (req: Request, res: Response) => {
    // comment on post

    const data = await client.post.update({
      where: { id: Number(req.params.id) },
      data: {
        comments: {
          create: {
            ...req.body,
          },
        },
      },
      include: {
        comments: true,
      },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Comment Added",
      payload: {
        data,
      },
    });
  }
);
