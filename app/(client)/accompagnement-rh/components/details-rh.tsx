"use client";

import { AlertCircle, FileText, CheckCircle, Wallet } from "lucide-react";
import React from "react";

const DetailsRh = () => {
    const details = [
        {
            icon: AlertCircle,
            title: "Modalités de l’accompagnement RH",
            description:
                "Le service d’accompagnement RH est fourni sur demande de l’entreprise.",
        },
        {
            icon: Wallet,
            title: "Facturation",
            description:
                "La facturation est effectuée par service d’accompagnement RH, en fonction des besoins exprimés.",
        },
        {
            icon: FileText,
            title: "Gestion du processus",
            description:
                "L’ensemble du processus est géré par le département commercial de Connect Student.",
        },
        {
            icon: CheckCircle,
            title: "Décision finale",
            description:
                "Connect Student accompagne le processus de recrutement sans se substituer à la décision finale, laquelle reste exclusivement du ressort de l’entreprise.",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="linear-deuxieme rounded-3xl p-8 md:p-12 lg:p-16 text-white overflow-hidden relative">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            Informations Importantes
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {details.map((detail, idx) => {
                                const Icon = detail.icon;
                                return (
                                    <div key={idx} className="flex gap-5">
                                        <div className="shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-blue-700">
                                            <Icon className="w-6 h-6 text-premiere" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-white">
                                                {detail.title}
                                            </h3>
                                            <p className="text-white/80 leading-relaxed">
                                                {detail.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailsRh;
