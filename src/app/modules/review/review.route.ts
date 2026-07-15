import { Router } from "express";
import { UserRole } from "@prisma/client";

import { ReviewController } from "./review.controller";

import validateRequest from "../../middlewares/validateRequest";
import authorize from "../../middlewares/authorize";

import { createReviewSchema, updateReviewSchema } from "./review.validation";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post(
  "/",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

router.patch(
  "/:id",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  validateRequest(updateReviewSchema),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  ReviewController.deleteReview
);

router.get(
  "/gear/:gearId",
  ReviewController.getReviewsByGear
);

router.get(
  "/provider",
  verifyToken,
  authorize(UserRole.PROVIDER),
  ReviewController.getProviderReviews
);

export default router;