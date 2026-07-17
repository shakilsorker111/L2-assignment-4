"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errors/AppError"));
const jwt_1 = require("../utils/jwt");
const auth = (req, _res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized."));
    }
    const token = authorization.startsWith("Bearer ")
        ? authorization.split(" ")[1]
        : authorization;
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid or expired token."));
    }
};
exports.default = auth;
