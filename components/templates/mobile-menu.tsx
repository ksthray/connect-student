"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/store";
import { handleLogout } from "@/services/helpers";
import { MenuType } from "./header";

const MenuMobile = ({
  open,
  setopen,
  menus,
  toggleMenu,
  path,
}: {
  open: boolean;
  setopen: (value: boolean) => void;
  menus: MenuType[];
  toggleMenu: () => void;
  path?: string;
}) => {
  const token = useAuthStore((state) => state.token);
  return (
    <Sheet open={open} onOpenChange={setopen}>
      <SheetTrigger asChild>
        <Menu size={24} className={"text-black"} />
      </SheetTrigger>
      <SheetContent className="z-600">
        <SheetHeader>
          <SheetTitle>MENU</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4 space-y-3 text-gray-700">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.link}
              onClick={toggleMenu}
              className={`hover:text-premiere transition-colors ${path === menu.link && "text-premiere"
                }`}>
              {menu.name}
            </Link>
          ))}
        </nav>
        <SheetFooter>
          {/* <Button
            variant="outline"
            className="border-premiere bg-transparent text-premiere hover:bg-white/80 hover:text-premiere"
            asChild
            onClick={toggleMenu}>
            <Link href="/se-reabonner">Payer l&apos;abonnement</Link>
          </Button> */}
          {token ? (
            <Button
              onClick={() => handleLogout(2)}
              variant={"destructive"}
              className="w-full rounded-full">
              <LogOut /> Se deconnecter
            </Button>
          ) : (
            <Button
              className="bg-premiere hover:bg-premiere-foreground text-white"
              asChild
              onClick={toggleMenu}>
              <Link href="/connexion">Se connecter</Link>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MenuMobile;
