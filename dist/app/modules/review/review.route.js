"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const review_validation_1 = require("./review.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(review_validation_1.createReviewSchema), review_controller_1.ReviewController.createReview);
router.patch("/:id", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(review_validation_1.updateReviewSchema), review_controller_1.ReviewController.updateReview);
router.delete("/:id", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.ReviewController.deleteReview);
router.get("/gear/:gearId", review_controller_1.ReviewController.getReviewsByGear);
router.get("/provider", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), review_controller_1.ReviewController.getProviderReviews);
exports.default = router;
