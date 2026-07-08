import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import AppError from "../errors/AppError";
import handlePrismaError from "../errors/handlePrismaError";
import handleZodError from "../errors/handleZodError";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;

  let message = "Something went wrong";

  let errorDetails: any[] = [];

  if (err instanceof ZodError) {
    const simplified = handleZodError(err);

    statusCode = simplified.statusCode;

    message = simplified.message;

    errorDetails = simplified.errorDetails;
  }

  else if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    const simplified = handlePrismaError(err);

    statusCode = simplified.statusCode;

    message = simplified.message;

    errorDetails = simplified.errorDetails;
  }

  else if (err instanceof AppError) {
    statusCode = err.statusCode;

    message = err.message;
  }

  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,

    message,

    errorDetails,

    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default globalErrorHandler;