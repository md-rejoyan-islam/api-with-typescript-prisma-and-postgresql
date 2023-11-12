import { NextFunction, Response } from "express";
import { RequestWithUser, Role } from "../types/types";
import { log } from "console";

export const authorization = (...role: Role[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!role.includes(req?.me?.role as Role)) {
      return res.status(403).json({
        Status: "Failed",
        message: "You don't have permission to perform this action",
      });
    }

    // make sure the user is authorized

    const id = req?.params?.id;

    if (id) {
      if (
        req?.me?.role === "admin" ||
        req?.me?.role === "superAdmin" ||
        req.me?.id?.toString().split('"')[0] === id
      ) {
        return next();
      }
      return res.status(403).json({
        Status: "Failed",
        message: "You don't have permission to perform this action",
      });
    }

    next();
  };
};
