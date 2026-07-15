import { Router } from "express";
import { UserRole } from "@prisma/client";

import { DashboardController } from "./dashboard.controller";
import authorize from "../../middlewares/authorize";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get(
  "/customer",
  verifyToken,
  authorize(UserRole.CUSTOMER),
  DashboardController.getCustomerDashboard
);

router.get(
  "/provider",
  verifyToken,
  authorize(UserRole.PROVIDER),
  DashboardController.getProviderDashboard
);

router.get(
  "/admin",
  verifyToken,
  authorize(UserRole.ADMIN),
  DashboardController.getAdminDashboard
);

export default router;