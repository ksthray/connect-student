"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import OnboardingConvert from "../onboarding-convert";
import Link from "next/link";

const HeroSection = () => {
  const [open, setopen] = useState(false);

  return (
    <section className="relative overflow-hidden  py-20 md:py-32">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-linear-to-r from-blue-400 via-sky-300 to-blue-600 opacity-20 blur-3xl"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Bienvenue dans le futur de la mise en relation professionnelle
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Connectez-vous à votre prochaine{" "}
            <span className="text-premiere">opportunité</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto md:mx-0 mb-8">
            Trouvez l’emploi, le stage ou la formation qui vous convient. Nous
            vous mettons en relation avec des opportunités adaptées à vos
            compétences, vos centres d’intérêt et vos ambitions. Commencez votre
            parcours dès aujourd’hui.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              onClick={() => setopen(!open)}
              className="h-12 bg-premiere hover:bg-premiere-foreground cursor-pointer text-white px-6 py-3 text-lg">
              Commencer l’aventure
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-6 py-3 text-lg border-premiere text-premiere hover:bg-white/90 hover:text-premiere">
              <Link href="/offres">Explorer les offres</Link>
            </Button>
          </div>
        </div>

        {/* Image Content */}
        <div className="flex-1 relative flex justify-center md:justify-end">
          <div className="relative w-[300px] sm:w-[400px] md:w-[480px]">
            <Image
              src="/images/hero-main.png"
              alt="Student hero"
              width={480}
              height={480}
              className="rounded-2xl object-cover"
            />

            {/* Floating Cards */}
            <motion.div
              className="absolute -top-6 -left-6 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}>
              <div className="w-2 h-2 bg-premiere rounded-full" />
              <p className="text-sm text-gray-700 font-medium">
                Notification activée
              </p>
            </motion.div>

            <motion.div
              className="absolute bottom-6 -left-6 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}>
              <FileText size={32} className="text-premiere" />
              {/* <Image
                src="/icons/upload.svg"
                alt="Upload"
                width={16}
                height={16}
              /> */}
              <p className="text-sm text-gray-700 font-medium">Upload ton CV</p>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -right-4 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center flex-col gap-4 space-x-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}>
              <p className="text-sm font-semibold text-premiere">
                +1500 étudiants
              </p>
              <Image
                src="/images/users-avatars.png"
                alt="Users"
                width={400}
                height={400}
                className="w-32"
              />
            </motion.div>
          </div>
        </div>
      </div>
      <OnboardingConvert open={open} setopen={setopen} />
    </section>
  );
};

export default HeroSection;
