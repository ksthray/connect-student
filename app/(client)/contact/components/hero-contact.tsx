"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroContact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Courriel",
      description: "Nous vous répondrons dans les 24 heures",
      value: "contact@connect-student.com",
      href: "mailto:contact@connect-student.com",
      type: "link",
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Lun-Ven, 8h30 - 16h30",
      value: "+243 854 487 045",
      href: "tel:+243854487045",
      type: "link",
    },
    {
      icon: MapPin,
      title: "Bureau",
      description: "Visitez-nous à Kinshasa",
      value: "Avenue OUA, N°01, Quartier Basoko, Commune de Ngaliema, Kinshasa – République Démocratique du Congo",
      href: null,
      type: "text",
    },
    {
      icon: Clock,
      title: "Délai de Réponse",
      description: "Chaque message reçoit une réponse dans un délai de 24 à 48 heures ouvrables, selon la nature de la demande",
      value: "Rapide & Fiable",
      href: null,
      type: "text",
    },
  ];
  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Prenez{" "}
            <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
              Contact
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Vous avez une question, une proposition de partenariat ou besoin d’assistance ?
            L’équipe Connect Student est à votre écoute.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Coordonnées
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Plusieurs façons de nous joindre. Choisissez celle qui vous convient
            le mieux.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={idx}
                  className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
                  <div className="w-12 h-12 linear-premiere rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {method.description}
                  </p>
                  {method.type === "link" ? (
                    <Link
                      href={method.href || "#"}
                      className="text-black font-semibold hover:text-premiere transition-colors block">
                      {method.value}
                    </Link>
                  ) : (
                    <p className="text-foreground font-semibold">
                      {method.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroContact;
