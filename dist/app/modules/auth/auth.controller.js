"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.registerUser(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.loginUser(req.body);
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: "Login successful",
        data: result,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.getMe(req.user.userId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Profile retrieved successfully",
        data: result,
    });
});
exports.AuthController = {
    registerUser,
    loginUser,
    getMe,
};
