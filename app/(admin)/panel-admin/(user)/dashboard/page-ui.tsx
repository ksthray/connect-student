"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Bouton
import {
  Users, // Utilisateurs
  Briefcase, // Mallette
  Building2, // Bâtiment
  TrendingUp, // Tendance à la hausse
  ArrowUpRight, // Flèche Haut Droite
  ArrowDownRight,
  Loader, // Flèche Bas Droite
} from "lucide-react";
import { useAdminStats } from "@/context/AdminStatsContext";
import { filterData, formatNumber, frDate } from "@/services/helpers";
import { useFetch } from "@/services/query";
import { JobOfferType, RecentActivity } from "@/entities/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Dashboard({ token }: { token: string }) {
  const { stats, isLoading: isLoadingStat } = useAdminStats();
  const kpis = [
    {
      title: "Utilisateurs Totaux",
      value: formatNumber(stats?.totalUsers || 0),
      change: "+12.5%",
      isPositive: true,
      icon: Users,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Opportunités Actives",
      value: formatNumber(stats?.activeListings || 0),
      change: "+8.2%",
      isPositive: true,
      icon: Briefcase,
      bgColor: "from-purple-500 to-pink-500",
    },
    {
      title: "Entreprises Enregistrées",
      value: formatNumber(stats?.totalCompanies || 0),
      change: "+5.1%",
      isPositive: true,
      icon: Building2,
      bgColor: "from-green-500 to-emerald-500",
    },
    {
      title: "Taux de Placement",
      value: stats?.placementRateExample.toString() + "%",
      change: "+2.3%",
      isPositive: true,
      icon: TrendingUp,
      bgColor: "from-orange-500 to-red-500",
    },
  ];

  const { data, isLoading } = useFetch({
    route: "/admin/recent-activity",
    query: "recent-activity",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const recentActivity: RecentActivity[] = data?.data || [];

  const { data: jobs, isLoading: isLoadingJobs } = useFetch({
    route: "/admin/jobs",
    query: "opportunities",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const opportunities: JobOfferType[] = jobs?.data || [];

  return (
    <div className="space-y-8 p-10">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground">
          Bon retour ! Voici un aperçu de votre plateforme.
        </p>
      </div>

      {/* Cartes KPI */}
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
                  className={`flex items-center gap-1 text-sm font-semibold ${kpi.isPositive ? "text-green-600" : "text-red-600"
                    }`}>
                  {kpi.change}
                  <ChangeIcon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">
                {kpi.title}
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {!isLoadingStat ? (
                  kpi.value
                ) : (
                  <Loader className="animate-spin" />
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité Récente */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Activité Récente
            </h2>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10">
              Voir Tout
            </Button>
          </div>

          <div className="space-y-4">
            {!isLoading ? (
              recentActivity.slice(0, 5).map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 linear-deuxieme rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">
                      {/* Initiales de l'utilisateur */}
                      {activity.relatedEntity
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">
                        {activity.relatedEntity}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {activity.message}
                      </span>{" "}
                      {/* <span className="font-semibold text-secondary">
                      {activity.target}
                    </span> */}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {frDate(activity.date)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${activity.type === "application"
                        ? "bg-blue-100 text-blue-700"
                        : activity.type === "posting"
                          ? "bg-green-100 text-green-700"
                          : activity.type === "profile"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                      }`}>
                    {/* Traduction du type d'activité */}
                    {activity.type === "application"
                      ? "candidature"
                      : activity.type === "posting"
                        ? "publication"
                        : activity.type === "profile"
                          ? "profil"
                          : "sauvegarde"}
                  </span>
                </div>
              ))
            ) : (
              <Skeleton className="w-full h-10" />
            )}
          </div>
        </div>
      </div>

      {/* Top Opportunités */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Opportunités les Plus Demandées
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-primary hover:bg-primary/10">
            <Link href="/panel-admin/opportunities">Voir Tout</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          {!isLoadingJobs ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Opportunité
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Entreprise
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                    Candidatures
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                    Vues
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                    Publié
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData(opportunities, 5).map((opp, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{opp.title}</p>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">
                      {opp.companyName}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-foreground">
                        {opp.totalApplications}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-muted-foreground">
                      {opp.viewCount}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">
                      {frDate(opp.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Skeleton className="w-full h-40" />
          )}
        </div>
      </div>
    </div>
  );
}
