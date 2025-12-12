"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    setLoading(true);

    try {
      // Simulation d’un appel API pour l’inscription à la newsletter
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubmitted(true);
      setEmail("");

      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Erreur lors de l’inscription à la newsletter :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icône */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 linear-premiere rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Reste informé
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Abonne-toi à notre newsletter et reçois les dernières offres d’emploi,
          stages et opportunités directement dans ta boîte mail.
        </p>

        {/* Formulaire Newsletter */}
        {!submitted ? (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Entre ton adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 h-12 px-4"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="linear-premiere text-white font-semibold h-12 px-8 rounded-lg whitespace-nowrap">
              {loading ? "Inscription en cours..." : "S’abonner"}
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-3 text-green-600 bg-green-50 px-6 py-4 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Merci pour ton inscription !</span>
          </div>
        )}

        {/* Note de confidentialité */}
        <p className="text-sm text-muted-foreground mt-6">
          Nous respectons ta vie privée. Désabonne-toi à tout moment.
        </p>
      </div>
    </section>
  );
}
