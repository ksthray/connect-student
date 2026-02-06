import { CandidateType } from "@/entities/types";
import api from "@/services/api"; // Assurez-vous que c'est votre instance Axios configurée
import { useQuery } from "@tanstack/react-query";

// --- Types de l'Objet 'details' retourné par calculateProfileCompletion ---
// Ces types sont basés sur la réponse de votre route /api/candidate/me
type ProfileCompletionDetails = {
  fullname: boolean;
  phone: boolean;
  about: boolean;
  sectors: boolean;
  skills: boolean;
  cvUrl: boolean;
  level: boolean;
  university: boolean;
};

// --- Type de la Réponse Complète de /api/candidate/me ---
export type ProfileData = {
  // Champs de la table User
  fullname: string | null;
  email: string;
  phone: string | null;
  candidateProfile: CandidateType;
  cvUrl: string | null;
  // Champ calculé
  profileCompletionScore: {
    score: number;
    details: ProfileCompletionDetails;
  };
};

// --- Le Hook ---
export const useCandidateProfileData = (
  token: string | null
): {
  data: ProfileData | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const route = "/candidate/me";

  const { data, isLoading, isError } = useQuery<ProfileData>({
    // 1. CLEF DE REQUÊTE : DOIT ÊTRE UNIQUE ET INCLURE LE TOKEN
    // Le token est inclus pour re-fetcher si l'utilisateur se déconnecte/reconnecte (changement de token)
    queryKey: ["candidateProfile", route, token],

    // 2. FONCTION DE FETCH
    queryFn: async (): Promise<ProfileData> => {
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
      return response.data as ProfileData;
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
