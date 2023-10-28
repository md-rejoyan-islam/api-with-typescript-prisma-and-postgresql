import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../../helper/responseHandler";

const runValidation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    next();
  }
);

export default runValidation;
