"use client";

import React from "react";

const Statistique = () => {
  const stats = [
    { number: "50K+", label: "Étudiants Actifs" },
    { number: "2K+", label: "Entreprises & Institutions" },
    { number: "10K+", label: "Opportunités Publiées" },
    { number: "85%", label: "Taux de Réussite de Placement" },
  ];
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 linear-deuxieme">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Notre Impact en Chiffres
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <p className="text-blue-100/90 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistique;
