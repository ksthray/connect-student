"use client";

import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const kpis = [
    {
      title: "Active Opportunities",
      value: "12",
      change: "+2",
      isPositive: true,
      icon: Briefcase,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Applications",
      value: "487",
      change: "+156",
      isPositive: true,
      icon: FileText,
      bgColor: "from-purple-500 to-pink-500",
    },
    {
      title: "Profile Views",
      value: "2,341",
      change: "+389",
      isPositive: true,
      icon: Users,
      bgColor: "from-green-500 to-emerald-500",
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      change: "+1.2%",
      isPositive: true,
      icon: TrendingUp,
      bgColor: "from-orange-500 to-red-500",
    },
  ];

  const recentApplications = [
    {
      applicant: "Sarah Johnson",
      position: "Senior Developer",
      status: "reviewing",
      appliedDate: "2 hours ago",
      rating: 4.5,
    },
    {
      applicant: "Michael Chen",
      position: "Product Designer",
      status: "shortlisted",
      appliedDate: "1 day ago",
      rating: 4.8,
    },
    {
      applicant: "Emma Wilson",
      position: "Marketing Manager",
      status: "new",
      appliedDate: "2 days ago",
      rating: 4.2,
    },
    {
      applicant: "David Brown",
      position: "Data Analyst",
      status: "reviewing",
      appliedDate: "3 days ago",
      rating: 4.0,
    },
    {
      applicant: "Lisa Anderson",
      position: "Senior Developer",
      status: "rejected",
      appliedDate: "5 days ago",
      rating: 3.5,
    },
  ];

  const topOpportunities = [
    {
      title: "Senior Developer",
      type: "Job Offer",
      applications: 124,
      views: 1245,
      status: "active",
      postedDate: "2 weeks ago",
    },
    {
      title: "UX/UI Design Internship",
      type: "Internship",
      applications: 89,
      views: 856,
      status: "active",
      postedDate: "3 weeks ago",
    },
    {
      title: "Marketing Training Program",
      type: "Training Program",
      applications: 156,
      views: 1834,
      status: "active",
      postedDate: "1 week ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-green-100 text-green-700";
      case "rejected":
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
          Company Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your opportunities and
          applications.
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
              Recent Applications
            </h2>
            <Link href="/recruiter/applications">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentApplications.map((app, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-border">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">
                    {app.applicant
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-semibold">{app.applicant}</span>
                    <span className="text-muted-foreground ml-2">
                      for {app.position}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.appliedDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {app.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">⭐</p>
                  </div>
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
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/recruiter/opportunities">
              <Button className="w-full bg-linear-to-r from-primary to-secondary text-white justify-start gap-2">
                <Briefcase className="w-4 h-4" />
                Post New Opportunity
              </Button>
            </Link>
            <Link href="/recruiter/applications">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border">
                <FileText className="w-4 h-4" />
                View All Applications
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-border">
              <Users className="w-4 h-4" />
              View Company Profile
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Application Response Rate
                </span>
                <span className="text-sm font-bold text-secondary">68%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-secondary"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-secondary">95%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-secondary"
                  style={{ width: "95%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Your Opportunities
          </h2>
          <Link href="/recruiter/opportunities">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10">
              Manage All
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
                  Applications
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground text-sm">
                  Views
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">
                  Posted
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
                      href={`/recruiter/opportunities/${idx}`}
                      className="font-medium text-primary hover:underline">
                      {opp.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {opp.type}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-foreground">
                      {opp.applications}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">
                    {opp.views}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {opp.postedDate}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
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
