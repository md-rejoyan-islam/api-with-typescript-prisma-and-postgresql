"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../helper/responseHandler");
const library_1 = require("@prisma/client/runtime/library");
const errorHandler = (err, re, res, next) => {
    let statusCode;
    if ("status" in err) {
        statusCode = Number(err.status);
    }
    let message = (err === null || err === void 0 ? void 0 : err.message) ? err === null || err === void 0 ? void 0 : err.message : "Unknown Server Error";
    if (err instanceof library_1.PrismaClientValidationError) {
        message = "Validation Error or query error";
    }
    console.log(err);
    // console.log(err instanceof PrismaClientValidationError);
    (0, responseHandler_1.errorResponse)(res, {
        statusCode,
        message,
    });
};
exports.default = errorHandler;
