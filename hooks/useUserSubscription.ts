import { useAuthStore } from "@/store/store"; // Assure-toi que le chemin est bon
import { PlanSubscriptionType } from "@/entities/types";

// Type simplifié pour le nom du plan
type PlanName = "FREE" | "STANDARD" | "PREMIUM";

export const useUserSubscription = () => {
  // On récupère l'admin (user) et le token depuis Zustand
  const admin = useAuthStore((state) => state.admin);
  const token = useAuthStore((state) => state.token);

  // Vérification de base : si pas de token, on considère que c'est un invité (ou FREE par défaut)
  if (!token || !admin) {
    return {
      plan: "FREE" as PlanName,
      tier: null,
      isSubscriber: false,
    };
  }

  // Extraction sécurisée du plan via la structure de tes types
  // admin -> subscription -> tier -> name
  const subscription = admin.subscription;
  const tier = subscription?.tier;

  // Si l'utilisateur a un abonnement actif, on prend son nom, sinon FREE
  const planName =
    subscription?.status === "ACTIVE" && tier?.name ? tier.name : "FREE";

  return {
    plan: planName as PlanName,
    tier: tier as PlanSubscriptionType | undefined, // On renvoie tout l'objet tier si besoin des détails
    isSubscriber: planName === "STANDARD" || planName === "PREMIUM",
    // Avec Zustand persist, les données sont là quasi instantanément,
    // donc isLoading est moins critique ici qu'avec un fetch asynchrone
    isLoading: false,
  };
};
