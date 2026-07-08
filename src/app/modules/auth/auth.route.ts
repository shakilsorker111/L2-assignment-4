import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerSchema } from "./auth.validation";

const router = Router();

console.log("validateRequest:", typeof validateRequest);
console.log("registerUser:", typeof AuthController.registerUser);

router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.registerUser
);

export default router;