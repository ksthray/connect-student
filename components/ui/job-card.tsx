"use client";

import { JobOfferType } from "@/entities/types";
import {
  getActionText,
  getTypeBgColor,
  getTypeTextColor,
  returnNameOfJobType,
} from "@/services/helpers";
import Image from "next/image";
import React, { useCallback } from "react";
import { Button } from "./button";
import { Share2 } from "lucide-react";
import Link from "next/link";

export const JobCard = ({ offer }: { offer: JobOfferType }) => {
  const url = `https://connect-student.com/offres/${offer.slug}`;

  const handleNativeShare = useCallback(() => {
    // Vérifie si l'API Web Share est supportée
    navigator
      .share({
        title: offer.title,
        url: url,
      })
      .then(() => console.log("Partage réussi"))
      .catch((error) => console.error("Erreur de partage:", error));
  }, [offer.title, url]);

  return (
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
            )} ${getTypeTextColor(offer.type)} font-semibold text-sm`}>
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
            asChild
            className="flex-1 linear-premiere text-white font-semibold h-10 rounded-lg hover:opacity-90">
            <Link href={`/offres/${offer.slug}`}>
              {" "}
              Voir & {getActionText(offer.type)}
            </Link>
          </Button>
          <Button
            onClick={handleNativeShare}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-2">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
