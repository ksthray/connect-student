"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import { useFetch } from "@/services/query";
import {
  frDate,
  getTypeBgColor,
  returnNameOfJobType,
} from "@/services/helpers";
import Link from "next/link";

type ApplicationType = {
  applications: {
    id: string;
    status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
    createdAt: Date;
    jobOffer: {
      title: string;
      description: string;
      slug: string;
      location: string;
      deadline: Date;
      type:
      | "INTERNSHIP"
      | "FULL_TIME"
      | "PART_TIME"
      | "EVENT"
      | "CONFERENCE"
      | "TRAINING";
      company: {
        companyName: string;
      };
    };
  }[];
  stats: {
    applicationsSent: number;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
};

export default function CandidateApplications({ token }: { token: string }) {
  const { data, isLoading } = useFetch({
    route: "/candidate/applications",
    query: "applications-candidate",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const getData: ApplicationType = data?.data || {};

  const stats = getData?.stats || ({} as ApplicationType["stats"]);
  const applications =
    getData?.applications || ([] as ApplicationType["applications"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobOffer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobOffer.company.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesType =
      filterType === "all" || app.jobOffer.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      case "REVIEWING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "REVIEWING":
        return <Eye className="w-4 h-4" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // const handleWithdraw = (id: number) => {
  //   setApplications(applications.filter((app) => app.id !== id));
  // };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mes candidatures
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Total
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stats.applicationsSent}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-blue-600 mb-2">En attente</p>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-yellow-600 mb-2">Vue</p>
          <p className="text-2xl font-bold text-foreground">
            {stats.reviewing}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-green-600 mb-2">Acceptée</p>
          <p className="text-2xl font-bold text-foreground">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-red-600 mb-2">Refusée</p>
          <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Chercher par titre ou compagnie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full bg-white border-border">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="INTERNSHIP">Stages</SelectItem>
              <SelectItem value="FULL_TIME">Emploi - Temps plein</SelectItem>
              <SelectItem value="PART_TIME">Emploi - Temps partiel</SelectItem>
              <SelectItem value="EVENT">Événement</SelectItem>
              <SelectItem value="CONFERENCE">Conférence</SelectItem>
              <SelectItem value="TRAINING">Formation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full bg-white border-border">
              <SelectValue placeholder="Tous les status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les status</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="REVIEWING">Vue</SelectItem>
              <SelectItem value="ACCEPTED">Acceptée</SelectItem>
              <SelectItem value="REJECTED">Rejetée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Pas des canditures trouvées</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`rounded-xl border ${getTypeBgColor(
                app.jobOffer.type
              )} w-full p-2 md:p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 hidden md:flex linear-premiere rounded-lg items-center justify-center shrink-0">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {app.jobOffer.location}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.jobOffer.company.companyName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusIcon(app.status)}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                            app.status
                          )}`}>
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <span>{app.jobOffer.location}</span>
                      <span>•</span>
                      <span>{returnNameOfJobType(app.jobOffer.type)}</span>
                    </div>

                    <div className="bg-white bg-opacity-50 rounded-lg p-3 my-3">
                      <p className="text-sm text-foreground">
                        {app.jobOffer.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Applied {frDate(app.createdAt)}</span>
                      <span>•</span>
                      <span>Date limite: {frDate(app.jobOffer.deadline)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-wrap gap-2 pt-4 border-t border-current border-opacity-10">
                <Button
                  variant="outline"
                  asChild
                  className="border-current text-current">
                  <Link href={`/offres/${app.jobOffer.slug}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir l&apos;offre
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-current text-current">
                  <Link href={`https://wa.me/+243989281540`}>
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg">
                      <title>WhatsApp icon</title>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Contact nous sur Whatsapp
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 md:ml-auto"
                  onClick={() => { }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Retirer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
