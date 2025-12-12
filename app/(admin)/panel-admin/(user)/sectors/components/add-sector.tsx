"use client";

import React from "react";

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

type Props = {
  open: boolean;
  setopen: (v: boolean) => void;
};

const sectorSchema = z.object({
  name: z.string().min(2, {
    message: "Veuillez inserez le nom du secteur",
  }),
});

const AddSector = ({ open, setopen }: Props) => {
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
      return api.post("/admin/sectors", state, {
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

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      name: values.name,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Ajouter un nouveau secteur"}</DialogTitle>
          <DialogDescription>
            Créer un nouveau secteur d&apos;activité
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
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSector;
