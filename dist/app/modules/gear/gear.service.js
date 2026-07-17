"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createGear = async (payload, providerId) => {
    const category = await prisma_1.default.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    const gear = await prisma_1.default.gearItem.create({
        data: {
            ...payload,
            providerId,
            availableStock: payload.stock,
            isAvailable: payload.stock > 0,
        },
    });
    return gear;
};
const updateGear = async (id, payload, providerId) => {
    const gear = await prisma_1.default.gearItem.findUnique({
        where: {
            id,
        },
    });
    if (!gear) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Gear not found");
    }
    if (gear.providerId !== providerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can update only your own gear");
    }
    const updatedGear = await prisma_1.default.gearItem.update({
        where: {
            id,
        },
        data: {
            ...payload,
            ...(payload.stock !== undefined && {
                availableStock: payload.stock,
                isAvailable: payload.stock > 0,
            }),
        },
    });
    return updatedGear;
};
const deleteGear = async (id, providerId) => {
    const gear = await prisma_1.default.gearItem.findUnique({
        where: {
            id,
        },
    });
    if (!gear) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Gear not found");
    }
    if (gear.providerId !== providerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can delete only your own gear");
    }
    await prisma_1.default.gearItem.delete({
        where: {
            id,
        },
    });
    return null;
};
const getAllGear = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search;
    const category = query.category;
    const brand = query.brand;
    const available = query.available;
    const minPrice = query.minPrice
        ? Number(query.minPrice)
        : undefined;
    const maxPrice = query.maxPrice
        ? Number(query.maxPrice)
        : undefined;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const where = {};
    // Search by title
    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }
    // Filter by category
    if (category) {
        where.category = {
            slug: category,
        };
    }
    // Filter by brand
    if (brand) {
        where.brand = {
            contains: brand,
            mode: "insensitive",
        };
    }
    // Filter by availability
    if (available !== undefined) {
        where.isAvailable = available === "true";
    }
    // Filter by price
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.pricePerDay = {};
        if (minPrice !== undefined) {
            where.pricePerDay.gte = minPrice;
        }
        if (maxPrice !== undefined) {
            where.pricePerDay.lte = maxPrice;
        }
    }
    const [data, total] = await Promise.all([
        prisma_1.default.gearItem.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                category: true,
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        }),
        prisma_1.default.gearItem.count({
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
        data,
    };
};
const getSingleGear = async (id) => {
    const gear = await prisma_1.default.gearItem.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });
    if (!gear) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Gear not found");
    }
    return gear;
};
exports.GearService = {
    createGear,
    updateGear,
    deleteGear,
    getAllGear,
    getSingleGear,
};
