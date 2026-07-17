"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
router.get("/", category_controller_1.CategoryController.getAllCategories);
router.get("/:id", category_controller_1.CategoryController.getSingleCategory);
router.post("/", auth_1.default, (0, authorize_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createCategorySchema), category_controller_1.CategoryController.createCategory);
router.patch("/:id", auth_1.default, (0, authorize_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.updateCategorySchema), category_controller_1.CategoryController.updateCategory);
router.delete("/:id", auth_1.default, (0, authorize_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryController.deleteCategory);
exports.default = router;
