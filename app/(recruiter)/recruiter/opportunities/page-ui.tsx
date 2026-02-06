/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, Eye } from "lucide-react";
import { OpportunityRecruiter } from "@/entities/types";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch } from "@/services/query";
import { ColumnDef } from "@tanstack/react-table";
import {
  formatNumber,
  returnBadgeColorOfJobType,
  returnNameOfJobType,
} from "@/services/helpers";
import { Switch } from "@/components/ui/switch";
import { AppTable } from "@/components/admin/app-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import AddOffer from "./components/add-offer";
import UpdateOffer from "./components/update-offer";

export default function RecruiterOpportunities({ token }: { token: string }) {
  const {
    data: company,
    isLoading: isLoadingProfile,
    isError,
  } = useCompanyProfile(token);

  const queryClient = useQueryClient();

  const { data, isLoading } = useFetch({
    route: "/recruiter/jobs",
    query: "opportunities",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const opportunities: OpportunityRecruiter[] = data?.data || [];

  const [open, setopen] = useState(false);
  const [openUpdate, setopenUpdate] = useState(false);
  const [offerData, setofferData] = useState({} as OpportunityRecruiter);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    | "INTERNSHIP"
    | "FULL_TIME"
    | "PART_TIME"
    | "CONFERENCE"
    | "EVENT"
    | "TRAINING"
    | "all"
  >("all");

  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "desactive"
  >("all");

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    type:
      | "INTERNSHIP"
      | "FULL_TIME"
      | "PART_TIME"
      | "CONFERENCE"
      | "EVENT"
      | "TRAINING";
    description: string;
    salary: string;
    location: string;
  }>({
    title: "",
    type: "FULL_TIME",
    description: "",
    salary: "",
    location: "",
  });

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || opp.type === filterType;
    const matchesStatus =
      filterStatus === "all" || opp.active
        ? "active"
        : "desactive" === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns: ColumnDef<OpportunityRecruiter>[] = [
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col">
          <span className="text-md font-black">{row.getValue("title")}</span>
          <span className="text-gray-600 text-md">{row.original.title}</span>
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
      header: "Active",
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
      accessorKey: "location",
      header: "Lieu",
      cell: ({ row }) => <div className="text-sm">{row.original.location}</div>,
    },
    {
      accessorKey: "_count",
      header: "Candidatures",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatNumber(row.original._count.applications)}
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
              // onClick={() => handleDelete(row.original.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (isError || !company) {
    return (
      <div className="text-red-500 p-10 text-center">
        Impossible de charger le profil de l&apos;entreprise.
      </div>
    );
  }

  const profile = company;

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Opportunités
          </h1>
          <p className="text-muted-foreground">
            Créer et gérer les offres d&apos;emploi, les stages et les
            programmes de formation.{" "}
          </p>
        </div>
        <Button onClick={() => setopen(true)} className="">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une opportunité
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cherche une opportunité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
            <option value="all">Tous les types</option>
            <option value="FULL_TIME">Emploi - en temps plein</option>
            <option value="PART_TIME">Emploi - en temps partiel</option>
            <option value="CONFERENCE">Conférence</option>
            <option value="EVENT">Évènement</option>
            <option value="TRAINING">Formation</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
            <option value="all">Tous les status</option>
            <option value="active">Active</option>
            <option value="desactive">Desactive</option>
          </select>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
        {!isLoading ? (
          <AppTable
            activeSearch={false}
            data={filteredOpportunities}
            columns={columns}
          />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <AddOffer
        companyId={profile.companyProfile?.id as string}
        open={open}
        setopen={setopen}
      />
      <UpdateOffer
        companyId={profile.companyProfile?.id as string}
        open={openUpdate}
        setopen={setopenUpdate}
        offerData={offerData}
      />
    </div>
  );
}
