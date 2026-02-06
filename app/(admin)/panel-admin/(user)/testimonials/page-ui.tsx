"use client";

import React, { useCallback, useState } from "react";

import { AppTable } from "@/components/admin/app-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TestimonyType, ErrorAxiosType } from "@/entities/types";
import { defaultImage, frDate, getName } from "@/services/helpers";
import { useFetch } from "@/services/query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/services/api";
import AddTestimony from "./components/add.testimony";
import UpdateTestimony from "./components/update.testimony";
import ViewAvis from "./components/view.avis";

const Testimonials = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch({
    route: "/admin/testimonials",
    query: "testimonials",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const testimonials: TestimonyType[] = data?.data || [];

  const [openAddAvis, setopenAddAvis] = useState(false);
  const [openViewAvis, setopenViewAvis] = useState(false);

  const [openUpdateAvis, setopenUpdateAvis] = useState(false);
  const [avis, setavis] = useState({} as TestimonyType);

  // delete
  const deleteMutation = useMutation({
    onMutate: async () => {
      // Affiche le toast de chargement et retourne son ID.
      const toastId = toast.loading("Chargement...");
      return { toastId }; // Cet objet sera le "context" dans les autres callbacks
    },
    mutationFn: (id: string) => {
      return api.delete(`/admin/testimonials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res, variables, context) => {
      if (res.data.state) {
        toast.success(res.data.message, { id: context?.toastId });
        queryClient.invalidateQueries({ queryKey: ["testimonials"] }); // Invalider pour rafraîchir les données globales
      }
    },
    onError: (err: ErrorAxiosType, variables, context) => {
      console.log(err);
      toast.error(err.response.data.message as string, {
        id: context?.toastId,
      });
    },
  });

  const handleDeleteTestimony = useCallback(
    (id: string) => {
      // Optionnel: Ajouter une confirmation avant la suppression
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const columns: ColumnDef<TestimonyType>[] = [
    {
      accessorKey: "photo",
      header: "Photo",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={item?.photo ?? defaultImage}
              alt={item.fullname}
            />
            <AvatarFallback className="font-semibold uppercase">
              {getName(item.fullname ?? "Anonyme")}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "fullname",
      header: "Nom complet",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("fullname")}</div>
      ),
    },
    {
      accessorKey: "post",
      header: "Post / Function occupé",
      cell: ({ row }) => <div className="">{row.getValue("post")}</div>,
    },
    {
      accessorKey: "email",
      header: "Adresse e-mail",
      cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "comment",
      header: "Commentaire",
      cell: ({ row }) => (
        <div className="w-[300px] whitespace-normal wrap-break-word">
          <p className="text-sm text-muted-foreground">
            {`${row.getValue("comment")}`.substring(0, 100)}...
          </p>
        </div>
      ),
    },
    {
      accessorKey: "stars",
      header: "Stars",
      cell: ({ row }) => <div className="">{row.getValue("stars")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="font-medium">{frDate(row.getValue("createdAt"))}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setavis(item);
                  setopenViewAvis(!openViewAvis);
                }}>
                Voir plus
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setavis(item);
                  setopenUpdateAvis(!openUpdateAvis);
                }}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTestimony(item.id)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des temoignages
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer les temoignages du site
          </p>
        </div>
        <Button
          onClick={() => setopenAddAvis(true)}
          className="linear-premiere cursor-pointer text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une entreprise
        </Button>
      </div>
      <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
        {!isLoading ? (
          <AppTable
            activeSearch={false}
            data={testimonials}
            columns={columns}
          />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <AddTestimony open={openAddAvis} setopen={setopenAddAvis} />
      <UpdateTestimony
        open={openUpdateAvis}
        setopen={setopenUpdateAvis}
        avis={avis}
      />
      <ViewAvis open={openViewAvis} setopen={setopenViewAvis} avis={avis} />
    </div>
  );
};

export default Testimonials;
