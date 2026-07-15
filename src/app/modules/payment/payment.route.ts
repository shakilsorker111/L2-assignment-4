
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

router.get(
  "/my-payments",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  PaymentController.getMyPayments
);

router.get(
  "/provider-payments",
  verifyToken,
  authorize(UserRole.PROVIDER),
  PaymentController.getProviderPayments
);

router.get(
  "/",
  verifyToken,
  authorize(UserRole.ADMIN),
  PaymentController.getAllPayments
);

router.get(
  "/:id",
  verifyToken,
  PaymentController.getPaymentById
);

export default router;