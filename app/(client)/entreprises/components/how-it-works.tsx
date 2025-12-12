"use client";

import React from "react";

const HowItWorks = () => {
  const processSteps = [
    {
      number: "1",
      title: "Créez votre Profil d'Entreprise",
      description:
        "Configurez votre profil d'entreprise avec des informations sur votre organisation, votre culture et les opportunités.",
      icon: "🏢",
    },
    {
      number: "2",
      title: "Publiez des Opportunités",
      description:
        "Créez des offres d'emploi, des stages et des programmes de formation détaillés avec les exigences et les avantages.",
      icon: "📝",
    },
    {
      number: "3",
      title: "Recevez des Candidats Appariés",
      description:
        "Recevez des candidatures d'étudiants pré-sélectionnés dont les profils correspondent aux exigences de votre poste.",
      icon: "📩",
    },
    {
      number: "4",
      title: "Embauchez et Intégrez",
      description:
        "Interrogez, sélectionnez et intégrez vos nouveaux membres d'équipe à l'aide de nos outils intégrés.",
      icon: "🎯",
    },
  ];
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Comment Ça Marche
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Commencez en 4 étapes simples et commencez à embaucher les meilleurs
          talents.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
              <div className="absolute -top-4 -left-4 w-12 h-12 linear-premiere rounded-full flex items-center justify-center text-white font-bold text-lg">
                {step.number}
              </div>
              <div className="text-4xl mb-6 mt-2">{step.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {idx < 3 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-linear-to-r from-primary to-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
