

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

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getMyRentals(
    req.user!.userId,
    req.query
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Rentals retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getProviderOrders(
    req.user!.userId,
    req.query
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateRentalStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RentalService.updateRentalStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Rental status updated successfully",
      data: result,
    });
  }
);



export const RentalController = {
  createRental,
   getMyRentals,
  getProviderOrders,
  updateRentalStatus,
};