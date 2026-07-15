import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    gearItemId: z.string().cuid(),

    rentalOrderId: z.string().cuid(),

    rating: z.number().int().min(1).max(5),

    comment: z
      .string()
      .min(5)
      .max(500),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),

    comment: z
      .string()
      .min(5)
      .max(500)
      .optional(),
  }),
});