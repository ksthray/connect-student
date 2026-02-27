/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "@/services/query";
import { SectorType } from "@/entities/types";
import { ColumnDef } from "@tanstack/react-table";
import { AppTable } from "@/components/admin/app-table";
import { Skeleton } from "@/components/ui/skeleton";
import AddSector from "./components/add-sector";
import { formatNumber, frDate } from "@/services/helpers";
import UpdateSector from "./components/update-sector";
import { SectorDetailsDialog } from "./components/sector-details";
import { toast } from "sonner";
import api from "@/services/api";

export default function Sectors({ token }: { token: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch({
    route: "/admin/sectors",
    query: "sectors",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const sectors: SectorType[] = data?.data || [];

  const [open, setopen] = useState(false);
  const [openUpdate, setopenUpdate] = useState(false);
  const [sectorData, setsectorData] = useState({} as SectorType);
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null);

  const deleteMutation = useMutation({
    onMutate: async () => {
      // Affiche le toast de chargement et retourne son ID.
      const toastId = toast.loading("Chargement...");
      return { toastId }; // Cet objet sera le "context" dans les autres callbacks
    },
    mutationFn: (sectorId: string) => {
      return api.delete(`/admin/sectors/${sectorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res, variables, context) => {
      if (res.data.state) {
        toast.success(res.data.message, { id: context?.toastId });
        queryClient.invalidateQueries({ queryKey: ["sectors"] }); // Invalider pour rafraîchir les données globales
      }
    },
    onError: (err: any, variables, context) => {
      console.log(err);
      toast.error(err.response.data.message as string, {
        id: context?.toastId,
      });
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      // Optionnel: Ajouter une confirmation avant la suppression
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce secteur ?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const columns: ColumnDef<SectorType>[] = [
    {
      accessorKey: "name",
      header: "Nom du secteur",
      cell: ({ row }) => (
        <div className="capitalize text-sm flex items-center gap-2">
          {row.getValue("name")}
        </div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Date de création",
      cell: ({ row }) => (
        <div className="text-sm ">{frDate(row.getValue("createdAt"))}</div>
      ),
    },
    {
      accessorKey: "totalOpportunities",
      header: "Opportunités",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatNumber(row.getValue("totalOpportunities"))}
        </div>
      ),
    },
    {
      accessorKey: "totalCandidates",
      header: "Candidates",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatNumber(row.getValue("totalCandidates"))}
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
              onClick={() => setSelectedSector(row.original)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => {
                setsectorData(row.original);
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

  return (
    <div className="space-y-6  p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des secteurs
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer et organiser les secteurs d&apos;activité
          </p>
        </div>
        <Button
          onClick={() => setopen(true)}
          className="linear-premiere text-white cursor-pointer hover:bg-premiere-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un secteur
        </Button>
      </div>

      {/* Sectors Table */}
      <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
        {!isLoading ? (
          <AppTable activeSearch={false} data={sectors} columns={columns} />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <AddSector open={open} setopen={setopen} />
      <UpdateSector
        sector={sectorData}
        open={openUpdate}
        setopen={setopenUpdate}
      />
      <SectorDetailsDialog
        sector={selectedSector}
        open={!!selectedSector}
        onClose={() => setSelectedSector(null)}
      />
    </div>
  );
}
