"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const stripe_1 = __importDefault(require("../../config/stripe"));
const config_1 = __importDefault(require("../../config"));
const createCheckoutSession = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.createCheckoutSession(req.body.rentalOrderId, req.user.userId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Checkout session created successfully",
        data: result,
    });
});
const webhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, signature, config_1.default.stripe_webhook_secret);
    }
    catch (error) {
        return res.status(400).send("Webhook Error");
    }
    await payment_service_1.PaymentService.handleWebhook(event);
    res.json({
        received: true,
    });
};
const getMyPayments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getMyPayments(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Payments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getProviderPayments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getProviderPayments(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Payments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getAllPayments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getAllPayments(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Payments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getPaymentById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getPaymentById(req.params.id, req.user);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
});
exports.PaymentController = {
    createCheckoutSession,
    webhook,
    getMyPayments,
    getProviderPayments,
    getAllPayments,
    getPaymentById,
};
