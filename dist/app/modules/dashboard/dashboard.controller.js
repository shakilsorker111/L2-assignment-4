"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const dashboard_service_1 = require("./dashboard.service");
const getCustomerDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardService.getCustomerDashboard(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Customer dashboard retrieved successfully",
        data: result,
    });
});
const getProviderDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardService.getProviderDashboard(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Provider dashboard retrieved successfully",
        data: result,
    });
});
const getAdminDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardService.getAdminDashboard(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Admin dashboard retrieved successfully",
        data: result,
    });
});
exports.DashboardController = {
    getCustomerDashboard,
    getProviderDashboard,
    getAdminDashboard,
};
