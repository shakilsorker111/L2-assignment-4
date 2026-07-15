import {
  PaymentStatus,
  RentalStatus,
  UserRole,
} from "@prisma/client";

import prisma from "../../config/prisma";
import { DashboardQuery } from "./dashboard.interface";

const getCustomerDashboard = async (
  customerId: string,
  query: DashboardQuery
) => {
  const [
    totalRentals,
    activeRentals,
    completedRentals,
    cancelledRentals,
    totalPayments,
    recentRentals,
  ] = await Promise.all([
    prisma.rentalOrder.count({
      where: {
        customerId,
      },
    }),

    prisma.rentalOrder.count({
      where: {
        customerId,
        status: {
          in: [
            RentalStatus.PLACED,
            RentalStatus.CONFIRMED,
            RentalStatus.PAID,
            RentalStatus.PICKED_UP,
          ],
        },
      },
    }),

    prisma.rentalOrder.count({
      where: {
        customerId,
        status: RentalStatus.RETURNED,
      },
    }),

    prisma.rentalOrder.count({
      where: {
        customerId,
        status: RentalStatus.CANCELLED,
      },
    }),

    prisma.payment.aggregate({
      where: {
        rentalOrder: {
          customerId,
        },
        status: PaymentStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.rentalOrder.findMany({
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
      totalPayments:
        totalPayments._sum.amount ?? 0,
    },

    recentRentals,
  };
};

const getProviderDashboard = async (
  providerId: string,
  query: DashboardQuery
) => {
  const [
    totalGear,
    availableGear,
    totalRentals,
    revenue,
    averageRating,
    recentRentals,
    recentReviews,
    topGear,
    rentalStatus,
    completedPayments,
    categories,
  ] = await Promise.all([
    // Summary
    prisma.gearItem.count({
      where: {
        providerId,
      },
    }),

    prisma.gearItem.count({
      where: {
        providerId,
        isAvailable: true,
      },
    }),

    prisma.rentalOrder.count({
      where: {
        providerId,
      },
    }),

    prisma.payment.aggregate({
      where: {
        rentalOrder: {
          providerId,
        },
        status: PaymentStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.review.aggregate({
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
    prisma.rentalOrder.findMany({
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
    prisma.review.findMany({
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
    prisma.rentalOrder.groupBy({
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
    prisma.rentalOrder.groupBy({
      by: ["status"],
      where: {
        providerId,
      },
      _count: {
        status: true,
      },
    }),

    // Monthly Revenue
    prisma.payment.findMany({
      where: {
        rentalOrder: {
          providerId,
        },
        status: PaymentStatus.COMPLETED,
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),

    // Category Statistics
    prisma.category.findMany({
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
  const monthlyRevenueMap: Record<string, number> = {};

  completedPayments.forEach((payment) => {
    if (!payment.paidAt) return;

    const month = payment.paidAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    monthlyRevenueMap[month] =
      (monthlyRevenueMap[month] || 0) + payment.amount;
  });

  const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  // Load Gear Details
  const topRentedGear = await Promise.all(
    topGear.map(async (item) => {
      const gear = await prisma.gearItem.findUnique({
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
    })
  );

  return {
    summary: {
      totalGear,
      availableGear,
      totalRentals,
      revenue: revenue._sum.amount ?? 0,
      averageRating:
        averageRating._avg.rating ?? 0,
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

const getAdminDashboard = async (
    query: DashboardQuery
) => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    totalGear,
    totalRentals,
    revenue,
    recentPayments,
    recentRentals,

    // Analytics
    completedPayments,
    rentalStatus,
    topGear,
    topRatedGear,
    categories,
    users,
  ] = await Promise.all([
    // =========================
    // Dashboard Summary
    // =========================
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: UserRole.CUSTOMER,
      },
    }),

    prisma.user.count({
      where: {
        role: UserRole.PROVIDER,
      },
    }),

    prisma.gearItem.count(),

    prisma.rentalOrder.count(),

    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    }),

    // =========================
    // Recent Payments
    // =========================
    prisma.payment.findMany({
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
    prisma.rentalOrder.findMany({
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
    prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),

    // =========================
    // Rental Status Distribution
    // =========================
    prisma.rentalOrder.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),

    // =========================
    // Top 5 Rented Gear
    // =========================
    prisma.rentalOrder.groupBy({
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
    prisma.review.groupBy({
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
    prisma.category.findMany({
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
    prisma.user.findMany({
      select: {
        createdAt: true,
      },
    }),
  ]);

  // =========================
  // Monthly Revenue
  // =========================
  const monthlyRevenueMap: Record<string, number> = {};

  completedPayments.forEach((payment) => {
    if (!payment.paidAt) return;

    const month = payment.paidAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    monthlyRevenueMap[month] =
      (monthlyRevenueMap[month] || 0) + payment.amount;
  });

  const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  // =========================
  // Monthly Users
  // =========================
  const monthlyUsersMap: Record<string, number> = {};

  users.forEach((user) => {
    const month = user.createdAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    monthlyUsersMap[month] =
      (monthlyUsersMap[month] || 0) + 1;
  });

  const monthlyUsers = Object.entries(monthlyUsersMap).map(
    ([month, users]) => ({
      month,
      users,
    })
  );

    // =========================
  // Load Top Rented Gear Details
  // =========================
  const topRentedGear = await Promise.all(
    topGear.map(async (item) => {
      const gear = await prisma.gearItem.findUnique({
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
    })
  );

  // =========================
  // Load Top Rated Gear Details
  // =========================
  const highestRatedGear = await Promise.all(
    topRatedGear.map(async (item) => {
      const gear = await prisma.gearItem.findUnique({
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
    })
  );

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

export const DashboardService = {
  getCustomerDashboard,
  getProviderDashboard,
  getAdminDashboard,
};