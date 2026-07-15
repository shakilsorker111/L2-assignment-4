import { z } from "zod";

export const createCheckoutSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().cuid(),
  }),
});