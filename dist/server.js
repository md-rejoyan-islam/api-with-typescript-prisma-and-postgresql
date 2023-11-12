"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const corsSetup_1 = __importDefault(require("./config/corsSetup"));
const customError_1 = __importDefault(require("./helper/customError"));
const secret_1 = require("./secret");
const user_route_1 = __importDefault(require("./routes/user.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
// environment variables
dotenv_1.default.config();
// static files
app.use(express_1.default.static("public"));
// cookies
app.use((0, cookie_parser_1.default)());
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// cors setup
app.use((0, cors_1.default)(corsSetup_1.default));
// morgan
if (secret_1.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
// home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the home route",
    });
});
app.use("/api/users", user_route_1.default);
app.use("/api/posts", post_route_1.default);
app.use("/api/comments", comment_route_1.default);
app.use("/api/auth", auth_route_1.default);
// invalid route handler
app.use((req, res, next) => {
    next(new customError_1.default("Invalid route", 404));
});
// error handler
app.use(errorHandler_1.default);
// export
exports.default = app;
