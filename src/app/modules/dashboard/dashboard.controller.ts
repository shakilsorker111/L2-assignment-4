import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { DashboardService } from "./dashboard.service";
import { DashboardQuery } from "./dashboard.interface";

const getCustomerDashboard = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await DashboardService.getCustomerDashboard(
        req.user!.userId,
        req.query as DashboardQuery
      );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Customer dashboard retrieved successfully",
      data: result,
    });
  }
);

const getProviderDashboard = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await DashboardService.getProviderDashboard(
        req.user!.userId,
        req.query as DashboardQuery
      );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Provider dashboard retrieved successfully",
      data: result,
    });
  }
);

const getAdminDashboard = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await DashboardService.getAdminDashboard(
        req.query as DashboardQuery
      );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Admin dashboard retrieved successfully",
      data: result,
    });
  }
);

export const DashboardController = {
  getCustomerDashboard,
  getProviderDashboard,
  getAdminDashboard,
};