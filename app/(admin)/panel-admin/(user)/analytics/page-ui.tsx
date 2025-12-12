"use client";

import { Button } from "@/components/ui/button";
import { DownloadCloud, TrendingUp, Users, Briefcase } from "lucide-react";

export default function Analytics() {
  const metrics = [
    {
      title: "User Growth",
      value: "+2,341",
      percentage: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Opportunities",
      value: "1,284",
      percentage: "+8.2%",
      trend: "up",
      icon: Briefcase,
    },
    {
      title: "Avg. Match Score",
      value: "82%",
      percentage: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Placement Rate",
      value: "85%",
      percentage: "+1.8%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into platform metrics and user behavior
          </p>
        </div>
        <Button className="bg-linear-to-r from-primary to-secondary text-white">
          <DownloadCloud className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">
                  {metric.percentage}
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">
            User Registration Trend
          </h2>
          <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
            {[45, 52, 48, 61, 55, 68, 72, 78, 85, 92, 88, 95].map(
              (val, idx) => (
                <div
                  key={idx}
                  className="flex-1 mx-1 bg-linear-to-t from-primary to-secondary rounded-t-lg opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${(val / 100) * 100}%` }}
                  title={`${val} users`}
                />
              )
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-4">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Application Status Distribution
          </h2>
          <div className="space-y-4">
            {[
              { label: "Accepted", value: 2845, color: "bg-green-500" },
              { label: "Pending", value: 1234, color: "bg-yellow-500" },
              { label: "Reviewed", value: 3456, color: "bg-blue-500" },
              { label: "Rejected", value: 892, color: "bg-red-500" },
            ].map((item, idx) => {
              const total = 2845 + 1234 + 3456 + 892;
              const percentage = (item.value / total) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Opportunities */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Top Performing Opportunities
          </h2>
          <div className="space-y-3">
            {[
              { rank: 1, title: "Senior Software Engineer", score: 94 },
              { rank: 2, title: "Product Designer", score: 87 },
              { rank: 3, title: "Data Analyst", score: 82 },
            ].map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">#{item.rank}</span>
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                </div>
                <span className="text-sm font-semibold text-secondary">
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            User Engagement Metrics
          </h2>
          <div className="space-y-4">
            {[
              { label: "Profile Completion Rate", value: 78 },
              { label: "Application Submission Rate", value: 65 },
              { label: "Company Verification Rate", value: 92 },
              { label: "Email Engagement", value: 54 },
            ].map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {metric.label}
                  </span>
                  <span className="text-sm font-bold text-secondary">
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary to-secondary"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
