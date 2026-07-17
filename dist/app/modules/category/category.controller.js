"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.createCategory(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.getAllCategories(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Categories retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSingleCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.getSingleCategory(req.params.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category retrieved successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    await category_service_1.CategoryService.deleteCategory(req.params.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
