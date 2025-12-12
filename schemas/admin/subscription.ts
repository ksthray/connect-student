import { z } from "zod";

const SubscriptionPlan = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PREMIUM: "PREMIUM",
};

export const subscriptionTierSchema = z.object({
  name: z
    .nativeEnum(SubscriptionPlan)
    .refine((val) => val in SubscriptionPlan, {
      message: "Le nom du plan doit être FREE, STANDARD ou PREMIUM.",
    }),
  priceUSD: z.number().min(0, "Le prix ne peut pas être négatif."),
  benefits: z.array(z.string()).min(1, "Ajoutez au moins un avantage."),
  applicationLimit: z.number().int(), // -1 pour illimité
  notifiedLimit: z.number().int(),
});

export type SubscriptionTierInput = z.infer<typeof subscriptionTierSchema>;
