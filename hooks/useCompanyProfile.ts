import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

// --- Types basés sur votre route API ---
export interface CompanyProfileData {
  id: string;
  companyName: string;
  description: string | null;
  location: string | null;
  logo: string | null;
  industry: string | null;
  website: string | null;
}

export interface UserWithCompany {
  fullname: string;
  email: string;
  phone: string | null;
  role: string;
  companyProfile: CompanyProfileData | null;
  updatedAt: Date;
}

// --- Le Hook ---
export const useCompanyProfile = (
  token: string | null,
): {
  data: UserWithCompany | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const route = "/recruiter/us";

  const { data, isLoading, isError } = useQuery<UserWithCompany>({
    // 1. CLEF DE REQUÊTE : DOIT ÊTRE UNIQUE ET INCLURE LE TOKEN
    // Le token est inclus pour re-fetcher si l'utilisateur se déconnecte/reconnecte (changement de token)
    queryKey: ["company-profile", route, token],

    // 2. FONCTION DE FETCH
    queryFn: async (): Promise<UserWithCompany> => {
      // Vérifier si le token est présent avant de faire la requête
      if (!token) {
        throw new Error("Token manquant pour l'authentification.");
      }

      const response = await api.get(route, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Le back-end retourne directement l'objet { fullname, email, cvUrl, profileCompletion, ... }
      return response.data.data as UserWithCompany;
    },

    // 3. ACTIVER/DÉSACTIVER LA REQUÊTE
    // La requête ne s'exécute que si le token est valide et présent
    enabled: !!token,

    // Optionnel : Évite de refetcher trop souvent si l'utilisateur change d'onglet et revient
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  return {
    data,
    isLoading: isLoading, // Maintenant correctement lié à l'état de TanStack Query
    isError,
  };
};
