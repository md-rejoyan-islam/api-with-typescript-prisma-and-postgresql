import { Response } from "express";
import { ApiResponse } from "../types/types";

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
  res: Response<ApiResponse>,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  const response: ApiResponse = {
    success: true,
    message,
    ...payload,
  };

  return res.status(statusCode).json(response);
};
