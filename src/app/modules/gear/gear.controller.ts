import { GearService } from "./gear.service";
import { StatusCodes } from "http-status-codes";

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


const createGear = catchAsync(async (req: Request, res: Response) => {
    // console.log("request user", req.user)


  const providerId = req.user!.userId;
//   console.log("provider id:", providerId)

  const result = await GearService.createGear(req.body, providerId);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Gear created successfully",
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.userId;

  const result = await GearService.updateGear(
    req.params.id as string,
    req.body,
    providerId
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.userId;

  await GearService.deleteGear(req.params.id as string, providerId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Gear deleted successfully",
    data: null,
  });
});


const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getAllGear(req.query);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Gear retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getSingleGear(
    req.params.id as string
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Gear retrieved successfully",
    data: result,
  });
});

export const GearController = {
  createGear,
  updateGear,
  deleteGear,
  getAllGear,
  getSingleGear,
};