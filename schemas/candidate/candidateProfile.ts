import { z } from "zod";

// Définitions des niveaux de compétence pour le schéma
const skillLevels = z.enum(["STUDENT", "GRADUAT", "PROFESSIONAL"]);

// --- 1. Schéma pour les Informations Personnelles ---
export const personalInfoSchema = z.object({
  fullname: z
    .string()
    .min(2, "Le prénom est trop court.")
    .max(50, "Le prénom est trop long."),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        !val ||
        val.length === 0 ||
        /^[\d\s+\-()]{8,20}$/.test(val.replace(/\s/g, "")),
      "Format de téléphone invalide."
    ),
  location: z.string().optional().nullable(),
  bio: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val.length <= 500,
      "La biographie ne doit pas dépasser 500 caractères."
    ),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// --- 2. Schéma pour une Compétence (Skill) ---
export const skillSchema = z.object({
  name: z.string().min(2, "Le nom de la compétence est requis."),
  level: skillLevels,
});

export type SkillFormData = z.infer<typeof skillSchema>;
