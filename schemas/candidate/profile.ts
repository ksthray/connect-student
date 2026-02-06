import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  fullname: z.string().min(3).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),

  level: z
    .enum(["STUDENT", "GRADUATE", "PROFESSIONAL"], {
      message: "Niveau utilisateur invalide.",
    })
    .optional(),
  university: z.string().optional(),
  cvUrl: z.string().url().optional(),

  skills: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  birthday: z.coerce.date().optional(),

  city: z.string().optional(),
  commune: z.string().optional(),
  address: z.string().optional(),
  about: z.string().min(20).optional(),
});
