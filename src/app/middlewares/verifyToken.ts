
import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { verifyToken as verifyJwt } from "../utils/jwt";
import { StatusCodes } from "http-status-codes";

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized"
    );
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized"
    );
  }

  const decoded = verifyJwt(token);

  req.user = decoded;

  next();
};

export default verifyToken;