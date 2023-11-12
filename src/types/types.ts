import { jwtLoginTokenSecret } from "./../secret";
import { Request } from "express";
import { type } from "os";

export type PortType = number | string;

export type NodeEnvType = string;

export interface User {
  id: number;
  email: string;
  password: string;
  role?: string;
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

export interface PaginationType {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  payload?: {
    pagination?: PaginationType;
    data?: {} | [];
  };
}

export type Role = "admin" | "superAdmin" | "user";

export interface RequestWithUser extends Request {
  me?: User;
}

export type jwtSecretKeyType = string;
export type jwtKeyExpireType = string;
