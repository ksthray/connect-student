// src/app/connexion/components/Login.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

// Vos schémas Zod
import { sendOtpSchema, SendOtpInput } from "@/schemas/candidate/auth";

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
import api from "@/services/api";
import { toast } from "sonner";
// import api from "@/services/api"; // Assurez-vous d'importer votre instance API

interface LoginProps {
  onSuccess: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const loginForm = useForm<SendOtpInput>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: "" },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      // REMPLACEZ la simulation par votre appel API réel
      const res = await api.post(`/candidate/auth/login`, { email });
      return res.data;
    },
    onSuccess: (data, email) => {
      if (data.state) {
        onSuccess(email);
        toast.success(data.message);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  function onSubmit(values: SendOtpInput) {
    sendOtpMutation.mutate(values.email);
  }

  const isPending = sendOtpMutation.isPending;

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)}>
        <FormField
          control={loginForm.control}
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
        <Button
          type="submit"
          disabled={isPending}
          className="w-full linear-premiere text-white">
          {isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Continuer (Envoyer OTP)"
          )}
        </Button>
      </form>
    </Form>
  );
};
