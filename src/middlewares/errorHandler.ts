import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseHandler";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { log } from "console";

const errorHandler = (
  err: Error,
  re: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode;
  if ("status" in err) {
    statusCode = Number(err.status);
  }
  let message = err?.message ? err?.message : "Unknown Server Error";

  if (err instanceof PrismaClientValidationError) {
    message = "Validation Error or query error";
  }

  errorResponse(res, {
    statusCode,
    message,
  });
};

export default errorHandler;
