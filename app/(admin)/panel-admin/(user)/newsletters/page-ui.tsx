"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { NewsletterType } from "@/entities/types";
import { useFetch } from "@/services/query";
import { Skeleton } from "@/components/ui/skeleton";
import { AppTable } from "@/components/admin/app-table";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

const Newsletters = ({ token }: { token: string }) => {
  const { data, isLoading } = useFetch({
    route: "/admin/newsletter",
    query: "newsletters",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const newsletters: NewsletterType[] = data?.data || [];

  const columns: ColumnDef<NewsletterType>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="w-full flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Gestion de la newsletter</h2>
          <p className="text-sm text-gray-500">
            Gérer les newsletter de l&apos;académie
          </p>
        </div>
        <Button>
          Exporter <File size={20} />
        </Button>
      </div>
      <Separator className="mt-4" />
      {!isLoading ? (
        <AppTable activeSearch={true} data={newsletters} columns={columns} />
      ) : (
        <Skeleton className="w-full h-72" />
      )}
    </div>
  );
};

export default Newsletters;
