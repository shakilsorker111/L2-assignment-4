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

export const GearController = {
  createGear,
  updateGear,
  deleteGear,
};