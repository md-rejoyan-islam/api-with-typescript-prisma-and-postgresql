import dotenv from "dotenv";
import {
  NodeEnvType,
  PortType,
  jwtKeyExpireType,
  jwtSecretKeyType,
} from "./types/types";
import { JwkKeyExportOptions } from "crypto";

// config dotenv
dotenv.config();

export const PORT: PortType = process.env.SERVER_PORT || 8000;
export const NODE_ENV: NodeEnvType = process.env.NODE_ENV || "development";

export const jwtLoginTokenSecret =
  process.env.JWT_LOGIN_TOKEN_SECRET || "secret";

// account verification key and expire
export const verifyKey: jwtSecretKeyType =
  process.env.JWT_VERIFY_SECRET_KEY || "secret";
export const verifyKeyExpire: jwtKeyExpireType =
  process.env.VERIFY_JWT_EXPIRE || "300s";

export const jwtLoginTokenExpire: string =
  process.env.JWT_LOGIN_EXPIRE || "365d";

export const smtpHost: string = process.env.SMTP_HOST || "smtp.gmail.com";
export const smtpPort: number = Number(process.env.SMTP_PORT) || 587;
export const emailUser: string = process.env.EMAIL_HOST_USER || "";
export const emailPass: string = process.env.EMAIL_HOST_PASSWORD || "";
