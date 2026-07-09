

import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { CreateRentalPayload } from "./rental.interface";
import AppError from "../../errors/AppError";

const createRental = async (
  payload: CreateRentalPayload,
  customerId: string
) => {
  // Find Gear
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: payload.gearItemId,
    },
  });

  if (!gear) {
    throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
  }

  // Check availability
  if (!gear.isAvailable) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Gear is currently unavailable"
    );
  }

  // Check stock
  if (gear.availableStock < payload.quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Insufficient stock available"
    );
  }

  // Validate rental dates
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (endDate <= startDate) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "End date must be after start date"
    );
  }

  // Calculate rental days
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Price calculation
  const subtotal =
    days * gear.pricePerDay * payload.quantity;

  const serviceFee = subtotal * 0.05;

  const totalPrice = subtotal + serviceFee;

  // Transaction
  const rental = await prisma.$transaction(async (tx) => {
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

    // Update stock
    await tx.gearItem.update({
      where: {
        id: gear.id,
      },
      data: {
        availableStock: {
          decrement: payload.quantity,
        },
      },
    });

    return newRental;
  });

  return rental;
};

export const RentalService = {
  createRental,
};