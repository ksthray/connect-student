// src/schemas/subscription.ts

import { z } from "zod";
const SubscriptionPlan = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PREMIUM: "PREMIUM",
};
// Assurez-vous d'importer SubscriptionPlan depuis votre client Prisma

// Schéma pour simuler un paiement, limitant les plans à payer (exclut FREE)
export const paymentSchema = z.object({
  plan: z
    .enum([SubscriptionPlan.STANDARD, SubscriptionPlan.PREMIUM])
    .describe("Le plan d'abonnement est requis (STANDARD ou PREMIUM)."),
  // Dans une vraie app, on ajouterait ici le token de paiement Stripe/PayPal, etc.
});

export type PaymentInput = z.infer<typeof paymentSchema>;
