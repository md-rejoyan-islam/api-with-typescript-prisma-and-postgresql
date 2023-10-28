import { Request } from "express";

export type PortType = number | string;

export type NodeEnvType = string;

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CustomRequest extends Request {
  me?: User | undefined;
}

export type tokenType = string | undefined;
