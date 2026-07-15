
import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { createCheckoutSchema } from "./payment.validation";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-checkout-session",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  validateRequest(createCheckoutSchema),
  PaymentController.createCheckoutSession
);

router.post(
  "/webhook",
  PaymentController.webhook
);

export default router;