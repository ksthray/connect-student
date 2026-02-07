"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

const Faq = () => {
  const faqs = [
    {
      question: "Combien coûte la publication d'une opportunité ?",
      answer:
        "Notre tarification est flexible et évolue avec vos besoins. Nous proposons des abonnements mensuels allant du niveau d'entrée au niveau entreprise. Contactez notre équipe commerciale pour une tarification détaillée basée sur votre volume de recrutement.",
    },
    {
      question: "Pouvons-nous publier plusieurs opportunités ?",
      answer:
        "Oui ! Tous nos forfaits incluent la publication illimitée d'opportunités. Publiez autant d'emplois, de stages et de programmes de formation que vous le souhaitez.",
    },
    {
      question: "Combien de temps faut-il pour recevoir des candidatures ?",
      answer:
        "Dès que votre opportunité est en ligne, les candidats appariés commenceront à postuler dans les 24 à 48 heures. Notre algorithme met en relation en permanence de nouveaux candidats à mesure qu'ils rejoignent la plateforme.",
    },
    {
      question: "Quelle est la qualité des candidats sur Connect Student ?",
      answer:
        "Tous les candidats sur notre plateforme ont des informations éducatives vérifiées et des profils de compétences détaillés. Notre algorithme de mise en relation garantit que vous recevez des candidatures de candidats dont les qualifications correspondent à vos exigences.",
    },
    {
      question: "Pouvons-nous communiquer directement avec les candidats ?",
      answer:
        "Pour l'instant NON ! Mais très bientôt nous allons mettre en place un système de messagerie intégré qui permettra une communication directe avec les candidats. Vous pouvez également planifier des entretiens et suivre l'historique des communications.",
    },
    {
      question: "Y a-t-il un engagement ou un contrat ?",
      answer:
        "Aucun contrat à long terme n'est requis. Abonnez-vous de mois en mois et annulez à tout moment. Nous sommes convaincus que vous aimerez les résultats.",
    },
  ];
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Foire Aux Questions
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16">
          Des questions ? Nous avons les réponses.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="bg-white rounded-xl border border-border hover:shadow-md transition-all cursor-pointer group">
              <summary className="flex items-center justify-between p-6 font-semibold text-foreground hover:text-premiere transition-colors">
                <span>{faq.question}</span>
                <span className="group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
