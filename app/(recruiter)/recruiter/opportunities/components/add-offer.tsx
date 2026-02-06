/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; //
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
import { CalendarIcon, Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/store";
import { jobCreateSchema } from "@/schemas/job";
import { SectorType } from "@/entities/types";
import { useFetch } from "@/services/query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

type DataPost = {
  companyId: string;
  title: string;
  description: string;
  location: string;
  type:
    | "INTERNSHIP"
    | "FULL_TIME"
    | "PART_TIME"
    | "EVENT"
    | "CONFERENCE"
    | "TRAINING";
  deadline: Date;
  detail?: string;
  requirements?: string;
  coverImage?: string;
  sectors?: string[];
  active?: boolean;
  visibility?: boolean;
};

const jobTypes: {
  label: string;
  value:
    | "INTERNSHIP"
    | "FULL_TIME"
    | "PART_TIME"
    | "EVENT"
    | "CONFERENCE"
    | "TRAINING";
}[] = [
  { label: "Stage", value: "INTERNSHIP" },
  { label: "Emploi Temps Plein", value: "FULL_TIME" },
  { label: "Emploi Temps Partiel", value: "PART_TIME" },
  { label: "Événement", value: "EVENT" },
  { label: "Conférence", value: "CONFERENCE" },
  { label: "Formation", value: "TRAINING" },
];

const AddOffer = ({
  companyId,
  open,
  setopen,
}: {
  companyId: string;
  open: boolean;
  setopen: (v: boolean) => void;
}) => {
  const token = useAuthStore((state) => state.token);

  const [cover, setcover] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingSectors } = useFetch({
    route: "/recruiter/sectors",
    query: "sectorsList",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const sectorsData: SectorType[] = data?.data || [];

  const sectorOptions =
    sectorsData?.map((sector) => ({
      label: sector.name,
      value: sector.id,
    })) || [];

  type JobFormValues = {
    title: string;
    description: string;
    location: string;
    type:
      | "INTERNSHIP"
      | "FULL_TIME"
      | "PART_TIME"
      | "EVENT"
      | "CONFERENCE"
      | "TRAINING";
    deadline: string;
    detail?: string;
    requirements?: string;
    coverImage?: string;
    sectors?: string[];
    active?: boolean;
    visibility?: boolean;
  };

  const form = useForm<JobFormValues, any, JobFormValues>({
    resolver: zodResolver(jobCreateSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "FULL_TIME",
      deadline: new Date().toISOString(),
      requirements: "",
      coverImage: "",
      sectors: [],
      active: true,
      visibility: true,
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
      setcover(response.data.secure_url);
      form.setValue("coverImage", response.data.secure_url);
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
      return api.post("/recruiter/jobs", state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        form.reset();
        toast.success(res.data.message);
        setcover("");
        setopen(false);
        queryClient.invalidateQueries({ queryKey: ["opportunities"] });
        queryClient.invalidateQueries({ queryKey: ["sectorsList"] });
      } else {
        toast.error("Une erreur s'est produite !");
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!values.coverImage && !cover) {
      return toast.error(
        "Veuillez uploader une photo de couverture pour l'offre."
      );
    }

    const state = {
      companyId: companyId,
      title: values.title,
      description: values.description,
      location: values.location,
      type: values.type,
      deadline: new Date(values.deadline),
      requirements: values.requirements,
      coverImage: values.coverImage || cover,
      sectors: values.sectors,
      active: values.active,
      visibility: values.visibility,
      detail: values.detail === "" ? values.description : values.detail,
    };

    // console.log(state);
    mutation.mutate(state);
    // console.log("formated:", typeof formatedDateline);
    // console.log("normal:", new Date(values.deadline));
  });

  if (isLoadingSectors) {
    return (
      <Dialog open={open} onOpenChange={setopen}>
        <DialogContent className="flex justify-center items-center h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p>Chargement des secteurs...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent className="h-[90%] w-full max-w-2xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="">
            Ajouter une offre d&apos;opportunité
          </DialogTitle>
          <DialogDescription className="">
            Remplissez les informations détaillées ci-dessous pour publier une
            nouvelle opportunité.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6 w-full">
            <Separator />

            {/* SECTION 1: Titre, Couverture et Types */}
            {/* Couverture */}
            <div className="">
              {cover ? (
                <div className="bg-green-100 p-3 rounded-md flex gap-4 items-center">
                  <Camera size={20} className="text-green-600" />
                  <span className="text-sm">
                    Image de couverture téléchargé avec succès !
                  </span>
                </div>
              ) : (
                <Label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 text-sm cursor-pointer group p-3 border rounded-md hover:bg-gray-50 transition">
                  <Camera size={20} className="text-gray-600" />
                  Ajouter une photo de couverture pour cette offre
                </Label>
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <FormMessage>
                {form.formState.errors.coverImage?.message}
              </FormMessage>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titre */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l&apos;offre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Stage Développeur Web"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type d'Offre (Select) */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d&apos;offre</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type d'offre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brève description de l&apos;offre</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'offre en quelques lignes..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements (Compétences/Exigences) */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compétences / Exigences Clés</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste des compétences ou exigences techniques (Ex: Maîtrise de React, 1 an d'expérience en DevOps...)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {/* Localisation */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville, Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Limite (Date Picker) */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Limite de Candidature</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Sélectionnez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : "");
                          }}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secteurs (Multi-Select) */}
              <FormField
                control={form.control}
                name="sectors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secteurs Ciblés</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={sectorOptions}
                        selectedValues={field.value || []}
                        onChange={field.onChange}
                        placeholder="Choisir un ou plusieurs secteurs"
                        disabled={isLoadingSectors}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER */}
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setopen(false)}
                className="border-2">
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || isLoadingSectors}>
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Ajouter l'Offre"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOffer;
