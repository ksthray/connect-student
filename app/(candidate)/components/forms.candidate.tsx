/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, User } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";

import type { ErrorAxiosType, MyProfilType } from "@/entities/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export const LEVELS = ["STUDENT", "GRADUATE", "PROFESSIONAL"] as const;

function nameLevel(level: string) {
  switch (level) {
    case "STUDENT":
      return "Etudiant";
    case "GRADUATE":
      return "Diplômé";
    case "PROFESSIONAL":
      return "Professionnel";
    default:
      return "";
  }
}

const candidateSchema = z.object({
  fullname: z.string().min(6, "Insérez le nom complet"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),

  level: z.enum(LEVELS).optional(),
  university: z.string().optional(),

  city: z.string().optional(),
  commune: z.string().optional(),
  address: z.string().optional(),

  birthday: z
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 15;
    }, "Vous devez avoir au moins 15 ans"),

  about: z.string().optional(),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const FormsCandidate = ({
  myProfile,
  token,
}: {
  myProfile: MyProfilType;
  token: string;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullname: myProfile.fullname ?? "",
      email: myProfile.email ?? "",
      phone: myProfile.phone ?? undefined,
      level: (myProfile.candidateProfile?.level as any) || "STUDENT",
      university: myProfile.candidateProfile?.university ?? undefined,
      city: myProfile.candidateProfile?.city ?? undefined,
      commune: myProfile.candidateProfile?.commune ?? undefined,
      address: myProfile.candidateProfile?.address ?? undefined,
      birthday: myProfile.candidateProfile?.birthday
        ? new Date(myProfile.candidateProfile.birthday)
        : undefined,
      about: myProfile.candidateProfile?.about ?? "",
    },
  });

  const selectedLevel = useWatch({
    control: form.control,
    name: "level",
  });

  /* ------------------------------- RESET FORM ------------------------------ */

  useEffect(() => {
    if (!myProfile?.id) return;

    form.reset({
      fullname: myProfile.fullname ?? "",
      email: myProfile.email ?? "",
      phone: myProfile.phone ?? undefined,
      level: (myProfile.candidateProfile?.level as any) || "STUDENT",
      university: myProfile.candidateProfile?.university ?? undefined,

      city: myProfile.candidateProfile?.city ?? undefined,
      commune: myProfile.candidateProfile?.commune ?? undefined,
      address: myProfile.candidateProfile?.address ?? undefined,
      birthday: myProfile.candidateProfile?.birthday
        ? new Date(myProfile.candidateProfile.birthday)
        : undefined,
      about: myProfile.candidateProfile?.about ?? "",
    });
  }, [myProfile, form]);

  const mutation = useMutation({
    mutationFn: (state: any) => {
      return api.patch(`/candidate/myprofil`, state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        window.location.reload();
      }
    },
    onError: (err: ErrorAxiosType) => {
      toast.error(err.response.data.message as string);
      console.log(err);
    },
  });

  /* -------------------------------- SUBMIT -------------------------------- */

  function onSubmit(values: CandidateFormValues) {
    mutation.mutate({
      fullname: values.fullname,
      email: values.email,
      phone: values.phone || undefined,
      about: values.about || undefined,
      level: values.level || undefined, // ne pas mettre ""
      birthday: values.birthday || undefined,
      city: values.city || undefined,
      address: values.address || undefined,
      commune: values.commune || undefined,
      university: values.university || undefined,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-foreground" />
        <h2 className="text-xl font-bold text-foreground">
          Personal Information
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl">
          {/* FULLNAME */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PHONE */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry="CD"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* LEVEL */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner ou modifier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {nameLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UNIVERSITY – ONLY FOR STUDENT */}
          {myProfile.candidateProfile?.level === "STUDENT" && (
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Université</FormLabel>
                  <FormControl>
                    <Input placeholder="Université de Kinshasa" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* ABOUT */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>À propos</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} placeholder="Parlez de vous..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BIRTHDAY */}
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP")
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CITY */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Kinshasa" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* COMMUNE */}
          <FormField
            control={form.control}
            name="commune"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commune</FormLabel>
                <FormControl>
                  <Input placeholder="Bandalungwa" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ADDRESS */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Av. de la paix" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sauvegarder"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormsCandidate;
