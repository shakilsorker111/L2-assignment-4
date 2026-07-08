import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query);

  sendResponse(res, StatusCodes.OK, {
  success: true,
  message: "Categories retrieved successfully",
  meta: result.meta,
  data: result.data,
});
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getSingleCategory(req.params.id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(
    req.params.id as string,
    req.body
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};