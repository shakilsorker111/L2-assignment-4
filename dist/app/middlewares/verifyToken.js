"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    req.user = decoded;
    next();
};
exports.default = verifyToken;
