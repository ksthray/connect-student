"use client";

import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HeroRhProps {
    onOpenModal: () => void;
}

const HeroRh = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* Background with gradient - similar to other pages */}
            <div className="absolute inset-0 bg-linear-to-b from-blue-50/50 via-white to-white -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                        Recrutez les bons talents, <br />
                        <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
                            avec méthode et sérénité
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Le recrutement est un enjeu stratégique. Connect Student accompagne les
                        entreprises qui souhaitent identifier, évaluer et sélectionner des
                        talents adaptés à leurs besoins, tout en optimisant leur temps et leurs
                        ressources.
                    </p>

                    <div className="flex justify-center pt-4">

                        <Button
                            asChild
                            className="md:w-max linear-premiere text-white text-base px-8 h-12 hover:opacity-90 rounded-lg">
                            <Link href={"mailto:contact@connect-student.com"}>
                                Contacter le service d’accompagnement RH
                                <MailIcon className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroRh;
