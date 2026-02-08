"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, DollarSign } from "lucide-react";

// Importer les hooks et types que vous avez fournis/corrigés
import { useUserSubscription } from "@/hooks/useUserSubscription"; // Assurez-vous d'avoir ce hook disponible
import { useRecommendedJobs, RecommendedJob } from "@/hooks/useRecommendedJobs";
import { useAuthStore } from "@/store/store"; // Pour obtenir le token
import { filterData, getTypeTextColor } from "@/services/helpers";

// --- Composants Internes ---

// Composant pour afficher une carte de recommandation
const RecommendationCard: React.FC<{ opp: RecommendedJob }> = ({ opp }) => {
  // Formatage du nom de la compagnie
  const companyName = opp.company?.companyName || "Entreprise privée";

  // Simulation de la couleur du score
  const scoreColor =
    opp.matchScore >= 90
      ? "text-green-600"
      : opp.matchScore >= 80
        ? "text-yellow-600"
        : "text-primary";

  return (
    <Link
      href={`/offres/${opp.slug}`}
      key={opp.slug}
      className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm line-clamp-1">
            {opp.title}
          </p>
          <p className="text-xs text-muted-foreground">{companyName}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full bg-primary/10 ${scoreColor}`}>
          {Math.round(opp.matchScore)}%
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{opp.type}</span>
        </div>
      </div>

      <Link href={`/offres/${opp.slug}`} passHref>
        <Button className="w-full bg-linear-to-r from-primary to-secondary text-white text-xs h-8">
          {getTypeTextColor(opp.type)}
        </Button>
      </Link>
    </Link>
  );
};

// Composant de l'offre d'abonnement pour les utilisateurs Freemium
export const SubscriptionPrompt: React.FC = () => (
  <div className="col-span-1 md:col-span-3 bg-secondary/10 border-2 border-dashed border-secondary rounded-xl p-8 text-center">
    <Zap className="w-10 h-10 text-premiere mx-auto mb-4" />
    <h3 className="text-xl font-bold text-premiere mb-2">
      Débloquez vos Recommandations
    </h3>
    <p className="text-muted-foreground mb-6">
      Passez à un plan Standard ou Premium pour recevoir des offres
      d&apos;emploi personnalisées qui correspondent parfaitement à votre
      profil.
    </p>
    {/* info */}
    <div className="text-xs text-muted-foreground bg-gray-100 p-2 rounded-lg">
      Cette fonctionnalité n'est pas encore disponible. Veuillez réessayer plus tard.
    </div>
    {/* <div className="flex justify-center md:flex-row flex-col gap-2 space-x-4">
      <Button asChild disabled={true} className="md:w-max w-full">
        <Link className="md:w-max w-full flex" href="/pricing" passHref>
          <DollarSign className="w-4 h-4 mr-2" />
          Voir nos plans
        </Link>
      </Button>
      <Button asChild disabled={true} className="md:w-max w-full" variant="secondary">
        <Link className="md:w-max w-full" href="/checkout" passHref>
          Payer l&apos;abonnement
        </Link>
      </Button>
    </div> */}
  </div>
);

// --- Composant Principal ---
export const RecommendedOpportunities: React.FC = () => {
  const { isSubscriber, plan } = useUserSubscription();
  const token = useAuthStore((state) => state.token);
  const { recommendations, isLoading, isError } = useRecommendedJobs(token);

  const shouldShowRecommendations = isSubscriber;

  // Affichage si non-abonné (Freemium)
  if (!shouldShowRecommendations) {
    return (
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
    );
  }

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
        <p>Chargement des recommandations...</p>
      </div>
    );
  }

  // Affichage si erreur ou pas de données
  if (isError || recommendations.length === 0) {
    return (
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
    );
  }

  // Affichage des recommandations (Standard/Premium)
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Recommandations pour vous
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
            {plan}
          </span>
        </h2>
        <Link href="/offres">
          <Button variant="ghost" className="text-primary hover:bg-primary/10">
            Explorer Plus
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterData(recommendations, 3).map((opp) => (
          <RecommendationCard key={opp.slug} opp={opp} />
        ))}
      </div>
    </div>
  );
};
