// src/schemas/company.ts

import { z } from "zod";

export const companyCreateSchema = z.object({
  fullname: z
    .string()
    .min(3, "Le nom du gestionnaire de ce compte est requis."),
  companyName: z.string().min(3, "Le nom de l'entreprise est requis."),
  email: z.string().email("Format d'email invalide."),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères."),
  description: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  logo: z.string().optional(),
});

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;

export const companyUpdateSchema = companyCreateSchema.partial().extend({
  // Permettre la mise à jour du mot de passe (mais le rendre optionnel)
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .optional(),
});

export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
