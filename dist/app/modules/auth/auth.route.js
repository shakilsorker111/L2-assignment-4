"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
// console.log("registerSchema:", registerSchema);
// console.log("loginSchema:", loginSchema);
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.registerSchema), auth_controller_1.AuthController.registerUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginSchema), auth_controller_1.AuthController.loginUser);
router.get("/me", auth_1.default, auth_controller_1.AuthController.getMe);
exports.default = router;
