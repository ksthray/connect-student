"use client";

import React from "react";

const Team = () => {
  const team = [
    {
      name: "Sarah Mitchell",
      role: "Co-fondatrice & PDG",
      bio: "Ancienne directrice RH avec plus de 10 ans en acquisition de talents",
      avatar: "SM",
    },
    {
      name: "Alex Chen",
      role: "Co-fondateur & CTO",
      bio: "Spécialiste de l'IA passionné par la construction d'algorithmes de mise en relation",
      avatar: "AC",
    },
    {
      name: "Emma Rodriguez",
      role: "Responsable Produit",
      bio: "Stratège produit axée sur l'expérience utilisateur et la conversion",
      avatar: "ER",
    },
    {
      name: "James Wilson",
      role: "Responsable des Partenariats",
      bio: "Plus de 10 ans à connecter les étudiants aux opportunités de carrière",
      avatar: "JW",
    },
  ];
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Rencontrez Notre Équipe
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Des individus talentueux qui travaillent ensemble pour transformer la
          découverte de carrière.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="text-center bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
              <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-lg">
                  {member.avatar}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-secondary mb-3">
                {member.role}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
