import { useAuthStore } from "@/store/store"; // Import du store Zustand
import { useUserSubscription } from "@/hooks/useUserSubscription"; // Le hook créé ci-dessus
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/services/api";
import { JobOfferType } from "@/entities/types";

// --- Constantes ---
const GUEST_LIMIT = 3;
const FREE_LIMIT = 3;
const UNLIMITED_LIMIT = 20;

interface UseJobOpportunitiesProps {
  page: number;
  sectorIds?: string;
  words?: string;
  type?: string;
}

export const useJobOpportunities = ({
  page,
  sectorIds = "",
  words = "",
  type = "",
}: UseJobOpportunitiesProps) => {
  // 1. Récupération du Statut via ZUSTAND
  const isAuthenticated = useAuthStore((state) => state.isAuthenticed);

  // 2. Récupération du Plan via notre hook adapté
  const { plan, isSubscriber } = useUserSubscription();

  // Est-ce qu'on a un accès illimité ? (Connecté + Standard/Premium)
  const isUnlimitedAccess = isAuthenticated && isSubscriber;

  // 3. Logique de Limite (Identique à avant)
  let limit = UNLIMITED_LIMIT;

  if (!isAuthenticated) {
    // Cas 1: Invité
    limit = GUEST_LIMIT;
    page = 1;
  } else if (plan === "FREE") {
    // Cas 2: Connecté mais FREE
    limit = FREE_LIMIT;
    page = 1;
  }
  // Cas 3: STANDARD/PREMIUM -> limit reste UNLIMITED_LIMIT

  // 4. Construction de la requête
  // Si on a des mots-clés ou un type, on utilise la route de recherche, sinon la route standard
  const endpoint = words || type ? "/candidate/search" : "/candidate/jobs";

  const route = `${endpoint}?page=${page}&limit=${limit}${
    sectorIds ? `&sectorIds=${sectorIds}` : ""
  }${words ? `&words=${encodeURIComponent(words)}` : ""}${
    type ? `&type=${encodeURIComponent(type)}` : ""
  }`;

  // 5. Fetch
  const { data, isLoading, isError } = useQuery({
    // La clé unique : inclut toutes les variables qui, si elles changent, doivent déclencher un re-fetch
    queryKey: [
      "opportunities",
      page,
      limit,
      sectorIds,
      words,
      type,
      isAuthenticated,
      plan,
    ],

    // La fonction de fetch
    queryFn: async () => {
      const response = await api.get(route);
      return response.data;
    },

    // Optionnel mais recommandé pour la pagination :
    // Garde les données de la page précédente affichées tant que la nouvelle page charge
    placeholderData: keepPreviousData,

    // Optionnel : Évite de refetcher trop souvent si l'utilisateur change d'onglet et revient
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // Extraction sécurisée des données
  // Note: on vérifie 'data?.data?.jobs' car votre API renvoie souvent { state: true, data: { jobs: ... } }
  const jobs: JobOfferType[] = data?.data?.jobs || [];
  const pagination = data?.data?.pagination || null;

  return {
    jobs,
    isLoading, // isLoading de React Query gère le premier chargement
    isError, // Utile pour afficher un message d'erreur si l'API échoue
    limit,
    isAuthenticated,
    plan,
    isUnlimitedAccess,
    pagination, // Si ton API renvoie la pagination
  };
};
