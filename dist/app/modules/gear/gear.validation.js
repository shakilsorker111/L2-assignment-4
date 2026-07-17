"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGearSchema = exports.createGearSchema = void 0;
const zod_1 = require("zod");
exports.createGearSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        brand: zod_1.z.string().min(2),
        description: zod_1.z.string().min(10),
        condition: zod_1.z.string(),
        pricePerDay: zod_1.z.number().positive(),
        stock: zod_1.z.number().int().positive(),
        image: zod_1.z.string().url(),
        categoryId: zod_1.z.string(),
    }),
});
exports.updateGearSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        brand: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().min(10).optional(),
        condition: zod_1.z.string().optional(),
        pricePerDay: zod_1.z.number().positive().optional(),
        stock: zod_1.z.number().int().positive().optional(),
        image: zod_1.z.string().url().optional(),
        categoryId: zod_1.z.string().optional(),
    }),
});
