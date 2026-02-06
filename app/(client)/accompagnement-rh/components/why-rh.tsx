"use client";

import { Target, Clock, Search, Handshake } from "lucide-react";
import React from "react";

const WhyRh = () => {
    const features = [
        {
            icon: Target,
            title: "Un recrutement ciblé et structuré",
            description:
                "Accédez à des profils qualifiés issus de notre base de données d’étudiants et de jeunes diplômés, sélectionnés selon les exigences de votre poste.",
        },
        {
            icon: Clock,
            title: "Gain de temps et efficacité",
            description:
                "Nous prenons en charge les étapes clés du processus afin de vous permettre de vous concentrer sur votre cœur d’activité.",
        },
        {
            icon: Search,
            title: "Analyse approfondie des profils",
            description:
                "Chaque candidat est évalué sur la base de ses compétences, de son parcours et de son adéquation avec le poste à pourvoir.",
        },
        {
            icon: Handshake,
            title: "Accompagnement professionnel",
            description:
                "Notre équipe vous accompagne tout au long du processus, avec une approche rigoureuse et orientée résultats.",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Pourquoi choisir l’accompagnement RH de Connect Student ?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Une expertise dédiée pour optimiser vos recrutements
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl linear-premiere flex items-center justify-center mb-6 transition-colors duration-300">
                                    <Icon className="w-7 h-7 text-white group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyRh;
