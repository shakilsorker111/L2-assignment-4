import { Router } from "express";
import { UserRole } from "@prisma/client";

import { ReviewController } from "./review.controller";

import validateRequest from "../../middlewares/validateRequest";
import authorize from "../../middlewares/authorize";

import { createReviewSchema } from "./review.validation";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post(
  "/",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

export default router;