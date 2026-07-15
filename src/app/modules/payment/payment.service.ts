import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
  UserRole,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import prisma from "../../config/prisma";
import stripe from "../../config/stripe";
import config from "../../config";

import AppError from "../../errors/AppError";
import Stripe from "stripe";
import { PaymentQuery } from "./payment.interface";
import { JwtPayload } from "jsonwebtoken";

const createCheckoutSession = async (
  rentalOrderId: string,
  customerId: string
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      gearItem: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Rental not found"
    );
  }

  if (rental.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only pay for your own rental."
    );
  }

  if (rental.paymentStatus === PaymentStatus.COMPLETED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Rental has already been paid."
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.client_url}/payment/cancel`,

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

const handleWebhook = async (event: Stripe.Event) => {
    console.log("Handling event:", event.type);
  if (event.type !== "checkout.session.completed") {
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    throw new Error("Missing rentalOrderId");
  }

  await prisma.$transaction(async (tx) => {
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
    if (rental.paymentStatus === PaymentStatus.COMPLETED) {
      return;
    }

    if (rental.payment) {
      await tx.payment.update({
        where: {
          id: rental.payment.id,
        },
        data: {
          transactionId:
            session.payment_intent?.toString() ??
            rental.payment.transactionId,

          provider: PaymentProvider.STRIPE,

          status: PaymentStatus.COMPLETED,

          paidAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          rentalOrderId: rental.id,

          transactionId:
            session.payment_intent?.toString() ??
            session.id,

          amount: rental.totalPrice,

          provider: PaymentProvider.STRIPE,

          status: PaymentStatus.COMPLETED,

          paidAt: new Date(),
        },
      });
    }

    await tx.rentalOrder.update({
      where: {
        id: rental.id,
      },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        status: RentalStatus.PAID,
      },
    });
  });
};

const getMyPayments = async (
  customerId: string,
  query: PaymentQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    rentalOrder: {
      customerId,
    },
    ...(query.status && {
      status: query.status as PaymentStatus,
    }),
  };

  const payments = await prisma.payment.findMany({
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

  const total = await prisma.payment.count({ where });

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

const getProviderPayments = async (
  providerId: string,
  query: PaymentQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    rentalOrder: {
      providerId,
    },
    ...(query.status && {
      status: query.status as PaymentStatus,
    }),
  };

  const payments = await prisma.payment.findMany({
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

  const total = await prisma.payment.count({ where });

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

const getAllPayments = async (
  query: PaymentQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(query.status && {
      status: query.status as PaymentStatus,
    }),
  };

  const payments = await prisma.payment.findMany({
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

  const total = await prisma.payment.count({ where });

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

const getPaymentById = async (
  paymentId: string,
  user: JwtPayload
) => {
  const payment = await prisma.payment.findUnique({
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
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment not found"
    );
  }

  if (
    user.role !== UserRole.ADMIN &&
    payment.rentalOrder.customerId !== user.userId &&
    payment.rentalOrder.providerId !== user.userId
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Unauthorized"
    );
  }

  return payment;
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getProviderPayments,
  getAllPayments,
  getPaymentById,
};