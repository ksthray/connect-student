"use client";

import { useState } from "react";
import Subscribers from "./components/subscribers";
import Plans from "./components/plans";
import { useFetch } from "@/services/query";
import { PlanSubscriptionType, SubscribersType } from "@/entities/types";
import { Skeleton } from "@/components/ui/skeleton";

export const getTierColor = (tier: string) => {
  switch (tier) {
    case "Freemium":
      return "from-gray-500 to-slate-500";
    case "Standard":
      return "from-blue-500 to-cyan-500";
    case "Premium":
      return "from-purple-500 to-pink-500";
    default:
      return "from-gray-500 to-slate-500";
  }
};

export default function Subscriptions({ token }: { token: string }) {
  const { data, isLoading } = useFetch({
    route: "/admin/subscriptions/subscribers",
    query: "subscribers",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const subscribers: SubscribersType[] = data?.data || [];

  const { data: plans, isLoading: isLoadingPlan } = useFetch({
    route: "/admin/subscriptions/tiers",
    query: "plans",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const plansData: PlanSubscriptionType[] = plans?.data || [];

  const [activeTab, setActiveTab] = useState<"users" | "plans">("users");

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des abonnements
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer les niveaux d&apos;abonnement et les abonnements des
            utilisateurs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}>
          Les utilisateurs ({subscribers.length})
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}>
          Plans & Pricing
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" &&
        (!isLoading ? (
          <Subscribers subscribers={subscribers} />
        ) : (
          <Skeleton className="w-full h-24" />
        ))}

      {/* Plans Tab */}
      {activeTab === "plans" &&
        (!isLoadingPlan ? (
          <Plans plans={plansData} />
        ) : (
          <Skeleton className="w-full h-24" />
        ))}
    </div>
  );
}
