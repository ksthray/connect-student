"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobOpportunities } from "@/hooks/useJobOpportunities";
import { Skeleton } from "@/components/ui/skeleton";
import OnboardingConvert from "@/components/onboarding-convert";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { JobCard } from "@/components/ui/job-card";

export default function OffresList() {
  const [openOnboarding, setopenOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    jobs,
    isLoading,
    isError,
    limit, // La limite appliquée (3 ou 20)
    isUnlimitedAccess, // true si Standard/Premium
    isAuthenticated,
    pagination, // Contient total, totalPages, hasNextPage, etc.
  } = useJobOpportunities({
    page: currentPage,
  });

  const { ref: sentinelRef, isIntersecting: isSentinelVisible } =
    useIntersectionObserver({
      threshold: 0,
      rootMargin: "0px 0px -100px 0px", // Optionnel: donne 100px de marge avant qu'il soit considéré "hors champ"
    });

  const shouldShowUpsellBar =
    !isLoading &&
    !isUnlimitedAccess &&
    jobs.length >= limit &&
    pagination &&
    !isSentinelVisible;

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Erreur lors du chargement des offres.
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        {/* Légende des catégories */}
        <div className="w-full flex flex-wrap justify-center gap-3 md:gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-700 rounded-full"></span>{" "}
            Formation
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-700 rounded-full"></span> Stage
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-700 rounded-full"></span> Emploi
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-700 rounded-full"></span>{" "}
            Événement
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {!isLoading ? (
            jobs.map((offer, index) => <JobCard key={index} offer={offer} />)
          ) : (
            <>
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} className="w-full h-72" />
              ))}
            </>
          )}
        </div>

        <div
          ref={sentinelRef as React.Ref<HTMLDivElement>}
          className="h-1 bg-transparent mt-4"
        />

        <div className="mt-10 pt-6 border-t">
          <AnimatePresence>
            {/* La condition d'affichage reste la même */}
            {!isLoading && !shouldShowUpsellBar && (
              <motion.div
                // Propriétés d'animation
                initial={{ opacity: 0, y: 100 }} // État initial (caché en bas, invisible)
                animate={{ opacity: 1, y: 0 }} // État quand l'élément est monté (visible, en place)
                exit={{ opacity: 0, y: 100 }} // État de sortie (glisse vers le bas et disparaît)
                transition={{ type: "spring", stiffness: 200, damping: 20 }} // Animation fluide
                // Positionnement Fixe, centré horizontalement, en bas
                className="fixed left-1/2 -translate-x-1/2 rounded-lg w-[96%] md:w-1/2 inset-x-0 bottom-4 z-50 bg-white border border-gray-200 shadow-2xl p-4 md:p-6">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-4">
                  {/* Message principal et incitation à l'Onboarding */}
                  <div className="grow text-center">
                    <p className="font-bold text-lg text-gray-800">
                      Débloquez l&apos;accès illimité et la personnalisation !
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Nous avons trouvé{" "}
                      <b className="text-premiere">
                        {pagination?.total} offres
                      </b>{" "}
                      pertinentes, mais vous n&apos;en voyez que <b>{limit}</b>.
                      <br className="hidden sm:inline" />{" "}
                      <span className="font-semibold text-primary">
                        Créer votre
                      </span>{" "}
                      ou{" "}
                      <span className="font-semibold text-primary">
                        Connectez-vous
                      </span>{" "}
                      si cela à été déjà fait, pour des recommandations précises
                      et accès à toutes les opportunités.
                    </p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col gap-2 md:flex-row w-full justify-center">
                    {/* Bouton pour Créer (Onboarding) */}
                    <Button
                      onClick={() => setopenOnboarding(true)}
                      className="w-full md:w-auto">
                      Commencer l&apos;aventure
                    </Button>

                    {/* Bouton pour Se Connecter (si non authentifié) */}
                    {!isAuthenticated ? (
                      <Button
                        asChild
                        variant={"secondary"}
                        className="w-full md:w-auto">
                        <Link href={"/connexion"}> Se connecter</Link>
                      </Button>
                    ) : (
                      // Si déjà authentifié
                      <Button
                        onClick={() => console.log("Rediriger vers les Plans")}
                        variant={"secondary"}
                        className="w-full md:w-auto">
                        Mettre à Niveau / Voir Plans
                      </Button>
                    )}
                  </div>
                </div>

                {/* Message secondaire (petit message pour les plans) */}
                <div className="mt-3 text-center">
                  <a
                    href="/pricing" // Lien vers votre page de plans/tarifs
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() =>
                      console.log("Action: Redirection vers la page des tarifs")
                    }>
                    Découvrir nos plans
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Affichage de la pagination pour les abonnés Illimités */}
          {isUnlimitedAccess && pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage || isLoading}
                variant="outline"
                size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.currentPage} sur {pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage || isLoading}
                variant="outline"
                size="sm">
                Suivant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {!isLoading && jobs.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune offre trouvée pour cette recherche.
            </p>
          )}
        </div>
      </div>
      <OnboardingConvert open={openOnboarding} setopen={setopenOnboarding} />
    </section>
  );
}
