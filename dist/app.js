"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/api/v1/payments/webhook", express_1.default.raw({ type: "application/json" }));
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "GearUp Backend API Running",
    });
});
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
