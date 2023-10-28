"use strict";
// import { PrismaClient } from "@prisma/client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../prisma/client/client"));
const customError_1 = __importDefault(require("../helper/customError"));
// let db: PrismaClient;
// declare global {
//   var __db: PrismaClient | undefined;
// }
// if (process.env.NODE_ENV === "production") {
//   db = new PrismaClient();
//   db.$connect();
// } else {
//   if (!global.__db) {
//     global.__db = new PrismaClient();
//     global.__db.$connect();
//   }
//   db = global.__db;
// }
// export { db };
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield client_1.default.$connect();
    }
    catch (error) {
        console.log(error);
        throw new customError_1.default("error.message", 400);
    }
});
exports.default = connectDB;
