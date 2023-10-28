import { NextFunction, Response } from "express";
import { User } from "../types/types";

interface CustomRequest extends Request {
  me?: User;
}

const customRequest = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  loginUser: User
):void => {
  req.me = loginUser;
  next();
};

export default customRequest;
