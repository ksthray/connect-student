import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email("Format d'email invalide."),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email("Format d'email invalide."),
  otp: z.string().length(6, "Le code OTP doit comporter 6 chiffres."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const registerSchema = z.object({
  fullname: z.string().min(3, { message: "Le nom complet est requis." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  phone: z.string().min(8, { message: "Le numéro de téléphone est requis." }), // Adaptez la validation du téléphone
});

export type RegisterInput = z.infer<typeof registerSchema>;
