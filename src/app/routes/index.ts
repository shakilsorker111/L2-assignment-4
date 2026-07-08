import { Router } from "express";
import authRoutes from "../modules/auth";
import categoryRoutes from "../modules/category";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running",
  });
});

export default router;