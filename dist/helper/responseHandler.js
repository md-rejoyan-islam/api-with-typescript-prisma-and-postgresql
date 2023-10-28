"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, { statusCode = 500, message = "Unknown Server Error", }) => {
    return res.status(statusCode).json({
        success: false,
        error: {
            status: statusCode,
            message,
        },
    });
};
exports.errorResponse = errorResponse;
const successResponse = (res, { statusCode = 200, message = "Success", payload = {} }) => {
    return res.status(statusCode).json(Object.assign({ success: true, message }, payload));
};
exports.successResponse = successResponse;
