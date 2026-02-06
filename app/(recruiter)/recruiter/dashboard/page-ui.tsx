"use client";

import { Button } from "@/components/ui/button";
import { OpportunityRecruiter } from "@/entities/types";
import { frDate, returnNameOfJobType } from "@/services/helpers";
import { useFetch } from "@/services/query";
import {
  Briefcase,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Settings2,
} from "lucide-react";
import Link from "next/link";

type DashboardType = {
  stats: {
    totalOffers: number;
    totalApplications: number;
  };
  recentApplications: {
    id: string;
    status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
    createdAt: Date;
    cvUrl: string;
    jobOffer: {
      title: string;
    };
    candidate: {
      user: {
        fullname: string;
        email: string;
      };
      cvUrl: string | null;
    };
  }[];
};

export default function RecruiterDashboard({ token }: { token: string }) {
  const { data, isLoading } = useFetch({
    route: "/recruiter/dashboard",
    query: "recruiter-dashboard",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: jobs, isLoading: isLoadingJobs } = useFetch({
    route: "/recruiter/jobs?limit=5",
    query: "opportunities",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const opportunities: OpportunityRecruiter[] = jobs?.data || [];

  const getData: DashboardType = data?.data || {};

  const kpis = [
    {
      title: "Opportunités publiées",
      value: getData?.stats?.totalOffers,
      change: "+2",
      isPositive: true,
      icon: Briefcase,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Applications",
      value: getData?.stats?.totalApplications,
      change: "+156",
      isPositive: true,
      icon: FileText,
      bgColor: "from-purple-500 to-pink-500",
    },
  ];

  const recentApplications = getData?.recentApplications || [];

  const topOpportunities = opportunities || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      case "REVIEWING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTEED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue ! Voici un aperçu de vos opportunités et candidatures.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const ChangeIcon = kpi.isPositive ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-linear-to-br ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    kpi.isPositive ? "text-green-600" : "text-red-600"
                  }`}>
                  {kpi.change}
                  <ChangeIcon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">
                {kpi.title}
              </h3>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Récentes candidatures
            </h2>
            <Link href="/recruiter/applications">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10">
                Voir tout
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentApplications.map((app, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-border">
                <div className="w-12 h-12 linear-premiere rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">
                    {app?.candidate.user.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-semibold">
                      {app?.candidate.user.fullname}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      pour {app?.jobOffer.title}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {frDate(app?.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                      app.status
                    )}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Actions rapides{" "}
          </h2>
          <div className="flex flex-col gap-3">
            <Link href="/recruiter/opportunities">
              <Button className="w-full bg-premiere hover:bg-premiere-foreground text-white justify-start gap-2">
                <Briefcase className="w-4 h-4" />
                Publier une nouvelle opportunité
              </Button>
            </Link>
            <Link href="/recruiter/applications">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border">
                <FileText className="w-4 h-4" />
                Voir toutes les candidatures
              </Button>
            </Link>
            <Link href="/recruiter/settings">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border">
                <Settings2 className="w-4 h-4" />
                Voir le profil de l&apos;entreprise
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Vos opportunités
          </h2>
          <Link href="/recruiter/opportunities">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10">
              Voir tout
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                  Opportunity
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                  Type
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                  Candidatures
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                  Views
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                  Publiée
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topOpportunities.map((opp, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Link
                      href={`/jobs/${opp?.slug}`}
                      className="font-medium text-primary hover:underline">
                      {opp?.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {returnNameOfJobType(opp?.type)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-foreground">
                      {opp?._count.applications}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">
                    {opp.viewCount}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {frDate(opp.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {opp.active ? "Active" : "Desactivé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
