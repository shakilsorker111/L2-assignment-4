"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const gear_validation_1 = require("./gear.validation");
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const gear_controller_1 = require("./gear.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.get("/", gear_controller_1.GearController.getAllGear);
router.get("/:id", gear_controller_1.GearController.getSingleGear);
router.post("/", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), (0, validateRequest_1.default)(gear_validation_1.createGearSchema), gear_controller_1.GearController.createGear);
router.patch("/:id", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), (0, validateRequest_1.default)(gear_validation_1.updateGearSchema), gear_controller_1.GearController.updateGear);
router.delete("/:id", verifyToken_1.default, (0, authorize_1.default)(client_1.UserRole.PROVIDER), gear_controller_1.GearController.deleteGear);
exports.default = router;
