"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { SubscriptionPrompt } from "../../components/recommended-opportunities";
import { useAuthStore } from "@/store/store";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useRecommendedJobs } from "@/hooks/useRecommendedJobs";
import { frDate, getActionText } from "@/services/helpers";

export default function CandidateRecommendations() {
  const { isSubscriber } = useUserSubscription();
  const token = useAuthStore((state) => state.token);
  const { recommendations, isLoading, isError } = useRecommendedJobs(token);

  const shouldShowRecommendations = isSubscriber;

  // Affichage si non-abonné (Freemium)
  if (!shouldShowRecommendations) {
    return (
      <div className="space-y-8 p-10">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Recommandations Personnalisées
            </h2>
            {/* Le bouton Explore More n'a pas de sens si on bloque l'accès aux recommandations */}
          </div>
          <div className="grid grid-cols-1 gap-6">
            <SubscriptionPrompt />
          </div>
        </div>
      </div>
    );
  }

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="space-y-8 p-10">
        <div className="bg-white rounded-xl border border-border p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
          <p>Chargement des recommandations...</p>
        </div>
      </div>
    );
  }

  // Affichage si erreur ou pas de données
  if (isError || recommendations.length === 0) {
    return (
      <div className="space-y-8 p-10">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Recommandations Personnalisées
            </h2>
            <Link href="/offres">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10">
                Explorer toutes les offres
              </Button>
            </Link>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <p>
              {isError
                ? "Erreur lors de la récupération des recommandations."
                : "Aucune offre correspondante trouvée pour vos secteurs d'intérêt."}
            </p>
            <p className="text-sm mt-2">
              Vérifiez vos secteurs dans votre profil ou explorez toutes les
              offres.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Nos recommandations{" "}
        </h1>
        <p className="text-muted-foreground">
          Gérez votre profil professionnel pour attirer les opportunités.{" "}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((opp) => (
          <div
            key={opp.slug}
            className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {opp.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  {opp.company.companyName}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{opp.type}</span>
                <span className="font-semibold text-foreground">
                  {opp.description}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{"Date limite"}</span>
                <span className="font-semibold text-foreground">
                  {frDate(opp.deadline)}
                </span>
              </div>
            </div>

            <Button
              asChild
              className="w-full linear-premiere text-white text-xs h-8">
              <Link href={`/offres/${opp.slug}`}>
                {getActionText(opp.type)}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
