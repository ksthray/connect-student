"use client";

import { useCandidateProfileData } from "@/hooks/useCandidateProfileData";
import React from "react";

const CompletionProfil = ({ token }: { token: string }) => {
  const { data } = useCandidateProfileData(token); // Utilisez votre hook réel ici

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        Erreur de chargement du profil.
      </div>
    );
  }
  const { score } = data.profileCompletionScore;

  return (
    <div>
      {/* Profile Completion */}
      <div className="bg-linear-to-r mt-6 from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Complétez votre profil{" "}
            </h3>
            <p className="text-sm text-muted-foreground">
              Complétez votre profil pour multiplier vos opportunités{" "}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{score}%</div>
          </div>
        </div>
        <div className="w-full bg-blue-500/20 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompletionProfil;
