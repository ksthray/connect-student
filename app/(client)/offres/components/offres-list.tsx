"use client";

import { useState } from "react";
import { Briefcase, Code2, BookOpen, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const offers = [
  {
    id: 1,
    type: "Internship",
    title: "Frontend Developer Internship",
    company: "TechVision Labs",
    logo: "TV",
    description:
      "Join our team to work on cutting-edge web applications. We're looking for passionate developers eager to learn and grow.",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    type: "Job",
    title: "Senior Product Manager",
    company: "InnovateCorp",
    logo: "IC",
    description:
      "Lead the vision and strategy for our flagship product. Ideal for experienced product managers with a track record.",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    type: "Training",
    title: "Advanced Data Science Bootcamp",
    company: "DataAcademy Pro",
    logo: "DP",
    description:
      "Master data science, machine learning, and analytics with hands-on projects. Certificate upon completion.",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    type: "Event",
    title: "Tech Career Summit 2024",
    company: "CareerConnect Events",
    logo: "CC",
    description:
      "Network with industry leaders, attend workshops, and discover your next opportunity. Join 500+ professionals.",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    color: "from-orange-500 to-red-500",
  },
];

export default function OffresList() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Internship":
        return <Briefcase className="w-4 h-4" />;
      case "Job":
        return <Code2 className="w-4 h-4" />;
      case "Training":
        return <BookOpen className="w-4 h-4" />;
      case "Event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case "Internship":
        return "bg-blue-100 text-blue-700";
      case "Job":
        return "bg-purple-100 text-purple-700";
      case "Training":
        return "bg-green-100 text-green-700";
      case "Event":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApply = (offerId: number, title: string) => {
    console.log(`Applied to offer ${offerId}: ${title}`);
    // TODO: Implement apply functionality
  };

  const handleShare = (offerId: number, title: string) => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(offers.length / perPage);

  const currentOffres = offers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-start gap-6 mb-10 text-sm">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <Image
                  src={offer.coverImage}
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
                    {getTypeIcon(offer.type)}
                    {offer.type}
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
                  <div
                    className={`w-10 h-10 bg-linear-to-br ${offer.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">
                      {offer.logo}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {offer.company}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {offer.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApply(offer.id, offer.title)}
                    className="flex-1 linear-premiere text-white font-semibold h-10 rounded-lg hover:opacity-90">
                    Apply Now
                  </Button>
                  <Button
                    onClick={() => handleShare(offer.id, offer.title)}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}>
            ← Précédent
          </Button>
          <span className="text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}>
            Suivant →
          </Button>
        </div>
      </div>
    </section>
  );
}
