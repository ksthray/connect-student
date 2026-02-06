/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

// --- Types des Données de Recommandation (Basés sur la route API fournie) ---
export type RecommendedJob = {
  slug: string;
  title: string;
  type: string;
  description: string;
  deadline: Date;
  location: string;
  coverImage: string;
  company: {
    companyName: string;
  };
  matchScore: number; // Nous devons ajouter ce champ côté client ou API
};

// Type de la réponse complète de l'API
type RecommendationsResponse = {
  state: boolean;
  message: string;
  data: RecommendedJob[];
};

// --- Le Hook ---
export const useRecommendedJobs = (token: string | null) => {
  const route = "/candidate/recommendations";

  const { data, isLoading, isError } = useQuery<RecommendationsResponse>({
    queryKey: ["recommendedJobs", route, token],

    queryFn: async () => {
      if (!token) {
        throw new Error("Token manquant.");
      }
      const response = await api.get(route, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Ajouter une logique simple de matchScore si l'API ne le fournit pas encore
      const recommendations: RecommendedJob[] = response.data.data.map(
        (job: any) => ({
          ...job,
        })
      );

      // Retourner le format attendu
      return {
        ...response.data,
        data: recommendations,
      } as RecommendationsResponse;
    },

    // Activer la requête uniquement si le token est présent
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Retourner le tableau de données directement pour simplifier l'utilisation
  return {
    recommendations: data?.data || [],
    isLoading: isLoading,
    isError: isError,
  };
};
