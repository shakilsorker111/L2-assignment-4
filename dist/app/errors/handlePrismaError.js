"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaError = (error) => {
    if (error.code === "P2002") {
        return {
            statusCode: 409,
            message: "Duplicate value",
            errorDetails: [
                {
                    path: "",
                    message: "Unique constraint failed",
                },
            ],
        };
    }
    return {
        statusCode: 500,
        message: "Database Error",
        errorDetails: [
            {
                path: "",
                message: error.message,
            },
        ],
    };
};
exports.default = handlePrismaError;
