"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
// whitelist is an array of url's that are allowed to access the api
const whitelist = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://kinsust.org",
    "https://www.kinsust.org",
    "https://kin-sust-nextjs-rejoyanislam.vercel.app",
    "http://127.0.0.1:5500",
];
// corsOptions is an object with a function that checks if the origin is in the whitelist
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback((0, http_errors_1.default)(401, "Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};
// export the corsOptions object
exports.default = corsOptions;
