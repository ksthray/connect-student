"use client";

import { Button } from "@/components/ui/button";
import { socials_networks } from "@/services/helpers";
import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SocialNetwork = () => {
  return (
    <div>
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 linear-premiere rounded-full flex items-center justify-center shrink-0">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Délais de Réponse Rapides
                </h3>
                <p className="text-lg text-muted-foreground">
                  Nous comprenons que votre temps est précieux. Notre équipe
                  privilégie une réponse rapide aux demandes, généralement dans
                  un délai de 1 à 2 jours ouvrables. Pour les problèmes
                  techniques urgents, nous répondons encore plus rapidement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Réseaux Sociaux */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Suivez-nous
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Restez informé des dernières nouvelles et opportunités sur nos
            réseaux sociaux.
          </p>

          <div className="flex justify-center gap-12 flex-wrap">
            {socials_networks.map((social, index) => (
              <Link key={index} href={social.url} target="_blank" className="hover:text-premiere hover:translate-y-[-5px] transition-all duration-300">
                <Image src={social.icon} alt={social.name} width={400} height={24} className="w-12" />
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 linear-deuxieme relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Vous Avez Encore des Questions ?
          </h2>
          <p className="text-lg md:text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto">
            Remplissez le formulaire de contact ci-dessus et nous vous
            répondrons dans les plus brefs délais. Nous sommes là pour vous
            aider !
          </p>

          <Button className="bg-white text-primary hover:bg-blue-50 text-base px-8 h-12 rounded-lg font-semibold">
            <Link href="https://wa.me/+243854487045" target="_blank" className="flex items-center gap-2">
              Écrivez-nous sur Whatsapp
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SocialNetwork;
