
import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { createRentalSchema } from "./rental.validation";
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

export default router;