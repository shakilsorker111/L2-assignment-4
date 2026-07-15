import {
  PaymentStatus,
  RentalStatus,
  UserRole,
} from "@prisma/client";

import prisma from "../../config/prisma";


const getCustomerDashboard = async (
  customerId: string
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
        gearItem: true,
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
  providerId: string
) => {
  const [
    totalGear,
    availableGear,
    totalRentals,
    revenue,
    recentRentals,
    recentReviews,
  ] = await Promise.all([
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

    prisma.rentalOrder.findMany({
      where: {
        providerId,
      },
      include: {
        customer: true,
        gearItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.review.findMany({
      where: {
        gearItem: {
          providerId,
        },
      },
      include: {
        customer: true,
        gearItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    summary: {
      totalGear,
      availableGear,
      totalRentals,
      revenue:
        revenue._sum.amount ?? 0,
    },
    recentRentals,
    recentReviews,
  };
};

const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    totalGear,
    totalRentals,
    revenue,
    recentPayments,
    recentRentals,
  ] = await Promise.all([
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

    prisma.payment.findMany({
      include: {
        rentalOrder: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.rentalOrder.findMany({
      include: {
        customer: true,
        provider: true,
        gearItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    summary: {
      totalUsers,
      totalCustomers,
      totalProviders,
      totalGear,
      totalRentals,
      totalRevenue:
        revenue._sum.amount ?? 0,
    },
    recentPayments,
    recentRentals,
  };
};


export const DashboardService = {
  getCustomerDashboard,
  getProviderDashboard,
  getAdminDashboard,
};