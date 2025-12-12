"use client";

import React, { useEffect } from "react";
import { SectorType } from "@/entities/types";

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
import { useAuthStore } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

const sectorSchema = z.object({
  name: z.string().min(2, {
    message: "Veuillez inserez le nom du secteur",
  }),
});

const UpdateSector = ({
  sector,
  open,
  setopen,
}: {
  sector: SectorType;
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof sectorSchema>>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (state: { name: string }) => {
      return api.put(`/admin/sectors/${sector.id}`, state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data.state) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["sectors"] });
        setopen(false);
        form.reset({ name: "" });
      }
    },
    onError: (err) => {
      console.log(err);
      //   toast.error(err.response.data.message as string);
    },
  });

  useEffect(() => {
    if (sector && sector.id) {
      form.reset({
        name: sector.name || "",
      }); // Met à jour l'ID de la session traitée
    }
  }, [sector, open, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      name: values.name,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Modifier le secteur"}</DialogTitle>
          <DialogDescription>
            Modification du secteur {sector.name}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du secteur</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: Informatique"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              "Modifier"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSector;
