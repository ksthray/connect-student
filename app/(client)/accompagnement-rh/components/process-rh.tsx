"use client";

import React from "react";

const ProcessRh = () => {
    const steps = [
        {
            number: "01",
            title: "Prise de contact",
            description:
                "Vous contactez Connect Student par e-mail afin de nous présenter votre besoin en recrutement (poste, profil recherché, délais, contraintes spécifiques).",
        },
        {
            number: "02",
            title: "Présélection des candidats",
            description:
                "À partir de la base de données Connect Student, notre équipe procède à la présélection de candidats correspondant aux critères définis.",
        },
        {
            number: "03",
            title: "Entretiens et évaluations",
            description:
                "Nous organisons des entretiens et des interviews afin d’analyser les profils, les compétences et le potentiel des candidats présélectionnés.",
        },
        {
            number: "04",
            title: "Sélection des profils adaptés",
            description:
                "À l’issue du processus, nous vous proposons les profils les plus adaptés au poste à pourvoir, afin de faciliter votre prise de décision finale.",
        },
    ];

    return (
        <section className="py-20 bg-linear-to-b from-primary/5 to-secondary/5">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Comment fonctionne l’accompagnement RH ?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Un processus simple et transparent en 4 étapes
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-6 p-6 md:p-8 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow"
                        >
                            <span className="text-5xl font-black text-blue-100/80 font-mono tracking-tighter">
                                {step.number}
                            </span>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessRh;
