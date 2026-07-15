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

export const PaymentController = {
  createCheckoutSession,
  webhook,
};