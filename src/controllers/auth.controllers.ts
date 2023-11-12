import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import client from "../prisma/client/client";
import CustomError from "../helper/customError";
import randomHashCode from "../helper/randomHashCode";
import createJWT from "../helper/createJWT";
import {
  jwtLoginTokenExpire,
  jwtLoginTokenSecret,
  jwtSecret,
  verifyKey,
  verifyKeyExpire,
} from "../secret";
import { errorResponse, successResponse } from "../helper/responseHandler";
import sendAccountVerifyMail from "../utils/email/accountActivationMail";
import matchPassword from "../helper/matchPassword";
import { RequestWithUser, User } from "../types/types";
import { log } from "console";
import hashPassword from "../helper/hashPassword";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
/**
 *
 * @apiDescription    Create a new user account
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/register
 * @apiAccess         public
 *
 * @apiBody           { name, username, email, password, gender }
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
    console.log(existEmail);

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
      data: { ...req.body, password: hashPassword(req.body.password) },
    });

    // prepare email data
    const emailData = {
      email,
      subject: "Account Activation Code.",
      code,
      verifyToken,
    };

    // send email
    await sendAccountVerifyMail(emailData);

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

/**
 *
 * @apiDescription    Active user account by code
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/activate
 * @apiAccess         registered user
 *
 * @apiBody           { code }
 *
 * @apiSuccess        { success: true , message: Successfully activated your account., data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
export const activeUserAccountByCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // token
    const token = req.cookies.verifyToken;

    // check token
    if (!token) {
      throw new CustomError("Token not found", 400);
    }

    // verify token
    jwt.verify(token, jwtSecret, async (err: Error | null, decoded: any) => {
      if (err) {
        return errorResponse(res, {
          statusCode: 400,
          message: "Time expired! ",
        });
      }

      // check if user is already verified
      const user = await client.user.findUnique({
        where: { email: decoded?.email },
      });

      // user exist check
      if (!user) {
        return errorResponse(res, {
          statusCode: 400,
          message: "Couldn't find any user account!. Please register.",
        });
      }

      if (user.isVerified === true) {
        return errorResponse(res, {
          statusCode: 400,
          message: "Your account is already active. Please login.",
        });
      }

      // check code
      const code = bcrypt.compareSync(req.body.code, decoded.code);

      if (!code) {
        return errorResponse(res, {
          statusCode: 400,
          message: "wrong code",
        });
      } else {
        await client.user.update({
          where: { email: decoded?.email },
          data: { isVerified: true },
        });

        // cookie clear
        res?.clearCookie("verifyToken", {
          sameSite: "strict",
        });

        // response send
        return successResponse(res, {
          statusCode: 201,
          message: "Successfully activated your account.",
        });
      }
    });
  }
);

/**
 *
 * @apiDescription    Resend verification code to email
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/resend-active-code
 * @apiAccess         registered user
 *
 * @apiBody           { email}
 *
 * @apiSuccess        { success: true , message: Email has been sent to email. Follow the instruction to activate your account, data: {} }
 * @apiFailed         { success: false , error: { status, message }
 *
 */
export const resendActivationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await client.user.findUnique({ where: { email } });

  // check: user is exist or not.
  if (!user) {
    throw new CustomError(
      "Couldn't find any user account!. Please register.",
      400
    );
  }

  // check: user is activate or not
  if (user.isVerified === true) {
    throw new CustomError("Your account is already active. Please login.", 400);
  }

  // random hash code
  const { code, hashCode } = randomHashCode(4);

  // create verify token
  const verifyToken = createJWT(
    { email, code: hashCode },
    verifyKey,
    verifyKeyExpire
  );

  // prepare email data
  const emailData = {
    email,
    subject: "Account Activation Code",
    code,
    verifyToken,
  };

  // send email
  sendAccountVerifyMail(emailData);

  res.cookie("verifyToken", verifyToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 5, // 5 min
    secure: true, // only https
    sameSite: "none",
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
  });
});
