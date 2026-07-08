import { Response } from "express";

type TResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: unknown;
};

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: TResponse<T>
) => {
  res.status(statusCode).json(payload);
};

export default sendResponse;