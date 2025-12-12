"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  MessageSquare,
  Trash2,
} from "lucide-react";

interface Application {
  id: number;
  position: string;
  company: string;
  type: "job_offer" | "internship" | "training";
  location: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  appliedDate: string;
  salary?: string;
  companyImage: string;
  lastUpdate: string;
  notes: string;
}

export default function CandidateApplications() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      position: "Senior Developer",
      company: "Tech Innovations Inc.",
      type: "job_offer",
      location: "San Francisco, CA",
      status: "reviewing",
      appliedDate: "3 days ago",
      salary: "$120k - $150k",
      companyImage: "tech_innovations.jpg",
      lastUpdate: "2 hours ago",
      notes:
        "Your profile has been shortlisted. Expect an interview invitation soon.",
    },
    {
      id: 2,
      position: "UX/UI Designer Internship",
      company: "Creative Minds Agency",
      type: "internship",
      location: "New York, NY",
      status: "accepted",
      appliedDate: "1 week ago",
      salary: "Unpaid",
      companyImage: "creative_minds.jpg",
      lastUpdate: "3 days ago",
      notes:
        "Congratulations! You have been accepted. Check your email for next steps.",
    },
    {
      id: 3,
      position: "Data Analyst",
      company: "Finance Forward Group",
      type: "job_offer",
      location: "Chicago, IL",
      status: "rejected",
      appliedDate: "2 weeks ago",
      salary: "$80k - $100k",
      companyImage: "finance_forward.jpg",
      lastUpdate: "1 week ago",
      notes:
        "Thank you for your interest. We have decided to move forward with other candidates.",
    },
    {
      id: 4,
      position: "Frontend Engineer",
      company: "Global Solutions Ltd",
      type: "job_offer",
      location: "Remote",
      status: "pending",
      appliedDate: "5 days ago",
      salary: "$100k - $130k",
      companyImage: "global_solutions.jpg",
      lastUpdate: "5 days ago",
      notes: "Your application is being reviewed by the hiring team.",
    },
    {
      id: 5,
      position: "Product Manager Training Program",
      company: "Leadership Academy",
      type: "training",
      location: "Online",
      status: "pending",
      appliedDate: "1 week ago",
      companyImage: "leadership_academy.jpg",
      lastUpdate: "1 week ago",
      notes: "We will notify you within 5-7 business days.",
    },
    {
      id: 6,
      position: "Backend Developer",
      company: "StartUp Solutions",
      type: "job_offer",
      location: "Boston, MA",
      status: "reviewing",
      appliedDate: "1 day ago",
      salary: "$110k - $140k",
      companyImage: "startup_solutions.jpg",
      lastUpdate: "4 hours ago",
      notes: "Initial screening completed. Moving to next round.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesType = filterType === "all" || app.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job_offer":
        return "bg-blue-50 border-blue-200";
      case "internship":
        return "bg-purple-50 border-purple-200";
      case "training":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "job_offer":
        return "Job Offer";
      case "internship":
        return "Internship";
      case "training":
        return "Training";
      default:
        return type;
    }
  };

  const handleWithdraw = (id: number) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track all your job applications and their current status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Total
          </p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-blue-600 mb-2">Pending</p>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-yellow-600 mb-2">Reviewing</p>
          <p className="text-2xl font-bold text-foreground">
            {stats.reviewing}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-green-600 mb-2">Accepted</p>
          <p className="text-2xl font-bold text-foreground">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-red-600 mb-2">Rejected</p>
          <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by position or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
            <option value="all">All Types</option>
            <option value="job_offer">Job Offers</option>
            <option value="internship">Internships</option>
            <option value="training">Training Programs</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No applications found</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`rounded-xl border ${getTypeColor(
                app.type
              )} p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {app.position}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.company}
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
                      <span>{app.location}</span>
                      <span>•</span>
                      <span>{getTypeLabel(app.type)}</span>
                      {app.salary && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-foreground">
                            {app.salary}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="bg-white bg-opacity-50 rounded-lg p-3 my-3">
                      <p className="text-sm text-foreground">{app.notes}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Applied {app.appliedDate}</span>
                      <span>•</span>
                      <span>Last update: {app.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-current border-opacity-10">
                <Button
                  variant="outline"
                  className="border-current text-current">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  className="border-current text-current">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                  onClick={() => handleWithdraw(app.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
