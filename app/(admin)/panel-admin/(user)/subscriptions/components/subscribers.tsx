"use client";

import React, { useState } from "react";
import { getTierColor } from "../page-ui";
import { Eye, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { SubscribersType } from "@/entities/types";
import { Badge } from "@/components/ui/badge";
import { frDate } from "@/services/helpers";
import { AppTable } from "@/components/admin/app-table";

const Subscribers = ({ subscribers }: { subscribers: SubscribersType[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns: ColumnDef<SubscribersType>[] = [
    {
      accessorKey: "user",
      header: "Abonné",
      cell: ({ row }) => (
        <div className="text-sm flex flex-col">
          <span className="text-md font-black">
            {row.original.user.fullname}
          </span>
          <span className="text-gray-600 text-md">
            {row.original.user.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <div>
          <Badge className={`text-sm ${getTierColor(row.original.plan)}`}>
            {row.original.plan}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div>
          <Badge className={`text-sm ${getStatusColor(row.original.status)}`}>
            {row.original.status}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Date du début",
      cell: ({ row }) => <div>{frDate(row.original.startDate)}</div>,
    },
    {
      accessorKey: "renewalDate",
      header: "Renouvellement",
      cell: ({ row }) => <div>{frDate(row.original.renewalDate)}</div>,
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => console.log(row.original)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              {/* <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 h-11"
              /> */}
            </div>

            {/* <select
              value={filterTier}
              onChange={(e) =>
                setFilterTier(
                  e.target.value as "all" | "Freemium" | "Standard" | "Premium"
                )
              }
              className="px-4 h-11 rounded-lg border-2 border-input focus:outline-none focus:border-secondary text-foreground">
              <option value="all">All Plans</option>
              <option value="Freemium">Freemium</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "expired" | "cancelled"
                )
              }
              className="px-4 h-11 rounded-lg border-2 border-input focus:outline-none focus:border-secondary text-foreground">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select> */}
          </div>
        </div>

        {/* Users Table */}
        <div className="w-full bg-white p-4 mt-6 rounded-md border-2 border-gray-200">
          <AppTable activeSearch={false} data={subscribers} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
