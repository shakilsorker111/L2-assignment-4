import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { ICategory } from "./category.interface";
import { Prisma } from "@prisma/client";

const createCategory = async (payload: ICategory) => {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name: payload.name },
        { slug: payload.slug },
      ],
    },
  });

  if (existing) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Category already exists"
    );
  }

  return prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async (query: any) => {
  const search = (query.search as string) || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.CategoryWhereInput = {
  OR: [
    {
      name: {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    {
      slug: {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      },
    },
  ],
};
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.count({
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
    data: categories,
  };
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
) => {

  return prisma.category.update({

    where: {

      id,

    },

    data: payload,

  });

};

const deleteCategory = async (
  id: string
) => {

  return prisma.category.delete({

    where: {

      id,

    },

  });

};

export const CategoryService = {

  createCategory,

  getAllCategories,

  getSingleCategory,

  updateCategory,

  deleteCategory,

};