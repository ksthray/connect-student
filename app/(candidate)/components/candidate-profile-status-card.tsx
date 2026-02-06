"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, X, AlertTriangle } from "lucide-react";
import { useCandidateProfileData } from "@/hooks/useCandidateProfileData";
import { useAuthStore } from "@/store/store";

// --- Types des données reçues de /api/candidate/me ---

// Fonction utilitaire pour extraire le nom du fichier du CV
const getCvFileName = (url: string | null): string => {
  if (!url) return "Aucun CV téléchargé";
  try {
    const parts = url.split("/");
    return parts[parts.length - 1].length > 30
      ? parts[parts.length - 1].substring(0, 30) + "..."
      : parts[parts.length - 1];
  } catch (e) {
    console.log("e:", e);

    return "Fichier CV (URL valide)";
  }
};

export const CandidateProfileStatusCard: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useCandidateProfileData(token); // Utilisez votre hook réel ici

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        Chargement...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        Erreur de chargement du profil.
      </div>
    );
  }

  const { score, details } = data.profileCompletionScore;

  const cvFileName = getCvFileName(data.cvUrl);

  const getStatusIcon = (
    isCompleted: boolean,
    type: "basic" | "warning" = "basic"
  ) => {
    if (isCompleted) {
      return <Check className="w-4 h-4 text-green-500 mr-2" />;
    }
    if (type === "warning") {
      return <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />;
    }
    return <X className="w-4 h-4 text-red-500 mr-2" />;
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">
        L&apos;état de votre profil
      </h2>
      <div className="space-y-6">
        {/* 1. Bar de progression */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Profil à finalisé avec ses informations
            </span>
            <span className="text-sm font-bold text-secondary">{score}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full linear-premiere transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* 2. CV Upload Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground flex items-center">
              Votre CV
            </span>
            <span className="text-sm font-bold text-secondary">
              {details.cvUrl ? "✓" : "✗"}
            </span>
          </div>
          <p
            className={`text-xs ${
              details.cvUrl
                ? "text-muted-foreground"
                : "text-red-500 font-semibold"
            }`}>
            {cvFileName}
          </p>
        </div>

        {/* 3. Bouton Compléter le profil */}
        <div className="pt-4 border-t border-border">
          <Link href="/user/my-profile">
            <Button className="w-full linear-premiere text-white">
              Compléter le Profil ({100 - score}% manquant)
            </Button>
          </Link>
        </div>

        {/* 4. Profile Strengths */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Détails du Profil
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center">
              {getStatusIcon(details.about)}
              {details.about ? "Biographie complétée" : "Biographie manquante"}
            </li>

            <li className="flex items-center">
              {getStatusIcon(details.skills, "warning")}
              Compétences ({data.candidateProfile?.skills.length || 0}/3
              minimum)
            </li>

            <li className="flex items-center">
              {getStatusIcon(details.sectors)}
              Secteurs d&apos;intérêt (
              {details.sectors ? "Définis" : "Manquants"})
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
