"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customRequest = (req, res, next, loginUser) => {
    req.me = loginUser;
    next();
};
exports.default = customRequest;
