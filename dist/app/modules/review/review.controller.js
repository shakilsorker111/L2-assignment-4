"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.createReview(req.user.userId, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Review created successfully",
        data: result,
    });
});
const updateReview = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.updateReview(req.params.id, req.user.userId, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    await review_service_1.ReviewService.deleteReview(req.params.id, req.user.userId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Review deleted successfully",
        data: null,
    });
});
const getReviewsByGear = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getReviewsByGear(req.params.gearId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Reviews retrieved successfully",
        meta: result.meta,
        data: {
            averageRating: result.averageRating,
            totalRatings: result.totalRatings,
            reviews: result.data,
        },
    });
});
const getProviderReviews = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getProviderReviews(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Provider reviews retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.ReviewController = {
    createReview,
    updateReview,
    deleteReview,
    getReviewsByGear,
    getProviderReviews,
};
