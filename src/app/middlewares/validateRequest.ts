import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
    });

    if (!result.success) {
      return next(result.error);
    }

    req.body = (result.data as { body: unknown }).body;

    next();
  };

export default validateRequest;