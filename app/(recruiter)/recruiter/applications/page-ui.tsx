"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  FileText,
  Search,
  Eye,
  Download,
  MessageSquare,
  Check,
  X,
  Clock,
} from "lucide-react";

interface Application {
  id: number;
  applicantName: string;
  position: string;
  appliedDate: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "accepted";
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  rating: number;
  resume: string;
  coverLetter: string;
}

export default function RecruiterApplications() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      applicantName: "Sarah Johnson",
      position: "Senior Developer",
      appliedDate: "2 hours ago",
      status: "reviewing",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0101",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      experience: "6 years of experience in full-stack development",
      rating: 4.5,
      resume: "sarah_resume.pdf",
      coverLetter: "Sarah has extensive experience in modern web development.",
    },
    {
      id: 2,
      applicantName: "Michael Chen",
      position: "Product Designer",
      appliedDate: "1 day ago",
      status: "shortlisted",
      email: "michael.chen@email.com",
      phone: "+1-555-0102",
      skills: ["UI/UX Design", "Figma", "Prototyping", "User Research"],
      experience: "4 years of experience in product design",
      rating: 4.8,
      resume: "michael_resume.pdf",
      coverLetter:
        "Michael is passionate about creating user-centered designs.",
    },
    {
      id: 3,
      applicantName: "Emma Wilson",
      position: "Marketing Manager",
      appliedDate: "2 days ago",
      status: "new",
      email: "emma.wilson@email.com",
      phone: "+1-555-0103",
      skills: [
        "Digital Marketing",
        "Content Strategy",
        "Analytics",
        "Leadership",
      ],
      experience: "5 years of marketing management experience",
      rating: 4.2,
      resume: "emma_resume.pdf",
      coverLetter:
        "Emma brings strong marketing expertise and team leadership.",
    },
    {
      id: 4,
      applicantName: "David Brown",
      position: "Data Analyst",
      appliedDate: "3 days ago",
      status: "reviewing",
      email: "david.brown@email.com",
      phone: "+1-555-0104",
      skills: ["Python", "SQL", "Tableau", "Excel", "Statistics"],
      experience: "3 years of data analysis experience",
      rating: 4.0,
      resume: "david_resume.pdf",
      coverLetter: "David has strong analytical and problem-solving skills.",
    },
    {
      id: 5,
      applicantName: "Lisa Anderson",
      position: "Senior Developer",
      appliedDate: "5 days ago",
      status: "rejected",
      email: "lisa.anderson@email.com",
      phone: "+1-555-0105",
      skills: ["Java", "Spring Boot", "MySQL"],
      experience: "2 years of backend development",
      rating: 3.5,
      resume: "lisa_resume.pdf",
      coverLetter: "Lisa is interested in senior-level positions.",
    },
    {
      id: 6,
      applicantName: "Robert Martinez",
      position: "Product Designer",
      appliedDate: "1 week ago",
      status: "accepted",
      email: "robert.martinez@email.com",
      phone: "+1-555-0106",
      skills: ["UI/UX Design", "Adobe XD", "Interaction Design"],
      experience: "5 years of design experience",
      rating: 4.7,
      resume: "robert_resume.pdf",
      coverLetter: "Robert is excited to join the team.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const positions = Array.from(
    new Set(applications.map((app) => app.position))
  );

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      filterPosition === "all" || app.position === filterPosition;
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const handleStatusChange = (
    appId: number,
    newStatus: Application["status"]
  ) => {
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-purple-100 text-purple-700";
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
      case "new":
        return <Clock className="w-4 h-4" />;
      case "reviewing":
        return <Eye className="w-4 h-4" />;
      case "shortlisted":
        return <Check className="w-4 h-4" />;
      case "accepted":
        return <Check className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const applicationStats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <>
      <div className="space-y-6 p-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Applications
          </h1>
          <p className="text-muted-foreground">
            Track and manage all applications received for your opportunities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Total
            </p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.total}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-blue-600 mb-2">New</p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.new}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-yellow-600 mb-2">
              Reviewing
            </p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.reviewing}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-purple-600 mb-2">
              Shortlisted
            </p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.shortlisted}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-green-600 mb-2">Accepted</p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.accepted}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-red-600 mb-2">Rejected</p>
            <p className="text-2xl font-bold text-foreground">
              {applicationStats.rejected}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>

            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="all">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Applicant
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Position
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Applied
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground text-sm">
                    Rating
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground text-sm">
                    Status
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">
                          {app.applicantName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-foreground">{app.position}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-muted-foreground">
                        {app.appliedDate}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-foreground">
                          {app.rating}
                        </span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(app.status)}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            app.status
                          )}`}>
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                          title="Send Message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No applications found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedApp.applicantName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedApp.position}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </p>
                    <p className="text-foreground">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Phone
                    </p>
                    <p className="text-foreground">{selectedApp.phone}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Experience
                </h3>
                <p className="text-foreground">{selectedApp.experience}</p>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Cover Letter
                </h3>
                <p className="text-foreground bg-gray-50 p-4 rounded-lg">
                  {selectedApp.coverLetter}
                </p>
              </div>

              {/* Rating and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {selectedApp.rating}
                    </span>
                    <span className="text-2xl text-yellow-400">⭐</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </p>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => {
                      handleStatusChange(
                        selectedApp.id,
                        e.target.value as Application["status"]
                      );
                      setApplications(
                        applications.map((app) =>
                          app.id === selectedApp.id
                            ? {
                                ...app,
                                status: e.target.value as Application["status"],
                              }
                            : app
                        )
                      );
                      setSelectedApp({
                        ...selectedApp,
                        status: e.target.value as Application["status"],
                      });
                    }}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white w-full">
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Document Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Documents
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">
                        {selectedApp.resume}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button
                  onClick={() => setShowDetailModal(false)}
                  variant="outline"
                  className="flex-1 border-border">
                  Close
                </Button>
                <Button
                  className="flex-1 bg-linear-to-r from-primary to-secondary text-white"
                  onClick={() => setShowDetailModal(false)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
