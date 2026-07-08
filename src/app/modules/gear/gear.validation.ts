import { z } from "zod";

export const createGearSchema = z.object({
  body: z.object({
    title: z.string().min(3),

    brand: z.string().min(2),

    description: z.string().min(10),

    condition: z.string(),

    pricePerDay: z.number().positive(),

    stock: z.number().int().positive(),

    image: z.string().url(),

    categoryId: z.string(),
  }),
});

export const updateGearSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),

    brand: z.string().min(2).optional(),

    description: z.string().min(10).optional(),

    condition: z.string().optional(),

    pricePerDay: z.number().positive().optional(),

    stock: z.number().int().positive().optional(),

    image: z.string().url().optional(),

    categoryId: z.string().optional(),
  }),
});