import { Router } from "express";
import authRoutes from "../modules/auth";
import categoryRoutes from "../modules/category";
import gearRoutes from "../modules/gear";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/provider/gear", gearRoutes);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running",
  });
});

export default router;