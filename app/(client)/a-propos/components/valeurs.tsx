"use client";

import { Heart, Target, TrendingUp, Zap } from "lucide-react";
import React from "react";

const Valeurs = () => {
  const values = [
    {
      icon: Target, // Cible
      title: "Axé sur l'Étudiant",
      description:
        "Tout ce que nous construisons est conçu en pensant à la réussite des étudiants. Vos objectifs sont nos objectifs.",
    },
    {
      icon: Zap, // Éclair
      title: "L'Innovation d'Abord",
      description:
        "Nous améliorons continuellement notre algorithme de mise en relation pour vous connecter à l'opportunité parfaite.",
    },
    {
      icon: Heart, // Cœur
      title: "Communauté avant tout",
      description:
        "Nous croyons au pouvoir de la connexion. Construire une communauté solidaire est au cœur de notre action.",
    },
    {
      icon: TrendingUp, // Tendance à la hausse
      title: "Transparence",
      description:
        "Des informations claires sur les opportunités, les entreprises et la plateforme vous aident à prendre des décisions éclairées.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Nos Valeurs Fondamentales
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Ces principes guident tout ce que nous faisons chez Connect Student.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Valeurs;
