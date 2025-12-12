import { z } from "zod";

export const paymentRateSchema = z.object({
  // On accepte number ou string (pour la précision décimale)
  rate: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Le taux doit être un nombre positif."),
});

export type PaymentRateInput = z.infer<typeof paymentRateSchema>;
