"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../modules/auth"));
const category_1 = __importDefault(require("../modules/category"));
const gear_1 = __importDefault(require("../modules/gear"));
const rental_1 = __importDefault(require("../modules/rental"));
const payment_1 = __importDefault(require("../modules/payment"));
const review_1 = __importDefault(require("../modules/review"));
const dashboard_1 = __importDefault(require("../modules/dashboard"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/categories", category_1.default);
router.use("/gear", gear_1.default);
router.use("/provider/gear", gear_1.default);
router.use("/rentals", rental_1.default);
router.use("/payments", payment_1.default);
router.use("/reviews", review_1.default);
router.use("/dashboard", dashboard_1.default);
router.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "GearUp API Running",
    });
});
exports.default = router;
