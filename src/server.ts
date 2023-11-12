import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookies from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import corsOptions from "./config/corsSetup";
import CustomError from "./helper/customError";
import { NODE_ENV } from "./secret";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import commentRouter from "./routes/comment.route";
import authRouter from "./routes/auth.route";

const app = express();

// environment variables
dotenv.config();

// static files
app.use(express.static("public"));

// cookies
app.use(cookies());

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors setup
app.use(cors(corsOptions));

// morgan
if (NODE_ENV === "development") app.use(morgan("dev"));

// home route
app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Welcome to the home route",
  });
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

// invalid route handler
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(new CustomError("Invalid route", 404));
});

// error handler
app.use(errorHandler);

// export
export default app;
