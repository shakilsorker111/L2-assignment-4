"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    return {
        statusCode: 400,
        message: "Validation Error",
        errorDetails: error.issues.map(issue => ({
            path: issue.path.join("."),
            message: issue.message,
        })),
    };
};
exports.default = handleZodError;
