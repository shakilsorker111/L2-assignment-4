import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ReviewService } from "./review.service";
import { ReviewQuery } from "./review.interface";

const createReview = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await ReviewService.createReview(
        req.user!.userId,
        req.body
      );

    sendResponse(res, StatusCodes.CREATED, {
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.params.id as string,
    req.user!.userId,
    req.body
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview(
    req.params.id as string,
    req.user!.userId
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

const getReviewsByGear = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewsByGear(
    req.params.gearId as string,
    req.query as ReviewQuery
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: {
      averageRating: result.averageRating,
      totalRatings: result.totalRatings,
      reviews: result.data,
    },
  });
});

const getProviderReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getProviderReviews(
    req.user!.userId,
    req.query as ReviewQuery
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Provider reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  createReview,
   updateReview,
  deleteReview,
  getReviewsByGear,
  getProviderReviews,
};