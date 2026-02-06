/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useApplyJob.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "sonner";

interface ApplyJobVariables {
  jobSlug: string;
  coverLetter?: string;
  cvUrl: string;
  token: string;
}

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobSlug,
      coverLetter,
      cvUrl,
      token,
    }: ApplyJobVariables) => {
      const response = await api.post(
        `/candidate/jobs/${jobSlug}/apply`,
        {
          coverLetter: coverLetter,
          cvUrl: cvUrl,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // L'API ne nécessite pas de corps de requête si le CV est déjà stocké
      return response.data;
    },

    onSuccess: (data, variables) => {
      // Invalider le cache pour le détail de cette offre (si vous affichez le statut)
      queryClient.invalidateQueries({
        queryKey: ["job-details", variables.jobSlug],
      });
      // Optionnel : Invalider la liste des candidatures du candidat
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast.success(data.message);
    },

    onError: (error: any) => {
      console.error("Échec de la candidature:", error);
      toast.error(error.response.data.message);
      // Ici, vous pouvez afficher une notification d'erreur plus précise
    },
  });
};
