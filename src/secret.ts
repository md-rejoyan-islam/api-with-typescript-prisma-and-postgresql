import dotenv from 'dotenv';
import { NodeEnvType, PortType } from './types/types';

// config dotenv
dotenv.config();

export const PORT: PortType = process.env.SERVER_PORT || 8000;
export const NODE_ENV: NodeEnvType = process.env.NODE_ENV || "development";


export const jwtLoginTokenSecret = process.env.JWT_LOGIN_TOKEN_SECRET || 'secret'


