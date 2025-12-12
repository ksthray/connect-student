/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff, Loader } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/store";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Le mot de passe doit dépasser plus de 6 caractères",
  }),
});

export default function Page() {
  const isLogged = useAuthStore((state) => state.isLogged);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setshowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async (state: { email: string; password: string }) => {
      const res = await api.post(`/admin/login`, state);
      if (res.data.state) {
        router.push("/panel-admin/dashboard"); // Rediriger après connexion
      }

      return res.data;
    },
    onSuccess: (response) => {
      if (response.state) {
        const admin = response.user;
        const token = response.token;
        isLogged(admin, token);
        toast.success(response.message);
      }
    },
    onError: (err: any) => {
      // toast.error("Connexion échouée!");
      console.log(err);
      toast.error(err.response.data.message);
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    mutation.mutate({ email: values.email, password: values.password });
  }

  return (
    <div
      style={{ backgroundImage: `url(/images/register.jpg)` }}
      className="min-h-screen bg-cover bg-center">
      <div className="w-full min-h-screen bg-black/60 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-premiere rounded-full w-16 h-16 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Panel administrateur
              </CardTitle>
              <CardDescription className="text-gray-600">
                Connect Student
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Ex: your@email.com"
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
                  <Button type="submit" className="w-full cursor-pointer">
                    {mutation.isPending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
