import { Router } from "express";
import authRoutes from "../modules/auth";
import categoryRoutes from "../modules/category";
import gearRoutes from "../modules/gear";
import rentalRoutes from "../modules/rental";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/gear", gearRoutes);
router.use("/provider/gear", gearRoutes);
router.use("/rentals", rentalRoutes);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running",
  });
});

export default router;