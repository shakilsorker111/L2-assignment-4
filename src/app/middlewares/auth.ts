import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import AppError from "../errors/AppError";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new AppError(
        StatusCodes.UNAUTHORIZED,
        "You are not authorized."
      )
    );
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : authorization;

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch {
    next(
      new AppError(
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired token."
      )
    );
  }
};

export default auth;