import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import CustomError from "../helper/customError";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";

/**
 * @method GET
 * @route /api/posts
 * @description Get all posts
 * @access Public
 */

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  // filter query
  let filters: any = { ...req.query };

  // sort ,page,limit exclude from filters
  const excludeFilters = ["sort", "page", "limit", "fields"];
  excludeFilters.forEach((field) => delete filters[field]);

  if (filters && typeof filters.userId === "string") {
    filters.userId = Number(filters.userId);
  }

  // queries
  const queries: {
    select?: {};
    orderBy?: {};
    limit?: number;
    page?: number;
    skip?: number;
    take?: number;
  } = {};

  // Specify the fields to display
  if (typeof req.query.fields === "string") {
    const fields = req.query.fields.split(",");
    const fieldsObj = fields.reduce((acc: any, field) => {
      acc[field] = true;
      return acc;
    }, {});

    queries.select = fieldsObj;
  }

  // sort query
  if (typeof req.query.sort === "string") {
    const sortItems = req.query.sort.split(",");
    const sortItemObj = sortItems.reduce((acc: any, item) => {
      if (item.startsWith("-")) {
        acc[item.slice(1)] = "desc";
      } else {
        acc[item] = "asc";
      }
      return acc;
    }, {});

    queries.orderBy = sortItemObj;
  }

  // pagination query
  if (!req.query.page && !req.query.limit) {
    queries.take = 10;
    queries.page = 1;
  }

  if (req.query.page || req.query.limit) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    queries.page = Number(page);
    queries.skip = skip;
    queries.take = Number(limit);
  }

  // filter query

  const posts = await client.post.findMany({
    include: {
      comments: true,
      user: true,
    },
    where: {
      ...filters,
    },
    // select: queries.select,
    skip: queries.skip,
    take: queries.take,
    orderBy: queries.orderBy,
  });
  if (!posts.length) throw new CustomError("Couldn't find any post data", 404);

  //count
  const count = await client.post.count({ where: { ...filters } });

  // page & limit
  const page = Number(queries.page);
  const limit = Number(queries.take);

  // pagination object
  const pagination = {
    totalDocuments: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
  };

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

export const deletePostById = asyncHandler(async (req, res) => {
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
});

/**
 * @method GET
 * @route /api/posts/:id/comments
 * @description Get all comments of a post
 * @access Public
 */

export const getAllCommentsOfPost = asyncHandler(async (req, res) => {
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
}); /**

 * @method GET
 * @route /api/posts/:id/user
 * @description Get user of a post
 * @access Public
 */

export const getUserOfPost = asyncHandler(async (req, res) => {
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
});

/**
 * @method POST
 * @route /api/posts/
 * @description Bulk create posts
 * @access Admin
 */

export const bulkCreatePosts = asyncHandler(async (req, res) => {
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
});

/**
 * @method DELETE
 * @route /api/posts/
 * @description Bulk delete posts
 * @access Admin
 */

export const bulkDeletePosts = asyncHandler(async (req, res) => {});

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

export const commentOnPost = asyncHandler(async (req, res) => {
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
});
