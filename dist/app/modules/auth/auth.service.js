"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwt_1 = require("../../utils/jwt");
const registerUser = async (payload) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (existingUser) {
        throw new AppError_1.default(409, "User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, config_1.default.bcrypt_salt_rounds);
    const user = await prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            phone: payload.phone,
            avatar: payload.avatar,
            role: payload.role,
        },
    });
    return user;
};
const loginUser = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    const accessToken = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    const { password, ...userWithoutPassword } = user;
    return {
        accessToken,
        user: userWithoutPassword,
    };
};
const getMe = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.AuthService = {
    registerUser,
    loginUser,
    getMe,
};
