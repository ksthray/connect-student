"use client";

import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Tech Startup",
    content:
      "Student Connect helped me find my dream internship. The matching algorithm is incredible - I got connected with exactly the right opportunities.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Manager",
    company: "Global Corp",
    content:
      "We posted a junior position and received 50+ applications from quality candidates in just two weeks. Best investment in recruitment.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Business Student",
    company: "University",
    content:
      "The platform is so user-friendly and the notifications helped me land my ideal training program. Highly recommended!",
    avatar: "ER",
    rating: 5,
  },
];

export default function Testimonials() {
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full linear-premiere flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
