import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import CustomError from "../helper/customError";
import randomHashCode from "../helper/randomHashCode";
import createJWT from "../helper/createJWT";
import {
  jwtLoginTokenExpire,
  jwtLoginTokenSecret,
  verifyKey,
  verifyKeyExpire,
} from "../secret";
import { successResponse } from "../helper/responseHandler";
import sendAccountVerifyMail from "../utils/email/accountActivationMail";
import matchPassword from "../helper/matchPassword";
import { RequestWithUser } from "../types/types";

/**
 *
 * @apiDescription    Create a new user account
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/register
 * @apiAccess         public
 *
 * @apiBody           { name, email, password, gender }
 *
 * @apiSuccess        { success: true , message: active your account by verify email, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 * @apiError          ( Bad Request 400 )     Invalid syntax / parameters
 * @apiError          ( Not Found: 404 )      Couldn't find any data!
 * @apiError          ( Conflict: 409 )       Already have an account.
 *
 */
export const userRegister = asyncHandler(
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

    // random hash code
    const { code, hashCode } = randomHashCode(4);

    // create verify token
    const verifyToken = createJWT(
      { email, code: hashCode },
      verifyKey,
      verifyKeyExpire
    );

    // create user
    const user = await client.user.create({
      data: req.body,
    });

    // prepare email data
    const emailData = {
      email,
      subject: "Account Activation Code.",
      code,
      verifyToken,
    };

    // send email
    sendAccountVerifyMail(emailData);

    // cookie set
    res.cookie("verifyToken", verifyToken, {
      httpOnly: false,
      maxAge: 1000 * 60 * 5, // 5 min
      secure: true, // only https
      sameSite: "none",
    });

    // response send
    successResponse(res, {
      statusCode: 201,
      message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
      payload: {
        data: user,
      },
    });
  }
);

/**
 *
 * @apiDescription    User login
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/login
 * @apiAccess         public
 *
 * @apiBody           { email, password }
 *
 * @apiDenied         { isBanned: true }
 *
 * @apiSuccess        { success: true , message: Successfully Login, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 * @apiError          ( Bad Request 400 )     Invalid syntax / parameters
 * @apiError          ( Not Found: 404 )      Couldn't find any user account!. Please register.
 *
 */
export const userLogin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // get user
    const user = await client.user.findUnique({
      where: { email },
    });

    // user check
    if (!user)
      throw new CustomError(
        "Couldn't find any user account!. Please register.",
        400
      );

    //  password match
    matchPassword(password, user.password);

    // isActivate check
    if (user.isVerified === false) {
      throw new CustomError("Please active your account.", 400);
    }

    // create  access token
    const accessToken = createJWT(
      { email },
      jwtLoginTokenSecret,
      jwtLoginTokenExpire
    );

    // response send
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
      secure: true, // only https
      sameSite: "none",
    });

    successResponse(res, {
      statusCode: 200,
      message: "Successfully Login to KIN.",
      payload: {
        data: { ...user, accessToken },
      },
    });
  }
);

/**
 *
 * @apiDescription    User Logout
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/logout
 * @apiAccess         Only Logged in user
 *
 * @apiCookie         accessToken
 *
 * @apiSuccess        { success: true , message: Successfully Logout }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
export const userLogout = (req: Request, res: Response) => {
  res?.clearCookie("accessToken", {
    httpOnly: false,
    secure: true, // only https
    sameSite: "none",
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Logout.",
  });
};

/**
 *
 * @apiDescription    Logged in user data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/me
 * @apiAccess         Only Logged in user
 *
 * @apiCookie         accessToken
 *
 * @apiSuccess        { success: true , message: Successfully Logout }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
export const me = asyncHandler(
  async (req: RequestWithUser, res: Response): Promise<void> => {
    if (!req?.me) {
      throw new CustomError(
        "Couldn't find any user account!. Please register.",
        404
      );
    }
    successResponse(res, {
      statusCode: 200,
      message: "Login User Data.",
      payload: {
        data: req.me,
      },
    });
  }
);
