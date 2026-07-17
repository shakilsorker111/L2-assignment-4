"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const getCustomerDashboard = async (customerId, query) => {
    const [totalRentals, activeRentals, completedRentals, cancelledRentals, totalPayments, recentRentals,] = await Promise.all([
        prisma_1.default.rentalOrder.count({
            where: {
                customerId,
            },
        }),
        prisma_1.default.rentalOrder.count({
            where: {
                customerId,
                status: {
                    in: [
                        client_1.RentalStatus.PLACED,
                        client_1.RentalStatus.CONFIRMED,
                        client_1.RentalStatus.PAID,
                        client_1.RentalStatus.PICKED_UP,
                    ],
                },
            },
        }),
        prisma_1.default.rentalOrder.count({
            where: {
                customerId,
                status: client_1.RentalStatus.RETURNED,
            },
        }),
        prisma_1.default.rentalOrder.count({
            where: {
                customerId,
                status: client_1.RentalStatus.CANCELLED,
            },
        }),
        prisma_1.default.payment.aggregate({
            where: {
                rentalOrder: {
                    customerId,
                },
                status: client_1.PaymentStatus.COMPLETED,
            },
            _sum: {
                amount: true,
            },
        }),
        prisma_1.default.rentalOrder.findMany({
            where: {
                customerId,
            },
            include: {
                gearItem: {
                    include: {
                        category: true,
                        provider: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
    ]);
    return {
        summary: {
            totalRentals,
            activeRentals,
            completedRentals,
            cancelledRentals,
            totalPayments: totalPayments._sum.amount ?? 0,
        },
        recentRentals,
    };
};
const getProviderDashboard = async (providerId, query) => {
    const [totalGear, availableGear, totalRentals, revenue, averageRating, recentRentals, recentReviews, topGear, rentalStatus, completedPayments, categories,] = await Promise.all([
        // Summary
        prisma_1.default.gearItem.count({
            where: {
                providerId,
            },
        }),
        prisma_1.default.gearItem.count({
            where: {
                providerId,
                isAvailable: true,
            },
        }),
        prisma_1.default.rentalOrder.count({
            where: {
                providerId,
            },
        }),
        prisma_1.default.payment.aggregate({
            where: {
                rentalOrder: {
                    providerId,
                },
                status: client_1.PaymentStatus.COMPLETED,
            },
            _sum: {
                amount: true,
            },
        }),
        prisma_1.default.review.aggregate({
            where: {
                gearItem: {
                    providerId,
                },
            },
            _avg: {
                rating: true,
            },
        }),
        // Recent Rentals
        prisma_1.default.rentalOrder.findMany({
            where: {
                providerId,
            },
            include: {
                customer: true,
                gearItem: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        // Recent Reviews
        prisma_1.default.review.findMany({
            where: {
                gearItem: {
                    providerId,
                },
            },
            include: {
                customer: true,
                gearItem: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        // Top Rented Gear
        prisma_1.default.rentalOrder.groupBy({
            by: ["gearItemId"],
            where: {
                providerId,
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
            take: 5,
        }),
        // Rental Status
        prisma_1.default.rentalOrder.groupBy({
            by: ["status"],
            where: {
                providerId,
            },
            _count: {
                status: true,
            },
        }),
        // Monthly Revenue
        prisma_1.default.payment.findMany({
            where: {
                rentalOrder: {
                    providerId,
                },
                status: client_1.PaymentStatus.COMPLETED,
            },
            select: {
                amount: true,
                paidAt: true,
            },
        }),
        // Category Statistics
        prisma_1.default.category.findMany({
            include: {
                _count: {
                    select: {
                        gearItems: {
                            where: {
                                providerId,
                            },
                        },
                    },
                },
            },
        }),
    ]);
    // Monthly Revenue
    const monthlyRevenueMap = {};
    completedPayments.forEach((payment) => {
        if (!payment.paidAt)
            return;
        const month = payment.paidAt.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
        });
        monthlyRevenueMap[month] =
            (monthlyRevenueMap[month] || 0) + payment.amount;
    });
    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
        month,
        revenue,
    }));
    // Load Gear Details
    const topRentedGear = await Promise.all(topGear.map(async (item) => {
        const gear = await prisma_1.default.gearItem.findUnique({
            where: {
                id: item.gearItemId,
            },
            include: {
                category: true,
            },
        });
        return {
            gear,
            totalRentals: item._sum.quantity ?? 0,
        };
    }));
    return {
        summary: {
            totalGear,
            availableGear,
            totalRentals,
            revenue: revenue._sum.amount ?? 0,
            averageRating: averageRating._avg.rating ?? 0,
        },
        recentRentals,
        recentReviews,
        analytics: {
            monthlyRevenue,
            rentalStatus: rentalStatus.map((item) => ({
                status: item.status,
                count: item._count.status,
            })),
            topRentedGear,
            categoryStats: categories.map((category) => ({
                category: category.name,
                totalGear: category._count.gearItems,
            })),
        },
    };
};
const getAdminDashboard = async (query) => {
    const [totalUsers, totalCustomers, totalProviders, totalGear, totalRentals, revenue, recentPayments, recentRentals, 
    // Analytics
    completedPayments, rentalStatus, topGear, topRatedGear, categories, users,] = await Promise.all([
        // =========================
        // Dashboard Summary
        // =========================
        prisma_1.default.user.count(),
        prisma_1.default.user.count({
            where: {
                role: client_1.UserRole.CUSTOMER,
            },
        }),
        prisma_1.default.user.count({
            where: {
                role: client_1.UserRole.PROVIDER,
            },
        }),
        prisma_1.default.gearItem.count(),
        prisma_1.default.rentalOrder.count(),
        prisma_1.default.payment.aggregate({
            where: {
                status: client_1.PaymentStatus.COMPLETED,
            },
            _sum: {
                amount: true,
            },
        }),
        // =========================
        // Recent Payments
        // =========================
        prisma_1.default.payment.findMany({
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
                createdAt: "desc",
            },
            take: 5,
        }),
        // =========================
        // Recent Rentals
        // =========================
        prisma_1.default.rentalOrder.findMany({
            include: {
                customer: true,
                provider: true,
                gearItem: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        // =========================
        // Monthly Revenue
        // =========================
        prisma_1.default.payment.findMany({
            where: {
                status: client_1.PaymentStatus.COMPLETED,
            },
            select: {
                amount: true,
                paidAt: true,
            },
        }),
        // =========================
        // Rental Status Distribution
        // =========================
        prisma_1.default.rentalOrder.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        }),
        // =========================
        // Top 5 Rented Gear
        // =========================
        prisma_1.default.rentalOrder.groupBy({
            by: ["gearItemId"],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
            take: 5,
        }),
        // =========================
        // Top Rated Gear
        // =========================
        prisma_1.default.review.groupBy({
            by: ["gearItemId"],
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
            orderBy: {
                _avg: {
                    rating: "desc",
                },
            },
            take: 5,
        }),
        // =========================
        // Category Statistics
        // =========================
        prisma_1.default.category.findMany({
            include: {
                _count: {
                    select: {
                        gearItems: true,
                    },
                },
            },
        }),
        // =========================
        // Monthly User Registrations
        // =========================
        prisma_1.default.user.findMany({
            select: {
                createdAt: true,
            },
        }),
    ]);
    // =========================
    // Monthly Revenue
    // =========================
    const monthlyRevenueMap = {};
    completedPayments.forEach((payment) => {
        if (!payment.paidAt)
            return;
        const month = payment.paidAt.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
        });
        monthlyRevenueMap[month] =
            (monthlyRevenueMap[month] || 0) + payment.amount;
    });
    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
        month,
        revenue,
    }));
    // =========================
    // Monthly Users
    // =========================
    const monthlyUsersMap = {};
    users.forEach((user) => {
        const month = user.createdAt.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
        });
        monthlyUsersMap[month] =
            (monthlyUsersMap[month] || 0) + 1;
    });
    const monthlyUsers = Object.entries(monthlyUsersMap).map(([month, users]) => ({
        month,
        users,
    }));
    // =========================
    // Load Top Rented Gear Details
    // =========================
    const topRentedGear = await Promise.all(topGear.map(async (item) => {
        const gear = await prisma_1.default.gearItem.findUnique({
            where: {
                id: item.gearItemId,
            },
            include: {
                category: true,
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return {
            gear,
            totalRentals: item._sum.quantity ?? 0,
        };
    }));
    // =========================
    // Load Top Rated Gear Details
    // =========================
    const highestRatedGear = await Promise.all(topRatedGear.map(async (item) => {
        const gear = await prisma_1.default.gearItem.findUnique({
            where: {
                id: item.gearItemId,
            },
            include: {
                category: true,
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return {
            gear,
            averageRating: item._avg.rating ?? 0,
            totalReviews: item._count.rating,
        };
    }));
    return {
        summary: {
            totalUsers,
            totalCustomers,
            totalProviders,
            totalGear,
            totalRentals,
            totalRevenue: revenue._sum.amount ?? 0,
        },
        recentPayments,
        recentRentals,
        analytics: {
            // Revenue Analytics
            monthlyRevenue,
            // Rental Status Analytics
            rentalStatus: rentalStatus.map((item) => ({
                status: item.status,
                count: item._count.status,
            })),
            // Most Popular Gear
            topRentedGear,
            // Highest Rated Gear
            topRatedGear: highestRatedGear,
            // Category Statistics
            categoryStats: categories.map((category) => ({
                category: category.name,
                totalGear: category._count.gearItems,
            })),
            // User Registration Analytics
            monthlyUsers,
        },
    };
};
exports.DashboardService = {
    getCustomerDashboard,
    getProviderDashboard,
    getAdminDashboard,
};
