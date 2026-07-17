"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errors/AppError"));
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user) {
        return next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }
    if (!roles.includes(req.user.role)) {
        return next(new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden"));
    }
    next();
};
exports.default = authorize;
