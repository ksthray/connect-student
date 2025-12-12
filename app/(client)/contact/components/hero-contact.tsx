"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const HeroContact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Courriel",
      description: "Nous vous répondrons dans les 24 heures",
      value: "hello@studentconnect.com",
      href: "mailto:hello@studentconnect.com",
      type: "link",
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Lun-Ven, 9h-18h HNE",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      type: "link",
    },
    {
      icon: MapPin,
      title: "Bureau",
      description: "Visitez-nous à San Francisco",
      value: "123 Tech Street, San Francisco, CA 94103",
      href: null,
      type: "text",
    },
    {
      icon: Clock,
      title: "Délai de Réponse",
      description: "Habituellement dans un délai de 1 à 2 jours ouvrables",
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
            Vous avez des questions ou des commentaires ? Nous serions ravis de
            vous entendre. Notre équipe est là pour vous aider et vous répondra
            dans les plus brefs délais.
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
                    <a
                      href={method.href || "#"}
                      className="text-secondary font-semibold hover:text-primary transition-colors block">
                      {method.value}
                    </a>
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
