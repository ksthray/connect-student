"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const FaqRh = () => {
    const faqs = [
        {
            question: "À qui s’adresse l’accompagnement RH ?",
            answer:
                "Ce service est destiné aux entreprises souhaitant recruter des étudiants, des jeunes diplômés ou des profils adaptés à leurs besoins.",
        },
        {
            question: "Comment demander un accompagnement RH ?",
            answer:
                "Les demandes se font uniquement par e-mail auprès de l’équipe commerciale de Connect Student.",
        },
        {
            question: "Le service est-il obligatoire pour publier une offre ?",
            answer:
                "Non. La publication d’offres reste gratuite et indépendante du service d’accompagnement RH.",
        },
        {
            question: "Comment est fixé le coût de l’accompagnement ?",
            answer: (
                <div className="space-y-2">
                    <p>
                        L’accompagnement RH est un service unique qui englobe l’ensemble du
                        processus de recrutement.
                    </p>
                    <p>
                        La facturation est établie sur demande, en fonction de vos besoins
                        spécifiques, et se fait exclusivement par appel avec notre équipe
                        commerciale.
                    </p>
                </div>
            ),
        },
        {
            question: "Qui prend la décision finale de recrutement ?",
            answer: (
                <div className="space-y-2">
                    <p>La décision finale appartient exclusivement à l’entreprise.</p>
                    <p>
                        Connect Student intervient uniquement comme prestataire accompagnateur
                        du processus de recrutement.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    Questions fréquentes (FAQ)
                </h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, idx) => (
                        <AccordionItem
                            key={idx}
                            value={`item-${idx}`}
                            className="bg-white border text-foreground border-gray-200 rounded-xl px-6"
                        >
                            <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FaqRh;
