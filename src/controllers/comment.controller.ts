import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import CustomError from "../helper/customError";
import { successResponse } from "../helper/responseHandler";
import { Request, Response } from "express";

/**
 * @method GET
 * @route /api/comments
 * @description Get all comments
 * @access Public
 */

export const getAllComments = asyncHandler(
  async (req: Request, res: Response) => {
    const comments = await client.comment.findMany({
      include: {
        post: true,
      },
    });

    if (!comments.length)
      throw new CustomError("Couldn't find any comment data", 404);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "All comments data",
      payload: {
        data: comments,
      },
    });
  }
);

/**
 * @method GET
 * @route /api/comments/:id
 * @description Get comment by id
 * @access Public
 */

export const getCommentById = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await client.comment.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        post: true,
      },
    });

    if (!comment) throw new CustomError("Couldn't find any comment data", 404);

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Comment data",
      payload: comment,
    });
  }
);

/**
 * @method POST
 * @route /api/comments
 * @description Create new comment
 * @access Public
 */

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    // post find
    const post = await client.post.findUnique({
      where: { id: Number(req.body.postId) },
    });

    if (!post) throw new CustomError("Couldn't find any post data.", 404);

    const newComment = await client.comment.create({
      data: {
        ...req.body,
        postId: Number(req.body.postId),
      },
    });

    // response send
    successResponse(res, {
      statusCode: 200,
      message: "Comment created",
      payload: newComment,
    });
  }
);

/**
 * @method PUT
 * @route /api/comments/:id
 * @description Update comment by id
 * @access Public
 */

export const updateCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // comment find
  const comment = await client.comment.findUnique({
    where: { id: Number(id) },
  });

  if (!comment) throw new CustomError("Couldn't find any comment data.", 404);

  const updatedComment = await client.comment.update({
    where: { id: Number(id) },
    data: {
      ...req.body,
    },
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Comment updated",
    payload: updatedComment,
  });
});

/**
 * @method DELETE
 * @route /api/comments/:id
 * @description Delete comment by id
 * @access Public
 */

export const deleteCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // comment find
  const comment = await client.comment.findUnique({
    where: { id: Number(id) },
  });

  if (!comment) throw new CustomError("Couldn't find any comment data.", 404);

  const deletedComment = await client.comment.delete({
    where: { id: Number(id) },
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Comment deleted",
    payload: deletedComment,
  });
});

/**
 * @method Bulk DELETE
 * @route /api/comments/bulk
 * @description Delete all comments
 * @access Admin
 */

export const bulkCommentsCreate = asyncHandler(async (req, res) => {
  // array check
  if (!Array.isArray(req.body))
    throw new CustomError("Please provide an array of comments", 400);

  // before all comments delete
  await client.comment.deleteMany();

  // post id check
  const posts = await client.post.findMany();

  req.body.forEach((comment) => {
    const post = posts.find((post) => post.id === comment.postId);
    if (!post)
      throw new CustomError(`Post id ${comment.postId} not found`, 404);
  });

  // bulk create
  await client.comment.createMany({
    data: req.body,
  });

  // created comments
  const comments = await client.comment.findMany({
    include: {
      post: true,
    },
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Some comments created",
    payload: {
      data: comments,
    },
  });
});

/**
 * @method Bulk POST
 * @route /api/comments/bulk
 * @description Delete all comments
 * @access Admin
 */

export const deleteAllComments = asyncHandler(async (req, res) => {
  await client.comment.deleteMany();

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "All comments deleted",
  });
});

/**
 * @method DELETE
 * @route /api/comments/
 * @description Delete =comment by ids
 * @access Admin
 */

export const deleteCommentsByIds = asyncHandler(async (req, res) => {
  const commentsId = await client.comment.findMany({
    select: {
      id: true,
    },
  });

  let ids: number[] = [];
  commentsId.forEach((item) => {
    ids.push(Number(item.id));
  });

  const idsArray: number[] = req.body.ids;
  console.log(ids);

  idsArray.forEach((item) => {
    const includeId = ids.includes(item);
    if (!includeId)
      throw new CustomError(`No Comment found for id:${item}`, 404);
  });

  // delete
  await client.comment.deleteMany({
    where: {
      id: {
        in: req.body.ids,
      },
    },
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully deleted ids data",
  });
});
