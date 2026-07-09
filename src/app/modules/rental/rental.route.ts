
import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { createRentalSchema, updateRentalStatusSchema } from "./rental.validation";
import validateRequest from "../../middlewares/validateRequest";
import { RentalController } from "./rental.controller";

const router = Router();

router.post(
  "/",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  validateRequest(createRentalSchema),
  RentalController.createRental
);

router.get(
  "/my-rentals",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  RentalController.getMyRentals
);

router.get(
  "/provider-orders",
  verifyToken,
  authorize(UserRole.PROVIDER),
  RentalController.getProviderOrders
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize(UserRole.PROVIDER),
  validateRequest(updateRentalStatusSchema),
  RentalController.updateRentalStatus
);

export default router;