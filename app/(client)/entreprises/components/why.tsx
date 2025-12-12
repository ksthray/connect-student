"use client";

import { BarChart3, Clock, Users, Zap } from "lucide-react";
import React from "react";

const Why = () => {
  const benefits = [
    {
      icon: Users,
      title: "Accédez à des Talents de Qualité",
      description:
        "Atteignez des étudiants et diplômés pré-sélectionnés recherchant activement des opportunités dans votre domaine.",
    },
    {
      icon: Clock,
      title: "Économisez du Temps et des Ressources",
      description:
        "Réduisez les coûts de recrutement et le temps d'embauche grâce à notre système de mise en relation intelligent.",
    },
    {
      icon: BarChart3,
      title: "Meilleures Données de Recrutement",
      description:
        "Accédez à des analyses détaillées et des aperçus sur les candidats pour prendre des décisions d'embauche éclairées.",
    },
    {
      icon: Zap,
      title: "Publication et Configuration Rapides",
      description:
        "Publiez des opportunités en quelques minutes et commencez à recevoir des candidatures d'étudiants appariés.",
    },
  ];
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Pourquoi les Entreprises Choisissent Student Connect
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
                <div className="w-12 h-12 linear-premiere rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Why;
