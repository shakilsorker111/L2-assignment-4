import { Router } from "express";
import prisma from "../config/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Database Connected Successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Database Connection Failed",
    });
  }
});

export default router;