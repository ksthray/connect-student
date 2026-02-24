"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { CandidateUserType } from "@/entities/types";
import { useFetch } from "@/services/query";
import { formatNumber, frDate } from "@/services/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AppTable } from "@/components/admin/app-table";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateDetailsSheet } from "./components/candidate-details";

export default function Users({ token }: { token: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateUserType | null>(null);

  const { data, isLoading } = useFetch({
    route: "/admin/candidates",
    query: "candidates",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const candidates: CandidateUserType[] = data?.data || [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      case "GRADUATE":
        return "bg-purple-100 text-purple-800";
      case "PROFESSIONAL":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const returnNameOfProfileType = (type: string) => {
    switch (type) {
      case "STUDENT":
        return "Étudiant";
      case "GRADUATE":
        return "Dipplomé";
      case "PROFESSIONAL":
        return "Professionnel";
      default:
        return "N/A";
    }
  };

  // const getStatusIcon = (status: string) => {
  //   return status === "verified" ? (
  //     <CheckCircle className="w-4 h-4 text-green-600" />
  //   ) : (
  //     <AlertCircle className="w-4 h-4 text-yellow-600" />
  //   );
  // };

  const filtered = candidates.filter((user) => {
    const matchesSearch =
      user.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const columns: ColumnDef<CandidateUserType>[] = [
    {
      accessorKey: "user",
      header: "Utilisateur",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col">
          <span className="text-md font-black capitalize">{row.getValue("user")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Adresse e-mail",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col">
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div>
          <Badge className={`text-sm ${getTypeColor(row.getValue("type"))}`}>
            {returnNameOfProfileType(row.getValue("type"))}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },

    {
      accessorKey: "totalApplications",
      header: "Candidatures",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatNumber(row.original.applicationsCount)}
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: "Profil",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full linear-premiere"
                style={{ width: `${row.original.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground">
              {row.original.score}%
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "joinDate",
      header: "À réjoins",
      cell: ({ row }) => (
        <div className="text-sm">{frDate(row.original.joinDate)}</div>
      ),
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCandidate(row.original)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 p-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérer et superviser tous les utilisateurs de la plateforme
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 h-11"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 h-11 rounded-lg border-2 border-input focus:outline-none focus:border-secondary text-foreground">
              <option value="all">All Users</option>
              <option value="STUDENT">Étudiants</option>
              <option value="GRADUATE">Dipplomés</option>
              <option value="PROFESSIONAL">Professionnel</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
          {!isLoading ? (
            <AppTable activeSearch={true} data={filtered} columns={columns} />
          ) : (
            <Skeleton className="w-full h-72" />
          )}
        </div>
      </div>

      <CandidateDetailsSheet
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  );
}
