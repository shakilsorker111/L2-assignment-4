import { Router } from "express";
import { UserRole } from "@prisma/client";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";

import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.get(
  "/",
  CategoryController.getAllCategories
);

router.get(
  "/:id",
  CategoryController.getSingleCategory
);

router.post(
  "/",
  auth,
  authorize(UserRole.ADMIN),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  CategoryController.deleteCategory
);

export default router;