import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AppError from "../errors/AppError";

const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized")
      );
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError(StatusCodes.FORBIDDEN, "Forbidden")
      );
    }

    next();
  };

export default authorize;