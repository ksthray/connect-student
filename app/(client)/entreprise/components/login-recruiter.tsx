// src/app/connexion/components/Register.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

// Composants Shadcn/UI/Custom
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
import {
  LoginRecruiterInput,
  loginRecruiterSchema,
} from "@/schemas/recruiter/aurh";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/store";
// import api from "@/services/api"; // Assurez-vous d'importer votre instance API

export const LoginPage = () => {
  const isLogged = useAuthStore((state) => state.isLogged);

  const router = useRouter();

  const form = useForm<LoginRecruiterInput>({
    resolver: zodResolver(loginRecruiterSchema),
    defaultValues: { email: "", password: "" },
  });

  const [showPassword, setshowPassword] = useState(false);

  const recruiterMutation = useMutation({
    mutationFn: async (state: LoginRecruiterInput) => {
      // REMPLACEZ la simulation par votre appel API réel
      const { data } = await api.post(`/recruiter/auth/login`, state);
      if (data.state) {
        router.push("/recruiter/dashboard"); // Rediriger après connexion
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.state) {
        toast.success(data.message);
        if (data.state) {
          console.log("datas:", data);

          toast.success(data.message);
          const user = data.data;
          const token = data.token;
          isLogged(user, token);
          form.reset();
        }
      }
    },
    onError: (err) => {
      // CORRECTION: Type l'erreur pour accéder à la réponse
      console.error(err);
      // Exemple de gestion d'erreur réelle
      // toast.error(err.response?.data?.message || "Échec de l'inscription.");
    },
  });

  function onSubmit(values: LoginRecruiterInput) {
    recruiterMutation.mutate(values);
  }

  const isPending = recruiterMutation.isPending;

  return (
    <div className="w-full container mx-auto h-screen px-4 flex justify-center items-center">
      <div
        // style={{ backgroundImage: "url(/images/login.jpg)" }}
        className="w-full md:bg-[url(/images/login-recruiter.jpg)] bg-center bg-cover h-full md:h-[80%] rounded-2xl ">
        <div className="w-full h-full flex justify-center items-center rounded-2xl md:bg-black/30">
          <Card className=" shadow-2xl w-full max-w-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Bienvenue 👋
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Connectez-vous à votre compte entreprise
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="bg-gray-100 flex rounded-sm">
                              <Input
                                type={!showPassword ? "password" : "text"}
                                placeholder="Mot de passe"
                                className="bg-transparent w-[85%] border-none"
                                {...field}
                              />
                              <div
                                className="col-span-1 w-[15%] h-10 flex justify-center items-center rounded-r-sm cursor-pointer"
                                onClick={() => setshowPassword(!showPassword)}>
                                {showPassword ? (
                                  <Eye size={20} />
                                ) : (
                                  <EyeOff size={20} />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full linear-premiere text-white mt-4">
                      {isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Se connecter"
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
