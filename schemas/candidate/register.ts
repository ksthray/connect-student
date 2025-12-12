import { z } from "zod";

export const candidateRegisterSchema = z.object({
  fullname: z.string().min(2, "Le nom complet est requis."),
  email: z.string().email("Format d'email invalide."),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: z
    .enum(["CANDIDATE", "COMPANY", "ADMIN"], {
      message: "Rôle utilisateur invalide.",
    })
    .optional(),
  sectors: z.array(z.string()).optional(),
  cvUrl: z.string().optional(),
  level: z
    .enum(["STUDENT", "GRADUATE", "PROFESSIONAL"], {
      message: "Niveau utilisateur invalide.",
    })
    .optional(),
});

export type CandidateRegisterInput = z.infer<typeof candidateRegisterSchema>;

// enum UserLevel {
//   STUDENT // Étudiant en cours de formation
//   GRADUATE // Diplômé (cherche premier emploi)
//   PROFESSIONAL // Professionnel (en mobilité)
// }
