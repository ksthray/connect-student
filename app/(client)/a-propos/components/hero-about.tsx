"use client";

import { Lightbulb, TrendingUp } from "lucide-react";

const HeroAbout = () => {
  return (
    <div>
      {/* Section Héro */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Connecter les Étudiants à{" "}
            <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
              Leur Avenir
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Connect Student est une startup EdTech qui relie les étudiants et jeunes diplômés aux entreprises afin de faciliter leur insertion professionnelle à travers des opportunités de stages, d’emplois et de formations.

          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-10 border border-border">
              <div className="w-12 h-12 linear-premiere rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-white" /> {/* Ampoule */}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Notre mission est de relier les étudiants et diplômés aux entreprises à travers une plateforme intelligente dotée des fonctionnalités faciles à utiliser, pour créer des opportunités de stage, d’emploi et de développement des carrières professionnelles.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-linear-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 md:p-10 border border-border">
              <div className="w-12 h-12 linear-premiere rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />{" "}
                {/* Tendance à la hausse */}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Notre Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Notre vision est d’ouvrir les portes du monde professionnel à chaque jeune étudiant ou jeune diplômé, sans exception.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroAbout;
