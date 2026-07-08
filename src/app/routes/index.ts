import { Router } from "express";
import authRoutes from "../modules/auth";

const router = Router();

router.use("/auth", authRoutes);

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running",
  });
});

export default router;