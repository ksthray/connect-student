"use client";

import Image from "next/image";
import React from "react";

const History = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Notre Histoire
        </h2>
        <div className="space-y-6 text-lg text-muted-foreground text-left leading-relaxed">
          <p>
            Connect Student est née de l’ambition de créer des solutions concrètes pour les étudiants et
            les jeunes diplômés. Après 10 mois de formation, d’incubation et d’accélération au sein du
            programme Orange Corners RDC, notre startup a franchi une étape majeure de son
            parcours entrepreneurial.
          </p>
          <p>
            Le 15 janvier 2026, notre Fondateur & CEO, Exaucé Mabiala (Mr Barox), a reçu son
            certificat d’entrepreneur lors du Demo Day organisé à la résidence de l’Ambassadrice du
            Royaume des Pays-Bas, aux côtés de Son Excellence Madame l’Ambassadrice Angèle
            Samura et de nombreux invités d’honneur.
          </p>
          <p>
            Cette reconnaissance a été rendue possible grâce au programme WE ACT, initié par
            Rawbank via son produit Academia, qui accompagne les jeunes et les startups dans le
            renforcement de leurs compétences et la structuration de leur modèle économique.
          </p>
          <div>
            <p>
              Grâce à ce parcours, Connect Student a pu :
            </p>
            <ul className="list-disc pl-4">
              <li>Structurer sa vision, du prototype à la finalisation de sa startup.</li>
              <li>Renforcer son modèle économique et affiner ses solutions.</li>
              <li>Confirmer son impact auprès des étudiants et jeunes diplômés.</li>
            </ul>
          </div>
          <div>
            <p>
              Chez Connect Student, nous croyons qu’une entreprise se construit avec :
            </p>
            <ul className="list-disc pl-4">
              <li>Une vision claire.</li>
              <li>Un engagement constant.</li>
              <li>Une réponse concrète à un besoin réel.</li>
            </ul>
          </div>
          <p>
            Nous avançons aujourd’hui avec plus de clarté, de responsabilité et d’ambition pour
            connecter les étudiants à leurs prochaines opportunités.
          </p>
          <p>
            Nous remercions sincèrement WE ACT, Academia, Rawbank, Orange Corners RDC,
            Ingenious City, l’Ambassade du Royaume des Pays-Bas et Bralima S.A. pour leur soutien et
            leur confiance tout au long de notre parcours.
          </p>
          <p>
            Avec Connect Student, connectez-vous à votre prochaine opportunité.
          </p>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {['/images/remise-2.jpg', '/images/remise-3.jpg', '/images/remise-1.jpg'].map((image, index) => (
            <div style={{ backgroundImage: `url(${image})` }} className="w-full h-64 bg-cover bg-center rounded-lg" key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default History;
