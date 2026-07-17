"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        gearItemId: zod_1.z.string().cuid(),
        rentalOrderId: zod_1.z.string().cuid(),
        rating: zod_1.z.number().int().min(1).max(5),
        comment: zod_1.z
            .string()
            .min(5)
            .max(500),
    }),
});
exports.updateReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().int().min(1).max(5).optional(),
        comment: zod_1.z
            .string()
            .min(5)
            .max(500)
            .optional(),
    }),
});
