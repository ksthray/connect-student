/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Briefcase, Plus, Edit2, Trash2, Search } from "lucide-react";

interface Opportunity {
  id: number;
  title: string;
  type: "job_offer" | "internship" | "training";
  description: string;
  salary?: string;
  location: string;
  applications: number;
  views: number;
  postedDate: string;
  status: "active" | "closed" | "draft";
}

export default function RecruiterOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: "Senior Developer",
      type: "job_offer",
      description:
        "We are looking for an experienced Senior Developer with 5+ years of experience.",
      salary: "$120,000 - $150,000",
      location: "San Francisco, CA",
      applications: 124,
      views: 1245,
      postedDate: "2 weeks ago",
      status: "active",
    },
    {
      id: 2,
      title: "UX/UI Design Internship",
      type: "internship",
      description:
        "Join our design team as an intern and work on real projects.",
      location: "New York, NY",
      applications: 89,
      views: 856,
      postedDate: "3 weeks ago",
      status: "active",
    },
    {
      id: 3,
      title: "Marketing Training Program",
      type: "training",
      description:
        "Comprehensive digital marketing training program for professionals.",
      location: "Online",
      applications: 156,
      views: 1834,
      postedDate: "1 week ago",
      status: "active",
    },
    {
      id: 4,
      title: "Data Analyst",
      type: "job_offer",
      description: "Looking for a Data Analyst to join our analytics team.",
      salary: "$80,000 - $100,000",
      location: "Chicago, IL",
      applications: 67,
      views: 512,
      postedDate: "5 days ago",
      status: "draft",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "job_offer" | "internship" | "training"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "closed" | "draft"
  >("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    type: "job_offer" | "internship" | "training";
    description: string;
    salary: string;
    location: string;
  }>({
    title: "",
    type: "job_offer",
    description: "",
    salary: "",
    location: "",
  });

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || opp.type === filterType;
    const matchesStatus = filterStatus === "all" || opp.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddOpportunity = () => {
    if (!formData.title || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      setOpportunities(
        opportunities.map((opp) =>
          opp.id === editingId
            ? {
                ...opp,
                title: formData.title,
                type: formData.type,
                description: formData.description,
                salary: formData.salary,
                location: formData.location,
              }
            : opp
        )
      );
      setEditingId(null);
    } else {
      const newOpportunity: Opportunity = {
        id: Math.max(...opportunities.map((o) => o.id), 0) + 1,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        salary: formData.salary,
        location: formData.location,
        applications: 0,
        views: 0,
        postedDate: "just now",
        status: "draft",
      };
      setOpportunities([...opportunities, newOpportunity]);
    }

    setFormData({
      title: "",
      type: "job_offer",
      description: "",
      salary: "",
      location: "",
    });
    setShowForm(false);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setFormData({
      title: opportunity.title,
      type: opportunity.type as "job_offer" | "internship" | "training",
      description: opportunity.description,
      salary: opportunity.salary || "",
      location: opportunity.location,
    });
    setEditingId(opportunity.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setOpportunities(opportunities.filter((opp) => opp.id !== id));
    setDeleteId(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "job_offer":
        return "Job Offer";
      case "internship":
        return "Internship";
      case "training":
        return "Training Program";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job_offer":
        return "bg-blue-100 text-blue-700";
      case "internship":
        return "bg-purple-100 text-purple-700";
      case "training":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="space-y-6 p-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Opportunities
            </h1>
            <p className="text-muted-foreground">
              Create and manage job offers, internships, and training programs.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                type: "job_offer",
                description: "",
                salary: "",
                location: "",
              });
              setShowForm(!showForm);
            }}
            className="bg-linear-to-r from-primary to-secondary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              {editingId ? "Edit Opportunity" : "Create New Opportunity"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <Input
                  placeholder="e.g., Senior Developer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as
                        | "job_offer"
                        | "internship"
                        | "training",
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
                  <option value="job_offer">Job Offer</option>
                  <option value="internship">Internship</option>
                  <option value="training">Training Program</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <Input
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Salary (optional)
                </label>
                <Input
                  placeholder="e.g., $120,000 - $150,000"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the opportunity, requirements, and responsibilities..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 font-sans"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddOpportunity}
                className="bg-linear-to-r from-primary to-secondary text-white">
                {editingId ? "Update Opportunity" : "Create Opportunity"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    type: "job_offer",
                    description: "",
                    salary: "",
                    location: "",
                  });
                }}
                className="border-border">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="all">All Types</option>
              <option value="job_offer">Job Offers</option>
              <option value="internship">Internships</option>
              <option value="training">Training Programs</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 bg-white">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Location
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground text-sm">
                    Applications
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground text-sm">
                    Views
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
                {filteredOpportunities.map((opp) => (
                  <tr
                    key={opp.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">
                          {opp.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opp.postedDate}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          opp.type
                        )}`}>
                        {getTypeLabel(opp.type)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {opp.location}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-foreground">
                        {opp.applications}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {opp.views}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          opp.status
                        )}`}>
                        {opp.status.charAt(0).toUpperCase() +
                          opp.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(opp)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(opp.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No opportunities found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this opportunity? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel className="border-border">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
