"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorAxiosType, TestimonyType } from "@/entities/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { defaultImage, getName, isImage } from "@/services/helpers";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CropImage from "@/components/admin/crop-image";

type Props = {
  open: boolean;
  setopen: (v: boolean) => void;
  avis: TestimonyType;
};

const formSchema = z.object({
  fullname: z.string().min(6, { message: "Nom complet" }),
  post: z.string().min(3, { message: "Poste occupé" }),
  email: z.string().email(),
  stars: z.number(),
  comment: z
    .string()
    .min(20, { message: "Le commentaire doit avoir minimum 20 caractères" }),
});

type DataPost = {
  fullname: string;
  photo?: string;
  post?: string;
  email: string;
  stars: number;
  comment: string;
};

const UpdateTestimony = ({ avis, open, setopen }: Props) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore((state) => state);

  const [photoUrl, setphotoUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      post: "",
      email: "",
      stars: 0,
      comment: "",
    },
  });

  const [starGest, setstarGest] = useState(0);

  const [openCropImage, setopenCropImage] = useState(false);
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // Taille max de 3 Mo

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const selectedFile = event.target.files;
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      if (isImage(file)) {
        if (file.size > MAX_FILE_SIZE) {
          toast.info("Votre image est trop lourde");
          event.target.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setphotoUrl(reader.result as string);
          setopenCropImage(!openCropImage);
        };
        reader.readAsDataURL(selectedFile[0]);
      } else {
        toast.error("Veuillez sélectionner une image s'il vous plaît !");
      }
    }
  };

  useEffect(() => {
    if (avis) {
      form.reset({
        fullname: avis.fullname,
        post: avis.post || "",
        email: avis.email,
        stars: avis.stars,
        comment: avis.comment,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setstarGest(avis.stars);
      setphotoUrl(avis.photo || "");
    }
  }, [avis, form]);

  const mutation = useMutation({
    mutationFn: (state: DataPost) => {
      return api.put(`/admin/testimonials/${avis.id}`, state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        form.reset();
        setopen(false);
      }
    },
    onError: (err: ErrorAxiosType) => {
      toast.error(err.response.data.message as string);
      console.log(err);
    },
  });

  const handleUpdateReview = form.handleSubmit((values) => {
    mutation.mutate({
      fullname: values.fullname,
      photo: photoUrl,
      email: values.email,
      post: values.post,
      stars: values.stars,
      comment: values.comment,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification du temoignage</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="space-y-2">
              <div className="shrink-0 relative w-max">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={photoUrl || defaultImage}
                    alt={"profile picture"}
                  />
                  <AvatarFallback className="text-lg">
                    {getName(form.getValues().fullname || "Anonyme")}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="imageUpload"
                  className="bg-gray-300/80 absolute -bottom-1 -right-1 w-max p-2 rounded-full">
                  <Edit size={16} className="cursor-pointer" />
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </Label>
              </div>
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
                name="post"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post / fonction occupé</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: Directeur"
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
              <div className="flex items-center gap-2">
                <span className="font-semibold">Note :</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer ${
                      star <= starGest
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => {
                      setstarGest(star);
                      form.setValue("stars", star);
                    }}
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Écrivez ici..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={handleUpdateReview} className="mt-6! w-full">
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Modifier l'avis"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <CropImage
          open={openCropImage}
          setopen={setopenCropImage}
          img={photoUrl}
          setpreviewImage={setphotoUrl}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTestimony;
