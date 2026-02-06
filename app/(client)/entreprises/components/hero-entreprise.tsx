"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroEntreprise = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
          Trouvez Votre Prochain Super{" "}
          <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
            Membre d&apos;Équipe
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
          Publiez des opportunités et atteignez des milliers d&lsquo;étudiants
          et de diplômés motivés cherchant activement leur prochain rôle. Notre
          système de mise en relation vous assure d&apos;obtenir des
          candidats qualifiés.
        </p>
        <div className="w-max mx-auto flex items-center gap-6 md:flex-row flex-col">
          <Button
            asChild
            className="md:w-max w-full linear-premiere text-white text-base px-8 h-12 hover:opacity-90 rounded-lg">
            <Link href={"/entreprise"}>
              Publiez Votre Première Opportunité
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant={"secondary"}
            className="md:w-max w-full text-base px-8 h-12 rounded-lg">
            <Link href={"/accompagnement-rh"}>
              Services d&apos;accompagnement RH
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroEntreprise;
