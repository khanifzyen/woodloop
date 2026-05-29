import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.enum([
    "supplier",
    "generator",
    "aggregator",
    "converter",
    "enabler",
    "buyer",
  ]),
  phone: z.string().optional(),
  workshop_name: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
