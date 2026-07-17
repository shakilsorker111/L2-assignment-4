"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createReview = async (customerId, payload) => {
    const rental = await prisma_1.default.rentalOrder.findUnique({
        where: {
            id: payload.rentalOrderId,
        },
        include: {
            review: true,
        },
    });
    if (!rental) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rental not found");
    }
    if (rental.customerId !== customerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized");
    }
    if (rental.status !== client_1.RentalStatus.RETURNED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rental has not been returned yet.");
    }
    if (rental.paymentStatus !==
        client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment not completed.");
    }
    if (rental.review) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Review already submitted.");
    }
    if (rental.gearItemId !== payload.gearItemId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Gear does not match rental.");
    }
    return prisma_1.default.review.create({
        data: {
            customerId,
            gearItemId: payload.gearItemId,
            rentalOrderId: payload.rentalOrderId,
            rating: payload.rating,
            comment: payload.comment,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            gearItem: true,
        },
    });
};
const updateReview = async (reviewId, customerId, payload) => {
    const review = await prisma_1.default.review.findUnique({
        where: {
            id: reviewId,
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Review not found");
    }
    if (review.customerId !== customerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can only update your own review.");
    }
    return prisma_1.default.review.update({
        where: {
            id: reviewId,
        },
        data: payload,
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            gearItem: true,
        },
    });
};
const deleteReview = async (reviewId, customerId) => {
    const review = await prisma_1.default.review.findUnique({
        where: {
            id: reviewId,
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Review not found");
    }
    if (review.customerId !== customerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can only delete your own review.");
    }
    await prisma_1.default.review.delete({
        where: {
            id: reviewId,
        },
    });
    return null;
};
const getReviewsByGear = async (gearItemId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const reviews = await prisma_1.default.review.findMany({
        where: {
            gearItemId,
        },
        skip,
        take: limit,
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            createdAt: query.sortOrder ?? "desc",
        },
    });
    const total = await prisma_1.default.review.count({
        where: {
            gearItemId,
        },
    });
    const aggregate = await prisma_1.default.review.aggregate({
        where: {
            gearItemId,
        },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        averageRating: aggregate._avg.rating ?? 0,
        totalRatings: aggregate._count.rating,
        data: reviews,
    };
};
const getProviderReviews = async (providerId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const reviews = await prisma_1.default.review.findMany({
        where: {
            gearItem: {
                providerId,
            },
        },
        skip,
        take: limit,
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            gearItem: {
                select: {
                    id: true,
                    title: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: query.sortOrder ?? "desc",
        },
    });
    const total = await prisma_1.default.review.count({
        where: {
            gearItem: {
                providerId,
            },
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: reviews,
    };
};
exports.ReviewService = {
    createReview,
    updateReview,
    deleteReview,
    getReviewsByGear,
    getProviderReviews,
};
