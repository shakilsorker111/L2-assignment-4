"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../config/prisma"));
const stripe_1 = __importDefault(require("../../config/stripe"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCheckoutSession = async (rentalOrderId, customerId) => {
    const rental = await prisma_1.default.rentalOrder.findUnique({
        where: {
            id: rentalOrderId,
        },
        include: {
            gearItem: true,
            payment: true,
        },
    });
    if (!rental) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rental not found");
    }
    if (rental.customerId !== customerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can only pay for your own rental.");
    }
    if (rental.paymentStatus === client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rental has already been paid.");
    }
    const session = await stripe_1.default.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${config_1.default.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_1.default.client_url}/payment/cancel`,
        metadata: {
            rentalOrderId: rental.id,
            customerId,
        },
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(rental.totalPrice * 100),
                    product_data: {
                        name: rental.gearItem.title,
                        description: `${rental.days} day rental`,
                    },
                },
            },
        ],
    });
    return {
        checkoutUrl: session.url,
        sessionId: session.id,
    };
};
const handleWebhook = async (event) => {
    console.log("Handling event:", event.type);
    if (event.type !== "checkout.session.completed") {
        return;
    }
    const session = event.data.object;
    const rentalOrderId = session.metadata?.rentalOrderId;
    if (!rentalOrderId) {
        throw new Error("Missing rentalOrderId");
    }
    await prisma_1.default.$transaction(async (tx) => {
        const rental = await tx.rentalOrder.findUnique({
            where: {
                id: rentalOrderId,
            },
            include: {
                payment: true,
            },
        });
        if (!rental) {
            throw new Error("Rental not found");
        }
        // Prevent duplicate processing
        if (rental.paymentStatus === client_1.PaymentStatus.COMPLETED) {
            return;
        }
        if (rental.payment) {
            await tx.payment.update({
                where: {
                    id: rental.payment.id,
                },
                data: {
                    transactionId: session.payment_intent?.toString() ??
                        rental.payment.transactionId,
                    provider: client_1.PaymentProvider.STRIPE,
                    status: client_1.PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                },
            });
        }
        else {
            await tx.payment.create({
                data: {
                    rentalOrderId: rental.id,
                    transactionId: session.payment_intent?.toString() ??
                        session.id,
                    amount: rental.totalPrice,
                    provider: client_1.PaymentProvider.STRIPE,
                    status: client_1.PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                },
            });
        }
        await tx.rentalOrder.update({
            where: {
                id: rental.id,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.COMPLETED,
                status: client_1.RentalStatus.PAID,
            },
        });
    });
};
const getMyPayments = async (customerId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        rentalOrder: {
            customerId,
        },
        ...(query.status && {
            status: query.status,
        }),
    };
    const payments = await prisma_1.default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
            rentalOrder: {
                include: {
                    gearItem: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: query.sortOrder ?? "desc",
        },
    });
    const total = await prisma_1.default.payment.count({ where });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: payments,
    };
};
const getProviderPayments = async (providerId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        rentalOrder: {
            providerId,
        },
        ...(query.status && {
            status: query.status,
        }),
    };
    const payments = await prisma_1.default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
            rentalOrder: {
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
            },
        },
        orderBy: {
            createdAt: query.sortOrder ?? "desc",
        },
    });
    const total = await prisma_1.default.payment.count({ where });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: payments,
    };
};
const getAllPayments = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        ...(query.status && {
            status: query.status,
        }),
    };
    const payments = await prisma_1.default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
            rentalOrder: {
                include: {
                    customer: true,
                    provider: true,
                    gearItem: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: query.sortOrder ?? "desc",
        },
    });
    const total = await prisma_1.default.payment.count({ where });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: payments,
    };
};
const getPaymentById = async (paymentId, user) => {
    const payment = await prisma_1.default.payment.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            rentalOrder: {
                include: {
                    customer: true,
                    provider: true,
                    gearItem: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Payment not found");
    }
    if (user.role !== client_1.UserRole.ADMIN &&
        payment.rentalOrder.customerId !== user.userId &&
        payment.rentalOrder.providerId !== user.userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized");
    }
    return payment;
};
exports.PaymentService = {
    createCheckoutSession,
    handleWebhook,
    getMyPayments,
    getProviderPayments,
    getAllPayments,
    getPaymentById,
};
