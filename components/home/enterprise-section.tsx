"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function EnterpriseSection() {
  const partners = [
    { name: "Vodacom RDC", offers: 17, logo: "/images/vodacom.png" },
    { name: "Orange Corners", offers: 5, logo: "/images/orange-corners.png" },
    { name: "Kadea", offers: 7, logo: "/images/kadea.png" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Image de gauche */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center">
          <div className="relative">
            <Image
              src="/images/entreprise.jpg"
              width={500}
              height={500}
              alt="Team collaboration"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
            <Card className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-md w-[85%]">
              <CardContent className="py-4 px-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Nos partenaires les plus actifs
                </h4>
                <ul className="space-y-2">
                  {partners.map((p, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={p.logo}
                          alt={p.name}
                          width={400}
                          height={400}
                          className="w-6 h-6 object-contain rounded-full"
                        />
                        <span className="text-gray-700 text-sm">{p.name}</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {p.offers} offres publiées
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Texte de droite */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Vous êtes une entreprise ou un centre de formation ?
          </h2>
          <p className="text-gray-600 mb-6">
            Publiez vos offres d’emploi, de stage et de formation directement
            sur Connect Student. Touchez des milliers d’étudiants et de jeunes
            diplômés motivés, activement à la recherche d’opportunités.
          </p>

          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-premiere" size={20} />
              <span>
                Accédez à un vivier de talents composés d’étudiants
                présélectionnés
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-premiere" size={20} />
              <span>Simplifiez votre processus de recrutement</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-premiere" size={20} />
              <span>Réduisez considérablement votre délai d’embauche</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-premiere" size={20} />
              <span>Entrez en contact avec des candidats de qualité</span>
            </li>
          </ul>

          <Button className="bg-premiere hover:bg-premiere-foreground text-white rounded-md px-6 py-5 text-base">
            <Link href={"/entreprise"}>Publier une offre</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
