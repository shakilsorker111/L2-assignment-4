"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_1 = require("@prisma/client");
const createCategory = async (payload) => {
    const existing = await prisma_1.default.category.findFirst({
        where: {
            OR: [
                { name: payload.name },
                { slug: payload.slug },
            ],
        },
    });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category already exists");
    }
    return prisma_1.default.category.create({
        data: payload,
    });
};
const getAllCategories = async (query) => {
    const search = query.search || "";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        OR: [
            {
                name: {
                    contains: search,
                    mode: client_1.Prisma.QueryMode.insensitive,
                },
            },
            {
                slug: {
                    contains: search,
                    mode: client_1.Prisma.QueryMode.insensitive,
                },
            },
        ],
    };
    const [categories, total] = await Promise.all([
        prisma_1.default.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.category.count({
            where,
        }),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: categories,
    };
};
const getSingleCategory = async (id) => {
    const category = await prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return category;
};
const updateCategory = async (id, payload) => {
    return prisma_1.default.category.update({
        where: {
            id,
        },
        data: payload,
    });
};
const deleteCategory = async (id) => {
    return prisma_1.default.category.delete({
        where: {
            id,
        },
    });
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
