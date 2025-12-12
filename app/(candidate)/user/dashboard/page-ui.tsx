"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboard() {
  const stats = [
    {
      title: "Applications Sent",
      value: "24",
      icon: Briefcase,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      title: "Under Review",
      value: "8",
      icon: Clock,
      bgColor: "from-yellow-500 to-orange-500",
    },
    {
      title: "Accepted",
      value: "3",
      icon: CheckCircle,
      bgColor: "from-green-500 to-emerald-500",
    },
    {
      title: "Rejected",
      value: "5",
      icon: XCircle,
      bgColor: "from-red-500 to-pink-500",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      position: "Senior Developer",
      company: "Tech Innovations Inc.",
      status: "reviewing",
      appliedDate: "3 days ago",
      viewsCount: 2,
      notes: "Your profile has been shortlisted",
    },
    {
      id: 2,
      position: "UX/UI Designer Internship",
      company: "Creative Minds Agency",
      status: "accepted",
      appliedDate: "1 week ago",
      viewsCount: 1,
      notes: "Congratulations! You have been accepted",
    },
    {
      id: 3,
      position: "Data Analyst",
      company: "Finance Forward Group",
      status: "rejected",
      appliedDate: "2 weeks ago",
      viewsCount: 1,
      notes: "Thank you for your interest",
    },
    {
      id: 4,
      position: "Frontend Engineer",
      company: "Global Solutions Ltd",
      status: "pending",
      appliedDate: "5 days ago",
      viewsCount: 0,
      notes: "Waiting for company response",
    },
  ];

  const recommendedOpportunities = [
    {
      id: 1,
      position: "Backend Developer",
      company: "Tech Innovators Inc.",
      type: "Job Offer",
      salary: "$100k - $130k",
      match: "92%",
    },
    {
      id: 2,
      position: "Product Design Internship",
      company: "Design Studio Co.",
      type: "Internship",
      salary: "Unpaid",
      match: "88%",
    },
    {
      id: 3,
      position: "Marketing Training Program",
      company: "Marketing Academy",
      type: "Training",
      salary: "$2,500",
      match: "85%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reviewing":
        return <Eye className="w-4 h-4" />;
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
          Welcome Back, Sarah! 👋
        </h1>
        <p className="text-muted-foreground">
          Track your applications and discover new opportunities on Student
          Connect.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
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
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Recent Applications
            </h2>
            <Link href="/candidate/applications">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-border">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="font-semibold">{app.position}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {app.notes}
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
                    {app.appliedDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Profile Status */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Profile Status
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-secondary">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-secondary"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Resume Upload
                </span>
                <span className="text-sm font-bold text-secondary">✓</span>
              </div>
              <p className="text-xs text-muted-foreground">
                CV_Sarah_Chen_2024.pdf
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Link href="/candidate/my-profile">
                <Button className="w-full bg-linear-to-r from-primary to-secondary text-white">
                  Complete Profile
                </Button>
              </Link>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Profile Strengths
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✓ Photo added</li>
                <li>✓ Bio completed</li>
                <li>⚠ Skills (3/5)</li>
                <li>⚠ Experience (2/3)</li>
                <li>⚠ Education missing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Opportunities */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Recommended for You
          </h2>
          <Link href="/offres">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10">
              Explore More
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {opp.position}
                  </p>
                  <p className="text-xs text-muted-foreground">{opp.company}</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  {opp.match}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{opp.type}</span>
                  <span className="font-semibold text-foreground">
                    {opp.salary}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-linear-to-r from-primary to-secondary text-white text-xs h-8">
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
