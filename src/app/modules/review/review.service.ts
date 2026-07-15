import {
  PaymentStatus,
  RentalStatus,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import prisma from "../../config/prisma";

import AppError from "../../errors/AppError";

import { CreateReviewPayload, ReviewQuery, UpdateReviewPayload } from "./review.interface";

const createReview = async (
  customerId: string,
  payload: CreateReviewPayload
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: payload.rentalOrderId,
    },
    include: {
      review: true,
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
      "Unauthorized"
    );
  }

  if (rental.status !== RentalStatus.RETURNED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Rental has not been returned yet."
    );
  }

  if (
    rental.paymentStatus !==
    PaymentStatus.COMPLETED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Payment not completed."
    );
  }

  if (rental.review) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Review already submitted."
    );
  }

  if (rental.gearItemId !== payload.gearItemId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Gear does not match rental."
    );
  }

  return prisma.review.create({
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

const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: UpdateReviewPayload
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  if (review.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only update your own review."
    );
  }

  return prisma.review.update({
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

const deleteReview = async (
  reviewId: string,
  customerId: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  if (review.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only delete your own review."
    );
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return null;
};

const getReviewsByGear = async (
  gearItemId: string,
  query: ReviewQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await prisma.review.findMany({
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

  const total = await prisma.review.count({
    where: {
      gearItemId,
    },
  });

  const aggregate = await prisma.review.aggregate({
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

const getProviderReviews = async (
  providerId: string,
  query: ReviewQuery
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await prisma.review.findMany({
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

  const total = await prisma.review.count({
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

export const ReviewService = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByGear,
  getProviderReviews,
};