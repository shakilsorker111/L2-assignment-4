import { Router } from "express";
import { UserRole } from "@prisma/client";
import { createGearSchema, updateGearSchema } from "./gear.validation";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { GearController } from "./gear.controller";
import verifyToken from "../../middlewares/verifyToken";


const router = Router();


router.get("/", GearController.getAllGear);

router.get("/:id", GearController.getSingleGear);

router.post(
  "/",
  verifyToken,
  authorize(UserRole.PROVIDER),
  validateRequest(createGearSchema),
  GearController.createGear
);

router.patch(
  "/:id",
  verifyToken,
  authorize(UserRole.PROVIDER),
  validateRequest(updateGearSchema),
  GearController.updateGear
);

router.delete(
  "/:id",
  verifyToken,
  authorize(UserRole.PROVIDER),
  GearController.deleteGear
);

export default router;