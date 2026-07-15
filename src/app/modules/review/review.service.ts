import {
  PaymentStatus,
  RentalStatus,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import prisma from "../../config/prisma";

import AppError from "../../errors/AppError";

import { CreateReviewPayload } from "./review.interface";

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

export const ReviewService = {
  createReview,
};