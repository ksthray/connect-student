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
