"use client";

import { TestimonyType } from "@/entities/types";
import { defaultImage } from "@/services/helpers";
import { useFetch } from "@/services/query";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
  const { data, isLoading } = useFetch({
    route: "/candidate/testimonials",
    query: "testimonials",
  });

  const testimonials: TestimonyType[] = data?.data || [];
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 ">
          Témoignages
        </motion.h2>
        <p className="text-center mb-10 mt-5">
          Des témoignages authentiques d&apos;étudiants et d&apos;entreprises
          ayant connu le succès grâce à Connect Student.
        </p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {!isLoading
            ? testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &quot;{testimonial.comment}&quot;
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={
                          testimonial.photo ? testimonial.photo : defaultImage
                        } // Placeholder (remplacez par votre image locale)
                        alt={testimonial.fullname}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.fullname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.post} •
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : "Chargement..."}
        </div>
      </div>
    </section>
  );
}
