"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_1 = require("@prisma/client");
const allowedTransitions = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PAID", "CANCELLED"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
};
const createRental = async (payload, customerId) => {
    // Find Gear
    const gear = await prisma_1.default.gearItem.findUnique({
        where: {
            id: payload.gearItemId,
        },
    });
    if (!gear) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Gear not found");
    }
    // Check availability
    if (!gear.isAvailable) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Gear is currently unavailable");
    }
    // Check stock
    if (gear.availableStock < payload.quantity) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient stock available");
    }
    // Validate rental dates
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    if (endDate <= startDate) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "End date must be after start date");
    }
    // Calculate rental days
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24));
    // Price calculation
    const subtotal = days * gear.pricePerDay * payload.quantity;
    const serviceFee = subtotal * 0.05;
    const totalPrice = subtotal + serviceFee;
    // Transaction
    const rental = await prisma_1.default.$transaction(async (tx) => {
        // Create Rental
        const newRental = await tx.rentalOrder.create({
            data: {
                customerId,
                providerId: gear.providerId,
                gearItemId: gear.id,
                quantity: payload.quantity,
                startDate,
                endDate,
                days,
                pricePerDay: gear.pricePerDay,
                subtotal,
                serviceFee,
                totalPrice,
            },
        });
        // Update available stock
        const updatedGear = await tx.gearItem.update({
            where: {
                id: gear.id,
            },
            data: {
                availableStock: {
                    decrement: payload.quantity,
                },
            },
        });
        if (updatedGear.availableStock === 0) {
            await tx.gearItem.update({
                where: {
                    id: gear.id,
                },
                data: {
                    isAvailable: false,
                },
            });
        }
        return newRental;
    });
    return rental;
};
const getMyRentals = async (customerId, query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 10);
    const skip = (page - 1) * limit;
    const status = query.status;
    const where = {
        customerId,
    };
    if (status) {
        where.status = status;
    }
    const [data, total] = await Promise.all([
        prisma_1.default.rentalOrder.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                gearItem: true,
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma_1.default.rentalOrder.count({
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
const getProviderOrders = async (providerId, query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 10);
    const skip = (page - 1) * limit;
    const status = query.status;
    const where = {
        providerId,
    };
    if (status) {
        where.status = status;
    }
    const [data, total] = await Promise.all([
        prisma_1.default.rentalOrder.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                gearItem: true,
            },
        }),
        prisma_1.default.rentalOrder.count({
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
const updateRentalStatus = async (rentalId, providerId, status) => {
    const rental = await prisma_1.default.rentalOrder.findUnique({
        where: {
            id: rentalId,
        },
        include: {
            gearItem: true,
        },
    });
    if (!rental) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rental not found");
    }
    if (rental.providerId !== providerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can only manage your own rentals");
    }
    const allowed = allowedTransitions[rental.status];
    if (!allowed.includes(status)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Cannot change status from ${rental.status} to ${status}`);
    }
    return prisma_1.default.$transaction(async (tx) => {
        const updatedRental = await tx.rentalOrder.update({
            where: {
                id: rentalId,
            },
            data: {
                status,
            },
        });
        if (status === client_1.RentalStatus.CANCELLED ||
            status === client_1.RentalStatus.RETURNED) {
            const updatedGear = await tx.gearItem.update({
                where: {
                    id: rental.gearItemId,
                },
                data: {
                    availableStock: {
                        increment: rental.quantity,
                    },
                },
            });
            if (updatedGear.availableStock > 0 &&
                !updatedGear.isAvailable) {
                await tx.gearItem.update({
                    where: {
                        id: rental.gearItemId,
                    },
                    data: {
                        isAvailable: true,
                    },
                });
            }
        }
        return updatedRental;
    });
};
exports.RentalService = {
    createRental,
    getMyRentals,
    getProviderOrders,
    updateRentalStatus,
};
