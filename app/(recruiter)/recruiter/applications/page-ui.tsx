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
import { useFetch } from "@/services/query";
import { frDate } from "@/services/helpers";

interface ApplicationType {
  id: string;
  status: "PENDING";
  createdAt: Date;
  jobOffer: {
    title: string;
    type:
      | "INTERNSHIP"
      | "FULL_TIME"
      | "PART_TIME"
      | "CONFERENCE"
      | "EVENT"
      | "TRAINING";
  };
  candidate: {
    id: string;
    user: {
      fullname: string;
      email: string;
      phone: string;
    };
  };
}

export default function RecruiterApplications({ token }: { token: string }) {
  const { data, isLoading } = useFetch({
    route: "/recruiter/applications",
    query: "applications",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const applications: ApplicationType[] = data?.data || [];

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

  return (
    <>
      <div className="space-y-6 p-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Candidatures
          </h1>
          <p className="text-muted-foreground">
            Suivez et gérez toutes les candidatures reçues pour vos offres
            d&apos;emploi.{" "}
          </p>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Candidant
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Job
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground text-sm">
                    Date
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
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">
                          {app?.candidate.user.fullname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app?.candidate.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-foreground">
                        {app?.jobOffer.title}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-muted-foreground">
                        {frDate(app?.createdAt)}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(app?.status)}
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
                          // onClick={() => {
                          //   setSelectedApp(app);
                          //   setShowDetailModal(true);
                          // }}
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

          {applications.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No applications found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
