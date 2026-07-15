import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ReviewService } from "./review.service";

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

export const ReviewController = {
  createReview,
};