/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation d'appel API (Remplace ceci par ton vrai appel axios/fetch)
      const res = await api.post("/candidate/newsletter", { email });
      if (res.data.state) {
        toast.success("Merci ! Vous êtes bien inscrit à notre newsletter.");
      }

      setEmail(""); // Reset du champ
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Entre ton adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 h-12 px-4"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="linear-premiere text-white font-semibold h-12 px-8 rounded-lg whitespace-nowrap">
            {isLoading ? <Loader2 className="animate-spin" /> : "S’abonner"}
          </Button>
        </form>

        {/* Note de confidentialité */}
        <p className="text-sm text-muted-foreground mt-6">
          Nous respectons ta vie privée. Désabonne-toi à tout moment.
        </p>
      </div>
    </section>
  );
}
