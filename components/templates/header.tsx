"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuthStore } from "@/store/store";
import { usePathname } from "next/navigation";
import MenuMobile from "./mobile-menu";
import UserConnected from "./user-connected";

export type MenuType = {
  id: number;
  name: string;
  link: string;
};

const menus: MenuType[] = [
  {
    id: 1,
    name: "Accueil",
    link: "/",
  },
  {
    id: 2,
    name: "Les offres",
    link: "/offres",
  },
  {
    id: 3,
    name: "Entreprises",
    link: "/entreprises",
  },
  {
    id: 4,
    name: "À propos",
    link: "/a-propos",
  },
  {
    id: 5,
    name: "Contact",
    link: "/contact",
  },
];

export default function Header() {
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // État pour suivre si la page a été défilée
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Fonction pour gérer l'événement de défilement
    const handleScroll = () => {
      // Définir la condition de défilement (ex: après 50px de défilement)
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Attacher l'écouteur d'événement au montage du composant
    window.addEventListener("scroll", handleScroll);

    // Nettoyer l'écouteur d'événement au démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  // Classes conditionnelles basées sur l'état de défilement
  const headerClasses = `
    fixed top-0 left-0 w-full z-50 transition-all duration-300
    ${isScrolled
      ? "bg-white backdrop-blur-md"
      : "bg-transparent backdrop-blur-none"
    }
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/connect-student-logo.png"
            alt="Connect Student Logo"
            width={500}
            height={500}
            className="object-contain w-[100px] md:w-[120px] 2xl:w-[150px]"
          />
        </Link>

        {/* Navigation (desktop) */}
        <nav className="xl:block hidden">
          <ul className="flex items-center space-x-8 text-gray-700 font-medium">
            {menus.map((menu) => (
              <Link
                key={menu.id}
                href={menu.link}
                className={`hover:text-premiere transition-colors ${pathname === menu.link && "text-premiere"
                  }`}>
                {menu.name}
              </Link>
            ))}
          </ul>
        </nav>

        {/* Actions (desktop) */}
        <div className="hidden xl:flex items-center gap-3">
          {/* <Button
            asChild
            variant="outline"
            className="text-sm border-premiere bg-transparent text-premiere hover:bg-white/80 hover:text-premiere">
            <Link href="/se-reabonner">Payer l&apos;abonnement</Link>
          </Button> */}
          {token ? (
            <UserConnected />
          ) : (
            <Button
              asChild
              className="bg-premiere hover:bg-premiere-foreground text-white text-sm">
              <Link href="/connexion">Se connecter</Link>
            </Button>
          )}
        </div>
        <div className="xl:hidden flex items-center gap-2">
          {token && <UserConnected />}
          <MenuMobile
            open={isOpen}
            setopen={setIsOpen}
            menus={menus}
            toggleMenu={toggleMenu}
            path={pathname}
          />
        </div>
      </div>
    </header>
  );
}
