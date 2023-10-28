"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (payload, secretKey, expiresIn) => {
    // payload check
    if (typeof payload !== "object" || !payload) {
        throw (0, http_errors_1.default)(404, "Payload must be a non-empty object.");
    }
    // secret key check
    if (typeof secretKey !== "string" || !secretKey) {
        throw (0, http_errors_1.default)(404, "Secret key must be a non-empty string");
    }
    // create token and return
    return jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn,
    });
};
// export token
exports.default = createJWT;
