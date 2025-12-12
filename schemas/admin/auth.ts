import { z } from "zod";

export const adminRegisterSchema = z.object({
  fullname: z.string().min(2, "Le nom est requis."),
  email: z.string().email("Format d'email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  phone: z.string().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Format d'email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
