"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, payload) => {
    res.status(statusCode).json(payload);
};
exports.default = sendResponse;
