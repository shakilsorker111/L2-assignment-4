import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3),

    email: z.string().email(),

    password: z.string().min(6),

    phone: z.string().optional(),

    avatar: z.string().optional(),

    role: z.enum(["CUSTOMER", "PROVIDER"]),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});