"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { useJobOpportunities } from "@/hooks/useJobOpportunities";
import Link from "next/link";
import { JobCard } from "../ui/job-card";

export default function OffresSection() {
  const { jobs, isLoading } = useJobOpportunities({
    page: 1,
  });

  return (
    <section className="py-24 bg-gray-50" id="offres">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Offres & Opportunités
        </motion.h2>

        <p className="text-gray-600 mb-12">
          Offres d’emploi, stage académique ou professionnel et formation
        </p>

        {/* Légende des catégories */}
        <div className="w-full flex flex-wrap justify-center gap-3 md:gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-700 rounded-full"></span>{" "}
            Formation
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-700 rounded-full"></span> Stage
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-700 rounded-full"></span> Emploi
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-700 rounded-full"></span>{" "}
            Événement
          </div>
        </div>

        {/* Grille des offres */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {!isLoading ? (
            jobs.map((offer) => <JobCard key={offer.id} offer={offer} />)
          ) : (
            <>
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} className="w-full h-72" />
              ))}
            </>
          )}
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <Button
            asChild
            variant="outline"
            className=" text-premiere border-premiere hover:bg-white/80">
            <Link href={"/offres"}>Voir plus d’offres →</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
