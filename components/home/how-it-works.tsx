"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Search, Briefcase } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <GraduationCap className="w-10 h-10 text-premiere" />,
      title: "Crée ton profil étudiant",
      description:
        "Complète ton profil avec tes compétences, ton parcours et tes centres d’intérêt pour que les recruteurs puissent te trouver facilement.",
      delay: 0.2,
    },
    {
      icon: <Search className="w-10 h-10 text-premiere" />,
      title: "Explore les offres disponibles",
      description:
        "Découvre des stages, emplois et formations adaptés à ton profil, filtrés selon tes ambitions et ta localisation.",
      delay: 0.4,
    },
    {
      icon: <Briefcase className="w-10 h-10 text-premiere" />,
      title: "Connecte-toi et postule facilement",
      description:
        "Postule directement depuis la plateforme et commence à construire ton avenir professionnel dès aujourd’hui.",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Comment fonctionne{" "}
          <span className="text-premiere">Connect Student</span> ?
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          3 étapes simples pour connecter les étudiants aux meilleures
          opportunités.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.delay, duration: 0.6 }}>
              <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
