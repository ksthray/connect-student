/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import React, { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ContactType } from "@/entities/types";
import { useFetch } from "@/services/query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultImage, getName } from "@/services/helpers";
import SeeMessage from "./components/see-message";
import { AppTable } from "@/components/admin/app-table";

const Contacts = ({ token }: { token: string }) => {
  const { data, isLoading } = useFetch({
    route: "/admin/messages",
    query: "contacts",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const contacts: ContactType[] = data?.data || [];

  const [message, setmessage] = useState<ContactType | any>({});
  const [openMessage, setopenMessage] = useState(false);

  function shortMessage(msg: string) {
    if (msg.length > 150) return `${msg.substring(0, 150)}...`;

    return msg;
  }

  const columns: ColumnDef<ContactType>[] = [
    {
      accessorKey: "fullname",
      header: "Personne",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="capitalize flex items-center gap-2">
            <Avatar className="rounded-full">
              <AvatarImage src={defaultImage} />
              <AvatarFallback className="uppercase text-sm">
                {getName(user.fullname)}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user.fullname}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => <div className="">{row.getValue("phone")}</div>,
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
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const item = row.original;
        return <div className="w-[250px]">{shortMessage(item.message)}</div>;
      },
    },
    {
      accessorKey: "voir",
      header: "",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="">
            <Button
              variant={"secondary"}
              onClick={() => {
                setmessage(item);
                setopenMessage(!openMessage);
              }}>
              Voir le message <Eye size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="w-full rounded-md bg-white p-6">
        <div className="w-full flex items-center justify-between">
          <div className="">
            <h2>Messages reçus</h2>
          </div>
        </div>
        <Separator className="mt-4" />
        {!isLoading ? (
          <AppTable activeSearch={true} data={contacts} columns={columns} />
        ) : (
          <Skeleton className="w-full h-72" />
        )}
      </div>
      <SeeMessage
        open={openMessage}
        setopen={setopenMessage}
        message={message}
      />
    </div>
  );
};

export default Contacts;
