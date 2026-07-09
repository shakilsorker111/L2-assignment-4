import { z } from "zod";

export const createRentalSchema = z.object({
  body: z.object({
    gearItemId: z.string().cuid(),

    quantity: z.number().int().positive(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  }),
});