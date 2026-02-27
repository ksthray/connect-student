/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "@/services/query";
import { CompanyType } from "@/entities/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/services/api";
import { AppTable } from "@/components/admin/app-table";
import { Skeleton } from "@/components/ui/skeleton";
import AddCompany from "./components/add-company";
import UpdateCompany from "./components/update-company";
import { CompanyDetailsDialog } from "./components/company-details";
import Link from "next/link";

export default function Companies({ token }: { token: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch({
    route: "/admin/companies",
    query: "companies",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const companies: CompanyType[] = data?.data || [];

  const [open, setopen] = useState(false);
  const [openUpdate, setopenUpdate] = useState(false);
  const [companyData, setcompanyData] = useState({} as CompanyType);
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);

  const deleteMutation = useMutation({
    onMutate: async () => {
      // Affiche le toast de chargement et retourne son ID.
      const toastId = toast.loading("Chargement...");
      return { toastId }; // Cet objet sera le "context" dans les autres callbacks
    },
    mutationFn: (companyId: string) => {
      return api.delete(`/admin/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res, variables, context) => {
      if (res.data.state) {
        toast.success(res.data.message, { id: context?.toastId });
        queryClient.invalidateQueries({ queryKey: ["companies"] }); // Invalider pour rafraîchir les données globales
      }
    },
    onError: (err: any, variables, context) => {
      console.log(err);
      toast.error(err.response.data.message as string, {
        id: context?.toastId,
      });
    },
  });

  const columns: ColumnDef<CompanyType>[] = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => (
        <div className="capitalize w-20 text-sm flex items-center gap-2">
          <Image
            src={row.getValue("logo")}
            alt={row.original.companyName}
            width={400}
            height={400}
            className="w-32"
          />
        </div>
      ),
    },
    {
      accessorKey: "companyName",
      header: "Nom de l'entreprise",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => <div className="text-sm">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "industry",
      header: "Secteur",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("industry")}</div>
      ),
    },
    {
      accessorKey: "website",
      header: "Site Web",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.website && (
            <Link href={row.getValue("website")} target="_blank">
              Visitez le site web
            </Link>
          )}
        </div>
      ),
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCompany(row.original)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => {
                setcompanyData(row.original);
                setopenUpdate(!openUpdate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleDelete = useCallback(
    (id: string) => {
      // Optionnel: Ajouter une confirmation avant la suppression
      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")
      ) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des entreprises
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer et vérifier les profils des entreprises
          </p>
        </div>
        <Button
          onClick={() => setopen(true)}
          className="linear-premiere cursor-pointer text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une entreprise
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Total Entreprises
          </p>
          <p className="text-2xl font-bold text-foreground">
            {companies.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
        {!isLoading ? (
          <AppTable activeSearch={true} data={companies} columns={columns} />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <AddCompany open={open} setopen={setopen} />
      <UpdateCompany
        open={openUpdate}
        setopen={setopenUpdate}
        company={companyData}
      />
      <CompanyDetailsDialog
        company={selectedCompany}
        open={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
}
