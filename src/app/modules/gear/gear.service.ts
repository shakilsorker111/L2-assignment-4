import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { TCreateGear, TUpdateGear } from "./gear.interface";




const createGear = async (
  payload: TCreateGear,
  providerId: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  const gear = await prisma.gearItem.create({
    data: {
      ...payload,

      providerId,

      availableStock: payload.stock,

      isAvailable: payload.stock > 0,
    },
  });

  return gear;
};


const updateGear = async (
  id: string,
  payload: TUpdateGear,
  providerId: string
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can update only your own gear"
    );
  }

  const updatedGear = await prisma.gearItem.update({
    where: {
      id,
    },
    data: {
      ...payload,

      ...(payload.stock !== undefined && {
        availableStock: payload.stock,
        isAvailable: payload.stock > 0,
      }),
    },
  });

  return updatedGear;
};


const deleteGear = async (
  id: string,
  providerId: string
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can delete only your own gear"
    );
  }

  await prisma.gearItem.delete({
    where: {
      id,
    },
  });

  return null;
};


export const GearService = {
  createGear,
  updateGear,
  deleteGear,
};