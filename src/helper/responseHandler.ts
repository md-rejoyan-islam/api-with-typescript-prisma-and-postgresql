import { Response } from "express";

export const errorResponse = (
  res: Response,
  {
    statusCode = 500,
    message = "Unknown Server Error",
  }: { statusCode?: number; message?: string }
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message,
    },
  });
};

export const successResponse = (
  res: Response,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...payload,
  });
};
