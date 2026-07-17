"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2)
            .max(50),
        slug: zod_1.z
            .string()
            .min(2)
            .max(50),
        image: zod_1.z
            .string()
            .url()
            .optional(),
    }),
});
const updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2)
            .max(50)
            .optional(),
        slug: zod_1.z
            .string()
            .min(2)
            .max(50)
            .optional(),
        image: zod_1.z
            .string()
            .url()
            .optional(),
    }),
});
exports.CategoryValidation = {
    createCategorySchema,
    updateCategorySchema,
};
