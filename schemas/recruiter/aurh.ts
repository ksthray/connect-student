import z from "zod";

export const loginRecruiterSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(8, { message: "Le mot de passe est requis." }), // Adaptez la validation du téléphone
});

export type LoginRecruiterInput = z.infer<typeof loginRecruiterSchema>;
