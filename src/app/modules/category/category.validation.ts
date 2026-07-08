import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(50),

    slug: z
      .string()
      .min(2)
      .max(50),

    image: z
      .string()
      .url()
      .optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .optional(),

    slug: z
      .string()
      .min(2)
      .max(50)
      .optional(),

    image: z
      .string()
      .url()
      .optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};