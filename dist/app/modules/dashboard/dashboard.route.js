"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const dashboard_controller_1 = require("./dashboard.controller");
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.get("/customer", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), dashboard_controller_1.DashboardController.getCustomerDashboard);
router.get("/provider", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), dashboard_controller_1.DashboardController.getProviderDashboard);
router.get("/admin", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.ADMIN), dashboard_controller_1.DashboardController.getAdminDashboard);
exports.default = router;
