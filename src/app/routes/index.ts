import { Router } from "express";
import authRoutes from "../modules/auth";
import categoryRoutes from "../modules/category";
import gearRoutes from "../modules/gear";
import rentalRoutes from "../modules/rental";
import paymentRoutes from "../modules/payment";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/gear", gearRoutes);
router.use("/provider/gear", gearRoutes);
router.use("/rentals", rentalRoutes);
router.use("/payments", paymentRoutes);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running",
  });
});

export default router;