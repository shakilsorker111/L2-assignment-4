import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, httpStatus.StatusCodes.CREATED, {
    success: true,
    message: "User registered successfully",
    data: result,
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
};