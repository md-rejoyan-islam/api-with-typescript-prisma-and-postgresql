"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const authorization = (...role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!role.includes((_a = req === null || req === void 0 ? void 0 : req.me) === null || _a === void 0 ? void 0 : _a.role)) {
            return res.status(403).json({
                Status: "Failed",
                message: "You don't have permission to perform this action",
            });
        }
        // make sure the user is authorized
        let id = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        // if post id
        if (req.baseUrl === "/api/posts") {
            id = String((_c = req === null || req === void 0 ? void 0 : req.me) === null || _c === void 0 ? void 0 : _c.id);
        }
        if (id) {
            // others
            if (((_d = req === null || req === void 0 ? void 0 : req.me) === null || _d === void 0 ? void 0 : _d.role) === "admin" ||
                ((_e = req === null || req === void 0 ? void 0 : req.me) === null || _e === void 0 ? void 0 : _e.role) === "superAdmin" ||
                ((_g = (_f = req.me) === null || _f === void 0 ? void 0 : _f.id) === null || _g === void 0 ? void 0 : _g.toString().split('"')[0]) === id) {
                return next();
            }
            return res.status(403).json({
                Status: "Failed",
                message: "You don't have permission to perform this action",
            });
        }
        next();
    });
};
exports.authorization = authorization;
