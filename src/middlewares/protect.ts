import { CustomRequest, tokenType } from "./../types/types";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { jwtLoginTokenSecret } from "../secret";
import { errorResponse } from "../helper/responseHandler";
import { User } from "../types/types";

import { NextFunction, Response } from "express";
import CustomError from "../helper/customError";
import client from "../prisma/client/client";
import { log } from "console";

export const isLoggedIn = asyncHandler(
  async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader: tokenType = req.headers.authorization; // || req.headers.Authorization;

    const authToken: tokenType = req?.cookies?.accessToken;

    let token: tokenType;

    if (authHeader || authToken) {
      token = authHeader?.split(" ")[1] || authToken;
    }

    if (!token) {
      throw new CustomError(
        "Unauthorized, Access token not found. Please login.",
        401
      );
    }

    jwt.verify(token, jwtLoginTokenSecret, async (err: any, decode: any) => {
      if (err) {
        return errorResponse(res, {
          statusCode: 400,
          message: "Unauthorized, Invalid access token.Please login again",
        });
      }
      const loginUser = await client.user.findUnique({
        where: { email: decode.email },
      });

      req.me = { ...loginUser, id: Number(loginUser?.id) } as User;

      next();
    });
  }
);

export const isLoggedOut = asyncHandler(async (req, res, next) => {
  const authHeader: string | undefined = req.headers.authorization; //|| req.headers.Authorization;
  const authToken = req?.cookies?.accessToken;
  let token: tokenType;

  if (authHeader || authToken) {
    token = authHeader?.split(" ")[1] || authToken;
  }

  if (token) {
    throw new CustomError("User is already logged in", 400);
  }

  next();
});
