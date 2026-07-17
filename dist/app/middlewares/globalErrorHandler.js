"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const handlePrismaError_1 = __importDefault(require("../errors/handlePrismaError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = [];
    if (err instanceof zod_1.ZodError) {
        const simplified = (0, handleZodError_1.default)(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
        errorDetails = simplified.errorDetails;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplified = (0, handlePrismaError_1.default)(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
        errorDetails = simplified.errorDetails;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : undefined,
    });
};
exports.default = globalErrorHandler;
