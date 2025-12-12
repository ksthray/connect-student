/* eslint-disable react-hooks/immutability */
"use client";

import React, { ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { isImage } from "@/services/helpers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import axios from "axios";
import api from "@/services/api";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/store";
import { companyCreateSchema } from "@/schemas/admin/company";

type DataPost = {
  fullname: string;
  companyName: string;
  email: string;
  phone?: string;
  password: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  logo?: string;
};

const AddCompany = ({
  open,
  setopen,
}: {
  open: boolean;
  setopen: (v: boolean) => void;
}) => {
  const token = useAuthStore((state) => state.token);
  const [logo, setlogo] = useState<string>("");

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof companyCreateSchema>>({
    resolver: zodResolver(companyCreateSchema),
    defaultValues: {
      fullname: "",
      companyName: "",
      email: "",
      phone: "",
      password: "",
      description: "",
      website: "",
      location: "",
      industry: "",
      logo: "",
    },
  });

  let toastId: string | number;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // Taille max de 2 Mo

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const selectedFile = event.target.files;
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      if (isImage(file)) {
        if (file.size > MAX_FILE_SIZE) {
          toast.info("Votre image doit péser en dessous d'2 Mo");
          event.target.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          uploadToCloudinary(file);
        };
        reader.readAsDataURL(selectedFile[0]);
      } else {
        toast.error("Veuillez sélectionner une image s'il vous plaît !");
      }
    }
  };

  const uploadToCloudinary = async (croppedImage: File) => {
    toastId = toast.loading("Chargement...", { id: toastId });
    try {
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", "newhope");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgfkv4isa/image/upload",
        formData
      );
      setlogo(response.data.secure_url);
      toast.success("Image téléchargée avec succès !", { id: toastId });
    } catch (error) {
      console.log("err:", error);
      toast.error("Une erreur est survenue, veuillez réessayer !", {
        id: toastId,
      });
    }
  };

  const mutation = useMutation({
    mutationFn: (state: DataPost) => {
      return api.post("/admin/companies", state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        form.reset();
        toast.success(res.data.message);
        setlogo("");
        setopen(false);
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      } else {
        toast.error("Une erreur s'est produite !");
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!logo) return toast.error("Veuillez uploader le logo de l'entreprise");
    const state = {
      ...values,
      logo: logo,
    };
    mutation.mutate(state);
  });

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent className="h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle entreprise</DialogTitle>
          <DialogDescription>
            Créer un nouveau compte entreprise
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-8 w-full ">
              <div className="flex text-left flex-col gap-2 ">
                {logo ? (
                  <div className="bg-green-200 p-4 rounded-md flex gap-4 items-center">
                    <Camera
                      size={20}
                      className="group-hover:text-premiere transition-all duration-300"
                    />
                    <span>Logo téléchargé avec succès !</span>
                  </div>
                ) : (
                  <Label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 text-sm cursor-pointer group">
                    <div className="w-min bg-gray-200 p-4 rounded-md flex justify-center items-center">
                      <Camera
                        size={20}
                        className="group-hover:text-premiere transition-all duration-300"
                      />
                    </div>
                    Ajouter le logo
                  </Label>
                )}

                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom complet du gestionnaire de ce compte
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nom complet"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nom de l'entreprise"
                          {...field}
                          className="bg-transparent"
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
                      <FormLabel>Email de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Téléphone"
                          {...field}
                          className="bg-transparent"
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
                        <Input
                          type="password"
                          placeholder="Mot de passe"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Description"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Site web"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation de l&apos;entreprise</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Localisation"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Secteur d&apos;activité de l&apos;entreprise
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Secteur d'activité"
                          {...field}
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setopen(false)}
            className="border-2">
            Annuler
          </Button>
          <Button onClick={onSubmit} className="">
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompany;
