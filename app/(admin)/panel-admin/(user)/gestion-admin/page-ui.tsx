"use client";

import React, { useState } from "react";

import { Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/services/query";
import { UserAdmin } from "@/entities/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getName } from "@/services/helpers";
import AddUserAdmin from "./add.user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateUserAdmin from "./update.user";
import { Badge } from "@/components/ui/badge";

export default function GestAdmin({ token }: { token: string }) {
  const { data, isLoading } = useFetch({
    route: "/admin/register",
    query: "admins",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const admins: UserAdmin[] = data?.data || [];

  const [open, setopen] = useState(false);

  const [openUpdateAdmin, setopenUpdateAdmin] = useState(false);
  const [admin, setadmin] = useState<UserAdmin | unknown>({});

  return (
    <div className="space-y-6 p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des administrateurs
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer et superviser tous les admins de la plateforme
          </p>
        </div>
        <Button
          onClick={() => setopen(!open)}
          className="linear-premiere text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter un admin
        </Button>
      </div>
      <div className="w-full gap-4 grid grid-cols-3 mt-6">
        {!isLoading ? (
          <>
            {admins?.map((admin, index) => (
              <Card
                key={index}
                className="flex flex-col justify-center items-center gap-4 p-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={admin.fullname} />
                  <AvatarFallback className="font-semibold uppercase">
                    {getName(admin.fullname)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-md text-center font-medium uppercase">
                  {admin.fullname}
                </h4>
                <Badge className={`text-[12px]`}>{admin.role}</Badge>
                <div className="flex">
                  <Edit
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setadmin(admin);
                      setopenUpdateAdmin(true);
                    }}
                  />
                  <Trash2
                    size={20}
                    className="text-red-500 cursor-pointer ml-4"
                    onClick={() => {
                      // Handle delete action here
                    }}
                  />
                </div>
              </Card>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4].map((_, i) => (
              <Skeleton key={i} className="w-full h-60 bg-white" />
            ))}
          </>
        )}
      </div>
      <AddUserAdmin open={open} setopen={setopen} />
      <UpdateUserAdmin
        open={openUpdateAdmin}
        setopen={setopenUpdateAdmin}
        admin={admin as UserAdmin}
      />
    </div>
  );
}
