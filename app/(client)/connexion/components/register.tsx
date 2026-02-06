// src/app/connexion/components/Register.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

// Vos schémas Zod
import { registerSchema, RegisterInput } from "@/schemas/candidate/auth";

// Composants Shadcn/UI/Custom
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { E164Number } from "@/entities/types";
import api from "@/services/api";
import { toast } from "sonner";
// import api from "@/services/api"; // Assurez-vous d'importer votre instance API

interface RegisterProps {
  onSuccess: (email: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullname: "", email: "", phone: "" },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      // REMPLACEZ la simulation par votre appel API réel
      const res = await api.post(`/candidate/auth/register`, data);
      return res.data;
    },
    onSuccess: (response, variables) => {
      if (response.state) {
        onSuccess(variables.email);
        toast.success(response.message);
        // Vous pouvez ajouter toast.success ici si vous voulez
      }
    },
    onError: (err) => {
      // CORRECTION: Type l'erreur pour accéder à la réponse
      console.error(err);
      // Exemple de gestion d'erreur réelle
      // toast.error(err.response?.data?.message || "Échec de l'inscription.");
    },
  });

  function onSubmit(values: RegisterInput) {
    registerMutation.mutate(values);
  }

  const isPending = registerMutation.isPending;

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)}>
        <FormField
          control={registerForm.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Nom Complet</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Votre nom et prénom"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="exemple@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <PhoneInput
                  international
                  value={field.value as E164Number | undefined}
                  onChange={field.onChange}
                  defaultCountry={"CD"}
                  id="tel"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full linear-premiere text-white">
          {isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Créer le compte"
          )}
        </Button>
      </form>
    </Form>
  );
};
