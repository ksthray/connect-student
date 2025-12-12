"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFetch } from "@/services/query";
import { JobOfferType } from "@/entities/types";
import { Skeleton } from "../ui/skeleton";
import { returnNameOfJobType } from "@/services/helpers";

export default function OffresSection() {
  const { data, isLoading } = useFetch({
    route: "/candidate/jobs",
    query: "opportunities",
  });

  const opportunities: JobOfferType[] = data?.data.jobs || [];

  function getTypeBgColor(type: string) {
    switch (type) {
      case "INTERNSHIP":
        return "bg-blue-100";
      case "FULL_TIME":
        return "bg-green-100";
      case "PART_TIME":
        return "bg-purple-100";
      case "EVENT":
        return "bg-orange-100";
      case "CONFERENCE":
        return "bg-teal-100";
      case "TRAINING":
        return "bg-cyan-100";
      default:
        return "bg-gray-300";
    }
  }

  const handleApply = (offerId: string, title: string) => {
    console.log(`Applied to offer ${offerId}: ${title}`);
    // TODO: Implement apply functionality
  };

  const handleShare = (offerId: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Student Connect",
        text: `Check out this opportunity: ${title}`,
        url: window.location.href,
      });
    } else {
      console.log(`Share offer ${offerId}: ${title}`);
      // Fallback for browsers that don't support Web Share API
    }
  };

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
            opportunities.map((offer) => (
              <div
                key={offer.id}
                className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={offer.coverImage as string}
                    alt={offer.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getTypeBgColor(
                        offer.type
                      )} font-semibold text-sm`}>
                      {returnNameOfJobType(offer.type)}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {offer.title}
                  </h3>

                  {/* Company Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <Image
                      src={offer.company.logo}
                      width={400}
                      height={400}
                      className="w-16 "
                      alt={offer.company.companyName}
                    />
                    {/* <span className="text-sm font-semibold text-foreground">
                      {offer.company.companyName}
                    </span> */}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {offer.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApply(offer.slug, offer.title)}
                      className="flex-1 linear-premiere text-white font-semibold h-10 rounded-lg hover:opacity-90">
                      Apply Now
                    </Button>
                    <Button
                      onClick={() => handleShare(offer.slug, offer.title)}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-2">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
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
            variant="outline"
            className=" text-premiere border-premiere hover:bg-white/80">
            Voir plus d’offres →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
