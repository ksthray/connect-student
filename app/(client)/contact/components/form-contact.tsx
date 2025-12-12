"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";
import React, { useState } from "react";

const FormContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "general",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); // 'inactif' | 'chargement' | 'succès' | 'erreur'

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const departments = [
    {
      name: "Équipe Connect Student",
      description: "Pour les étudiants, entreprises et centres de formation",
      email: "contact@conntec-student.com",
      icon: "💼",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        type: "general",
        message: "",
      });

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    }, 1500);
  };
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        {/* Formulaire de Contact */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Envoyez-nous un Message
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 border border-border">
            <div className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nom Complet
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom complet"
                  required
                  className="border-2 h-11"
                />
              </div>

              {/* Courriel */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Adresse E-mail
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre.email@exemple.com"
                  required
                  className="border-2 h-11"
                />
              </div>

              {/* Type de Demande */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Type de Demande
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-lg border-2 border-input text-foreground bg-white focus:outline-none focus:border-secondary transition-colors">
                  <option value="general">Demande Générale</option>
                  <option value="student">Support Étudiant</option>
                  <option value="company">
                    Entreprise/Centre de Formation
                  </option>
                  <option value="technical">Problème Technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="feedback">Commentaires</option>
                </select>
              </div>

              {/* Sujet */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Sujet
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="De quoi s'agit-il ?"
                  required
                  className="border-2 h-11"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Dites-nous en plus sur votre demande..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-input text-foreground bg-white focus:outline-none focus:border-secondary transition-colors resize-none"
                />
              </div>

              {/* Bouton d'Envoi */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full linear-premiere text-white hover:opacity-90 h-12 rounded-lg font-semibold flex items-center justify-center gap-2">
                  {submitStatus === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : submitStatus === "success" ? (
                    <>✓ Message Envoyé !</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le Message
                    </>
                  )}
                </Button>
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
                  Merci ! Nous avons bien reçu votre message et vous répondrons
                  bientôt.
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Départements */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Départements
          </h2>

          <div className="space-y-4">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">{dept.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {dept.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {dept.description}
                </p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-secondary font-semibold text-sm hover:text-primary transition-colors inline-flex items-center gap-2">
                  {dept.email}
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormContact;
