import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { loginSchema, registerSchema } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = Router();

// console.log("registerSchema:", registerSchema);
// console.log("loginSchema:", loginSchema);

router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.loginUser
);

router.get(
  "/me",
  auth,
  AuthController.getMe
);

export default router;