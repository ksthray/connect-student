"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 linear-deuxieme relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Emoji */}
        <div className="text-6xl md:text-7xl mb-6">🎯</div>

        {/* Titre */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Rejoins la communauté des étudiants connectés à leur avenir.
        </h2>

        {/* Sous-texte */}
        <p className="text-lg md:text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto">
          Fais le premier pas vers tes objectifs de carrière. Crée ton profil,
          découvre des opportunités et trouve la voie qui te correspond.
        </p>

        {/* Appels à l’action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-primary hover:bg-blue-50 text-base px-8 h-12 rounded-lg font-semibold">
            Créer mon compte maintenant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 hover:text-white border-white bg-transparent text-white hover:bg-white/50 text-base px-8 h-12 rounded-lg font-semibold">
            <Link href="/offres">Explorer les offres</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
