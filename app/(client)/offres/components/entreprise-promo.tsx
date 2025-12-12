"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EntreprisePromo() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Entreprises & Centres de formation :
          <span className="text-blue-500">
            {" "}
            rejoignez le réseau Student Connect
          </span>
        </motion.h2>

        <p className="text-gray-600 mb-8">
          Accédez à une plateforme où des milliers d’étudiants et jeunes
          diplômés cherchent activement leur prochaine opportunité.
        </p>

        <div className="flex flex-col items-center gap-3 mb-10 text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20} />
            <span>
              Publiez facilement vos offres d’emploi, de stage ou de formation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20} />
            <span>Renforcez votre visibilité auprès des jeunes talents</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20} />
            <span>
              Collaborez avec des institutions et programmes partenaires
            </span>
          </div>
        </div>

        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-5 text-base shadow-md">
          Publier une offre maintenant
        </Button>
      </div>
    </section>
  );
}
