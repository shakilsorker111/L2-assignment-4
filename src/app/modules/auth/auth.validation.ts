import { z } from "zod";

export const registerValidation = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(6),

  phone: z.string().optional(),

  role: z.enum(["CUSTOMER", "PROVIDER"]),
});