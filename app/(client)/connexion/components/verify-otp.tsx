"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { ErrorAxiosType } from "@/entities/types";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { verifyOtpSchema } from "@/schemas/candidate/auth";
import { Loader } from "lucide-react";
import { useEffect } from "react";

type OTPProps = {
  email: string;
  setstep: (v: "form") => void;
  returnTo: string | null;
};

export const VerifyOTP = ({ email, setstep, returnTo }: OTPProps) => {
  const router = useRouter();
  const isLogged = useAuthStore((state) => state.isLogged);
  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  useEffect(() => {
    if (email) {
      form.reset({ email: email });
    }
  }, [email, form]);

  const mutation = useMutation({
    mutationFn: async (state: { email: string; otp: string }) => {
      const { data } = await api.post("/candidate/auth/verify", state);
      if (returnTo) {
        // Décoder et rediriger vers l'URL d'origine (ex: /offres/offre-vodacom)
        // On ajoute un paramètre 'openModal=true' pour rouvrir le modal Apply
        const decodedUrl = decodeURIComponent(returnTo);
        router.push(`${decodedUrl}?openModal=true`);
      } else {
        // Si 'returnTo' est vide, rediriger vers la page de profil par défaut
        router.push("/user/dashboard");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.state) {
        toast.success(data.message);
        const user = data.data;
        const token = data.token;
        isLogged(user, token);
        form.reset();
      }
    },
    onError: (error: ErrorAxiosType) => {
      toast.error(error.response.data.message, {
        duration: 20000,
      });
    },
  });

  const handleLogin = form.handleSubmit((values) => {
    mutation.mutate({
      otp: values.otp,
      email: values.email,
    });
  });

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4 w-full ">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="mb-2 flex flex-col justify-center items-center">
                <FormLabel className="text-center">{"Tapez l'OTP"}</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="px-8 w-full bg-premiere"
            type="submit"
            onClick={handleLogin}>
            {mutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Valider"
            )}
          </Button>
          <div
            onClick={() => setstep("form")}
            className="underline text-center mt-4! hover:text-premiere">
            Vous n&apos;avez pas reçu le code ? Renvoyer
          </div>
        </form>
      </Form>
    </div>
  );
};
