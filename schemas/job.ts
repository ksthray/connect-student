// src/schemas/job.ts

import { z } from "zod";

const JobType = {
  INTERNSHIP: "INTERNSHIP",
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  EVENT: "EVENT",
  CONFERENCE: "CONFERENCE",
  TRAINING: "TRAINING",
};

export const jobCreateSchema = z.object({
  // Champs principaux de l'offre
  title: z.string().min(5, "Le titre de l'offre est requis (min 5)."),
  description: z.string().min(50, "La description est trop courte (min 50)."),
  location: z.string().min(2, "La localisation est requise."),
  requirements: z.string().optional(), // Description des exigences
  detail: z.string().optional(),
  active: z.boolean().optional(),
  visibility: z.boolean().optional(),
  coverImage: z
    .string()
    .url("L'URL de l'image de couverture est invalide.")
    .optional(),

  // Champs de ciblage et de catégorisation
  type: z.nativeEnum(JobType, {
    message: "Type d'offre invalide.",
  }),
  sectors: z.array(z.string().cuid("ID de secteur invalide.")).optional(),

  // Date limite (Cruciale)
  // Utiliser z.string().datetime() si le frontend envoie une chaîne ISO 8601
  deadline: z
    .string()
    .datetime("Format de date limite invalide (doit être ISO 8601)."),

  // Champ spécifique pour l'ADMIN (identifie pour qui l'Admin publie)
  // L'Admin doit fournir l'ID de l'entreprise cible.
  companyId: z.string().optional(),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;

export const jobListQuerySchema = z.object({
  // Pagination
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .pipe(z.number().int().positive().max(50)),

  // Filtres
  search: z.string().optional(), // Recherche par titre ou description
  categoryId: z.string().cuid().optional(), // Filtrer par Catégorie/Domaine
  type: z.nativeEnum(JobType).optional(), // Filtrer par type (Stage, CDI, etc.)

  // Options d'affichage
  includeCompany: z
    .string()
    .optional()
    .refine((val) => val === "true" || val === "false" || val === undefined, {
      message:
        "Le paramètre includeCompany doit être 'true', 'false', ou absent.",
    }),
});

export type JobListQueryInput = z.infer<typeof jobListQuerySchema>;

export const jobUpdateSchema = z
  .object({
    title: z.string().min(5, "Le titre est requis (min 5).").optional(),
    description: z
      .string()
      .min(50, "La description est trop courte (min 50).")
      .optional(),
    location: z.string().min(2, "La localisation est requise.").optional(),
    requirements: z.string().optional(),
    type: z.nativeEnum(JobType).optional(),
    categoryId: z.string().cuid("ID de catégorie invalide.").optional(),
    deadline: z
      .string()
      .datetime("Format de date limite invalide (doit être ISO 8601).")
      .optional(),

    // L'entreprise peut activer ou désactiver son offre
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour.",
  });

export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;

export const jobVisibilitySchema = z.object({
  visibility: z
    .boolean()
    .describe("Le champ 'visibility' est requis et doit être un booléen."),
});

export type JobVisibilityInput = z.infer<typeof jobVisibilitySchema>;

export const jobActiveSchema = z.object({
  active: z
    .boolean()
    .describe("Le champ 'active' est requis et doit être un booléen."),
});

export type JobActiveInput = z.infer<typeof jobActiveSchema>;

export const jobSearchSchema = z.object({
  // 1. PAGE : Accepte string (de l'URL) ou null, transforme en nombre, utilise 1 si null/vide, assure >= 1.
  page: z
    .string()
    .nullable()
    .default("1")
    .transform((val) => {
      // Si la valeur est null, vide, ou non un nombre, retourne 1
      const num = Number(val);
      return isNaN(num) || num < 1 ? 1 : Math.floor(num);
    })
    .pipe(z.number().int().min(1)), // Assure que le résultat final est un nombre entier >= 1

  // 2. LIMIT : Accepte string ou null, transforme en nombre, utilise 10 par défaut (ou une autre valeur), assure >= 1.
  limit: z
    .string()
    .nullable()
    .default("10") // Valeur par défaut pour les connectés (sera écrasée si non connecté)
    .transform((val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 10 : Math.floor(num);
    })
    .pipe(z.number().int().min(1)),

  // 3. SECTOR IDS : Accepte string ou null, utilise une chaîne vide par défaut si null.
  // La route s'occupe de splitter la chaîne vide ('') sans erreur.
  sectorIds: z.string().nullable().default(""),
});

// Type de sortie (facultatif mais recommandé)
export type JobSearchInput = z.infer<typeof jobSearchSchema>;
