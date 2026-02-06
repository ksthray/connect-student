"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Send } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  type: z.string({
    required_error: "Veuillez sélectionner un type de demande.",
  } as any),
  subject: z.string().min(5, {
    message: "Le sujet doit contenir au moins 5 caractères.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
});

type DataPost = {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
}

const FormContact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      type: "general",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (state: DataPost) => {
      const res = await api.post(`/candidate/message`, state);

      return res.data;
    },
    onSuccess: (response) => {
      if (response.state) {
        toast.success(response.message);
      }
    },
    onError: (err: any) => {
      // toast.error("Connexion échouée!");
      console.log(err);
      toast.error(err.response.data.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const departments = [
    {
      name: "Équipe Connect Student",
      description: "Pour les étudiants, entreprises et centres de formation",
      email: "contact@conntec-student.com",
      icon: "💼",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        {/* Formulaire de Contact */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Envoyez-nous un Message
          </h2>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Nom */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Nom Complet
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre nom complet"
                          className="border-2 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Courriel */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Adresse E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre.email@exemple.com"
                          className="border-2 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type de Demande */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Type de Demande
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-11 px-4 rounded-lg border-2 border-input text-foreground bg-white focus:outline-none focus:border-secondary transition-colors">
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">
                            Demande Générale
                          </SelectItem>
                          <SelectItem value="student">
                            Support Étudiant
                          </SelectItem>
                          <SelectItem value="company">
                            Entreprise/Centre de Formation
                          </SelectItem>
                          <SelectItem value="technical">
                            Problème Technique
                          </SelectItem>
                          <SelectItem value="partnership">Partenariat</SelectItem>
                          <SelectItem value="feedback">Commentaires</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sujet */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Sujet
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="De quoi s'agit-il ?"
                          className="border-2 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dites-nous en plus sur votre demande..."
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border-2 border-input text-foreground bg-white focus:outline-none focus:border-secondary transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bouton d'Envoi */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full linear-premiere text-white hover:opacity-90 h-12 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : mutation.isSuccess ? (
                      <>✓ Message Envoyé !</>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le Message
                      </>
                    )}
                  </Button>
                </div>

                {mutation.isSuccess && (
                  <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
                    Merci ! Nous avons bien reçu votre message et vous répondrons
                    bientôt.
                  </div>
                )}

                {mutation.isError && (
                  <div className="p-4 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                    Une erreur est survenue lors de l'envoi du message. Veuillez
                    réessayer plus tard.
                  </div>
                )}
              </form>
            </Form>
          </div>
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
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{dept.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {dept.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {dept.description}
                </p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-black font-semibold text-sm hover:text-premiere transition-colors inline-flex items-center gap-2"
                >
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
