"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
const rental_service_1 = require("./rental.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createRental = (0, catchAsync_1.default)(async (req, res) => {
    const customerId = req.user.userId;
    const result = await rental_service_1.RentalService.createRental(req.body, customerId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Rental created successfully",
        data: result,
    });
});
const getMyRentals = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rental_service_1.RentalService.getMyRentals(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Rentals retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getProviderOrders = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rental_service_1.RentalService.getProviderOrders(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const updateRentalStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rental_service_1.RentalService.updateRentalStatus(req.params.id, req.user.userId, req.body.status);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Rental status updated successfully",
        data: result,
    });
});
exports.RentalController = {
    createRental,
    getMyRentals,
    getProviderOrders,
    updateRentalStatus,
};
