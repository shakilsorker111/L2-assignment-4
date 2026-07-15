import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { PaymentService } from "./payment.service";
import Stripe from "stripe";
import stripe from "../../config/stripe";
import config from "../../config";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.createCheckoutSession(
      req.body.rentalOrderId,
      req.user!.userId
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  }
);

const webhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret!
    );
  } catch (error) {
    return res.status(400).send("Webhook Error");
  }

  await PaymentService.handleWebhook(event);

  res.json({
    received: true,
  });
};

const getMyPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.getMyPayments(
      req.user!.userId,
      req.query
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Payments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getProviderPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.getProviderPayments(
      req.user!.userId,
      req.query
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Payments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPayments(req.query);

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Payments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.getPaymentById(
      req.params.id as string,
      req.user!
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  createCheckoutSession,
  webhook,
   getMyPayments,
  getProviderPayments,
  getAllPayments,
  getPaymentById,
};