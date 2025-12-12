"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { E164Number, ErrorAxiosType } from "@/entities/types";
import { PhoneInput } from "@/components/ui/phone-input";
import { useAuthStore } from "@/store/store";
import { adminRegisterSchema } from "@/schemas/admin/auth";

type Props = {
  open: boolean;
  setopen: (v: boolean) => void;
};

type CreateUserAdmin = {
  fullname: string;
  password: string;
  phone: string;
  email: string;
};

const AddUserAdmin = ({ open, setopen }: Props) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof adminRegisterSchema>>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      password: "azertyui",
    },
  });

  const [showPassword, setshowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (state: CreateUserAdmin) => {
      return api.post("/admin/register", state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        setopen(false);
      }
    },
    onError: (err: ErrorAxiosType) => {
      toast.error(err.response.data.message as string);
      console.log(err);
    },
  });

  function onSubmit(values: z.infer<typeof adminRegisterSchema>) {
    // console.log(values);

    mutation.mutate({
      fullname: values.fullname,
      password: values.password as string,
      email: values.email,
      phone: values.phone as string,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="">Ajouter un admin</DialogTitle>
          <DialogDescription className="">
            Remplissez les informations détaillées ci-dessous pour ajouter un
            administrateur.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Téléphone</FormLabel>
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
                          placeholder="Ex: john@email.com"
                          disabled
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
            </form>
          </Form>
        </div>
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setopen(false)}
            className="border-2">
            Annuler
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserAdmin;
