"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { defaultImage, getName, handleLogout } from "@/services/helpers";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";

const UserConnected = () => {
  const user = useAuthStore((state) => state.admin);
  const router = useRouter();
  return (
    <div className="">
      <Menubar className="bg-transparent border-none">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent px-0 cursor-pointer border-none! shadow-none! mx-auto">
            <Avatar className="rounded-full">
              <AvatarImage src={user.image ?? defaultImage} />
              <AvatarFallback className="uppercase text-black bg-white">
                {getName(user?.fullname)}
              </AvatarFallback>
            </Avatar>
          </MenubarTrigger>
          <MenubarContent className="space-y-1 z-700 mr-2">
            <MenubarItem
              className="text-base space-x-3"
              onClick={() =>
                router.push(
                  user.role === "CANDIDATE"
                    ? "/user/dashboard"
                    : "/recruiter/dashboard"
                )
              }>
              <UserIcon size={18} />
              <span>{"Mon profil"}</span>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              className="text-base text-red-500 space-x-2"
              onClick={() => handleLogout(2)}>
              <LogOutIcon size={16} />
              <span>{"Se deconnecter"}</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default UserConnected;
