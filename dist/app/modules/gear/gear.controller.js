"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearController = void 0;
const gear_service_1 = require("./gear.service");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createGear = (0, catchAsync_1.default)(async (req, res) => {
    // console.log("request user", req.user)
    const providerId = req.user.userId;
    //   console.log("provider id:", providerId)
    const result = await gear_service_1.GearService.createGear(req.body, providerId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Gear created successfully",
        data: result,
    });
});
const updateGear = (0, catchAsync_1.default)(async (req, res) => {
    const providerId = req.user.userId;
    const result = await gear_service_1.GearService.updateGear(req.params.id, req.body, providerId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Gear updated successfully",
        data: result,
    });
});
const deleteGear = (0, catchAsync_1.default)(async (req, res) => {
    const providerId = req.user.userId;
    await gear_service_1.GearService.deleteGear(req.params.id, providerId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Gear deleted successfully",
        data: null,
    });
});
const getAllGear = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gear_service_1.GearService.getAllGear(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Gear retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSingleGear = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gear_service_1.GearService.getSingleGear(req.params.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Gear retrieved successfully",
        data: result,
    });
});
exports.GearController = {
    createGear,
    updateGear,
    deleteGear,
    getAllGear,
    getSingleGear,
};
