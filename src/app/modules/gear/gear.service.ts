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


const getAllGear = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search as string | undefined;
  const category = query.category as string | undefined;
  const brand = query.brand as string | undefined;
  const available = query.available as string | undefined;

  const minPrice = query.minPrice
    ? Number(query.minPrice)
    : undefined;

  const maxPrice = query.maxPrice
    ? Number(query.maxPrice)
    : undefined;

  const sortBy = (query.sortBy as string) || "createdAt";
  const sortOrder =
    (query.sortOrder as "asc" | "desc") || "desc";

  const where: any = {};

  // Search by title
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter by category
  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Filter by brand
  if (brand) {
    where.brand = {
      contains: brand,
      mode: "insensitive",
    };
  }

  // Filter by availability
  if (available !== undefined) {
    where.isAvailable = available === "true";
  }

  // Filter by price
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerDay = {};

    if (minPrice !== undefined) {
      where.pricePerDay.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.pricePerDay.lte = maxPrice;
    }
  }

  const [data, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),

    prisma.gearItem.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },

    data,
  };
};


const getSingleGear = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  return gear;
};


export const GearService = {
  createGear,
  updateGear,
  deleteGear,
  getAllGear,
  getSingleGear,
};