"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const client_1 = require("@prisma/client");
const rental_validation_1 = require("./rental.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const rental_controller_1 = require("./rental.controller");
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(rental_validation_1.createRentalSchema), rental_controller_1.RentalController.createRental);
router.get("/my-rentals", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), rental_controller_1.RentalController.getMyRentals);
router.get("/provider-orders", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), rental_controller_1.RentalController.getProviderOrders);
router.patch("/:id/status", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), (0, validateRequest_1.default)(rental_validation_1.updateRentalStatusSchema), rental_controller_1.RentalController.updateRentalStatus);
exports.default = router;
