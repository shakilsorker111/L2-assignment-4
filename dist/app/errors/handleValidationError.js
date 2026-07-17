"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = () => {
    return {
        statusCode: 400,
        message: "Validation Error",
        errorDetails: [],
    };
};
exports.default = handleValidationError;
