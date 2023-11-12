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

    let id = req?.params?.id;

    // if post id
    if (req.baseUrl === "/api/posts") {
      id = String(req?.me?.id);
    }

    if (id) {
      // others
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
