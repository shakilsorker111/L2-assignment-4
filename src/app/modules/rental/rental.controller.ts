

import { Request, Response } from "express";
import { RentalService } from "./rental.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.userId;

  const result = await RentalService.createRental(
    req.body,
    customerId
  );

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Rental created successfully",
    data: result,
  });
});

export const RentalController = {
  createRental,
};