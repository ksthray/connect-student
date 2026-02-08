"use client";

import { Button } from "@/components/ui/button";
import { useFetch } from "@/services/query";
import { useAuthStore } from "@/store/store";
import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { CandidateProfileStatusCard } from "../../components/candidate-profile-status-card";
import { frDate } from "@/services/helpers";
import { RecommendedOpportunities } from "../../components/recommended-opportunities";

type DashBoardType = {
  recentApplications: {
    id: string;
    status: "PENDING" | "PENDING" | "PENDING";
    createdAt: Date;
    jobOffer: {
      title: string;
      description: string;
      deadline: Date;
      company: {
        companyName: string;
      };
    };
  }[];
  stats: {
    applicationsSent: number;
    accepted: number;
    rejected: number;
  };
};

export default function CandidateDashboard({ token }: { token: string }) {
  const user = useAuthStore((state) => state.admin);
  const { data, isLoading } = useFetch({
    route: "/candidate/dashboard",
    query: "dashboard",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const getData: DashBoardType = data?.data || {};

  const stats = getData?.stats || ({} as DashBoardType["stats"]);
  const recentApplications =
    getData?.recentApplications || ([] as DashBoardType["recentApplications"]);

  const arrayStats = [
    {
      title: "Candidatures envoyées",
      value: stats?.applicationsSent,
      icon: Briefcase,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Acceptées",
      value: stats?.accepted,
      icon: CheckCircle,
      bgColor: "from-green-500 to-emerald-500",
    },
    {
      title: "Refusées",
      value: stats?.rejected,
      icon: XCircle,
      bgColor: "from-red-500 to-pink-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-700";
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
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Content de te revoir, <span className="capitalize">{user.fullname}</span>! 👋
        </h1>
        <p className="text-muted-foreground">
          Suivez vos candidatures et découvrez de nouvelles opportunités.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {arrayStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-linear-to-br ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Candidatures récentes{" "}
            </h2>
            <Link href="/user/applications">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10">
                Voir tout
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentApplications?.slice(0, 5)?.map((app) => (
              <div
                key={app.id}
                className="flex items-start gap-4 md:p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-border">
                <div className="hidden md:flex w-12 h-12 linear-deuxieme to-secondary rounded-lg items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="font-semibold">
                          {app.jobOffer.title}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.jobOffer.company.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {app.jobOffer.description.length > 240
                          ? app.jobOffer.description
                          : `${app.jobOffer.description.substring(0, 240)}...`}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 flex items-center gap-1 ${getStatusColor(
                        app.status
                      )}`}>
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {frDate(app.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CandidateProfileStatusCard />
      </div>

      {/* Recommended Opportunities */}
      <RecommendedOpportunities />
    </div>
  );
}
