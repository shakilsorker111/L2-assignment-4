import { RentalStatus } from "@prisma/client";
import { z } from "zod";

export const createRentalSchema = z.object({
  body: z.object({
    gearItemId: z.string().cuid(),

    quantity: z.number().int().positive(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  }),
});

export const updateRentalStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RentalStatus),
  }),
});