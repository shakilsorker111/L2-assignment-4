import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API Running Successfully",
  });
});

export default router;