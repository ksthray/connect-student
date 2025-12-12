/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Search, Eye, Edit2, Trash2, Plus, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "@/services/query";
import { JobOfferType } from "@/entities/types";
import { AppTable } from "@/components/admin/app-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import {
  formatNumber,
  returnBadgeColorOfJobType,
  returnNameOfJobType,
} from "@/services/helpers";
import AddOffer from "./components/add-offer";
import UpdateOffer from "./components/update-offer";
import { Badge } from "@/components/ui/badge";
import { useAdminStats } from "@/context/AdminStatsContext";
import { toast } from "sonner";
import api from "@/services/api";

export default function Opportunities({ token }: { token: string }) {
  const { stats, isLoading: isLoadingStat } = useAdminStats();
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch({
    route: "/admin/jobs",
    query: "opportunities",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const opportunities: JobOfferType[] = data?.data || [];

  const [open, setopen] = useState(false);
  const [openUpdate, setopenUpdate] = useState(false);
  const [offerData, setofferData] = useState({} as JobOfferType);

  const deleteMutation = useMutation({
    onMutate: async () => {
      // Affiche le toast de chargement et retourne son ID.
      const toastId = toast.loading("Chargement...");
      return { toastId }; // Cet objet sera le "context" dans les autres callbacks
    },
    mutationFn: (jobId: string) => {
      return api.delete(`/admin/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res, variables, context) => {
      if (res.data.state) {
        toast.success(res.data.message, { id: context?.toastId });
        queryClient.invalidateQueries({ queryKey: ["opportunities"] }); // Invalider pour rafraîchir les données globales
      }
    },
    onError: (err: any, variables, context) => {
      console.log(err);
      toast.error(err.response.data.message as string, {
        id: context?.toastId,
      });
    },
  });

  const columns: ColumnDef<JobOfferType>[] = [
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col">
          <span className="text-md font-black">{row.getValue("title")}</span>
          <span className="text-gray-600 text-md">
            {row.original.companyName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div>
          <Badge
            className={`text-sm ${returnBadgeColorOfJobType(
              row.getValue("type")
            )}`}>
            {returnNameOfJobType(row.getValue("type"))}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Actif",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="capitalize">
            <Switch
              checked={item.active}
              id="active"
              // onCheckedChange={(v) => handleSwitchData(item.id as string, 0)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "visibility",
      header: "Visible",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="capitalize">
            <Switch
              checked={item.visibility}
              id="active"
              // onCheckedChange={(v) => handleSwitchData(item.id as string, 0)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "totalApplications",
      header: "Candidatures",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatNumber(row.original.totalApplications)}
        </div>
      ),
    },
    {
      accessorKey: "viewCount",
      header: "Vues",
      cell: ({ row }) => (
        <div className="text-sm">{formatNumber(row.original.viewCount)}</div>
      ),
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center justify-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => {
                setofferData(row.original);
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
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
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
            Gestion des opportunités
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer les offres d&apos;emploi, les stages, événements ou formations
          </p>
        </div>
        <Button
          onClick={() => setopen(true)}
          className="linear-premiere text-white cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une offre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Total Opportunitéw
          </p>
          <p className="text-2xl font-bold text-foreground">
            {!isLoading ? (
              opportunities.length
            ) : (
              <Loader className="animate-spin" />
            )}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Total Candidatures
          </p>
          <p className="text-2xl font-bold text-foreground">
            {!isLoadingStat ? (
              stats?.totalApplications
            ) : (
              <Loader className="animate-spin" />
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            {/* <Input
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 h-11"
            /> */}
          </div>

          {/* <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 h-11 rounded-lg border-2 border-input focus:outline-none focus:border-secondary text-foreground">
            <option value="all">All Types</option>
            <option value="job">Jobs</option>
            <option value="internship">Internships</option>
            <option value="training">Training</option>
          </select> */}
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
        {!isLoading ? (
          <AppTable
            activeSearch={false}
            data={opportunities}
            columns={columns}
          />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <AddOffer open={open} setopen={setopen} />
      <UpdateOffer
        open={openUpdate}
        setopen={setopenUpdate}
        offerData={offerData}
      />
    </div>
  );
}
