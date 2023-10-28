// import { PrismaClient } from "@prisma/client";

import client from "../prisma/client/client";
import CustomError from "../helper/customError";

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

const connectDB = async (): Promise<void> => {
  try {
    const value = await client.$connect();
  } catch (error) {
    console.log(error);

    throw new CustomError("error.message", 400);
  }
};

export default connectDB;
