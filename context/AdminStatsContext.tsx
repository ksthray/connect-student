"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/services/api"; // Votre instance d'Axios
import { useAuthStore } from "@/store/store"; // Votre store d'authentification
import { AdminStats } from "@/entities/types";

// --- 1. DÉFINITION DE L'INTERFACE DU CONTEXTE ---

interface AdminStatsContextType {
  stats: AdminStats | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const AdminStatsContext = createContext<AdminStatsContextType | undefined>(
  undefined
);

// --- 2. FONCTION DE TÉLÉCHARGEMENT DES DONNÉES ---

const fetchAdminStats = async (token: string): Promise<AdminStats> => {
  const response = await api.get("/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data.state) {
    throw new Error(
      response.data.error || "Échec de la récupération des statistiques."
    );
  }

  return response.data.data;
};

// --- 3. LE PROVIDER DU CONTEXTE ---

interface AdminStatsProviderProps {
  children: ReactNode;
}

export function AdminStatsProvider({ children }: AdminStatsProviderProps) {
  const token = useAuthStore((state) => state.token);

  // Utilisation de useQuery pour gérer l'état, le cache et le rechargement
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => fetchAdminStats(token),
    enabled: !!token, // Active la requête uniquement si le token est disponible
    staleTime: 1000 * 60 * 5, // Les données sont considérées comme fraîches pendant 5 minutes
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(`Erreur de chargement des stats: ${error.message}`);
    }
  }, [isError, error]);

  const contextValue: AdminStatsContextType = {
    stats,
    isLoading,
    isError,
    refetch: refetch as () => void, // Casting pour simplifier l'utilisation du refetch
  };

  return (
    <AdminStatsContext.Provider value={contextValue}>
      {children}
    </AdminStatsContext.Provider>
  );
}

// --- 4. HOOK PERSONNALISÉ POUR L'UTILISATION ---

export function useAdminStats() {
  const context = useContext(AdminStatsContext);

  if (context === undefined) {
    throw new Error(
      "useAdminStats doit être utilisé à l'intérieur d'un AdminStatsProvider"
    );
  }

  return context;
}
