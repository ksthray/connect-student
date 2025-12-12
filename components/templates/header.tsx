"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

type MenuType = {
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
    ${
      isScrolled
        ? "bg-white backdrop-blur-md"
        : "bg-transparent backdrop-blur-none"
    }
  `;

  // Classes conditionnelles pour le menu mobile
  const mobileMenuClasses = `
    md:hidden border-t border-gray-100 shadow-lg transition-all duration-300
    ${isScrolled ? "bg-white/90" : "bg-white"}
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/connect-student-logo.png"
            alt="Student Connect Logo"
            width={500}
            height={500}
            className="object-contain w-[100px] md:w-[120px] 2xl:w-[150px]"
          />
        </Link>

        {/* Navigation (desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.link}
              className="hover:text-premiere transition-colors">
              {menu.name}
            </Link>
          ))}
        </nav>

        {/* Actions (desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            asChild
            variant="outline"
            className="text-sm border-premiere bg-transparent text-premiere hover:bg-white/80 hover:text-premiere">
            <Link href="/se-reabonner">Payer l&apos;abonnement</Link>
          </Button>
          <Button
            asChild
            className="bg-premiere hover:bg-premiere-foreground text-white text-sm">
            <Link href="/connexion">Se connecter</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle menu">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={mobileMenuClasses}>
          <nav className="flex flex-col p-4 space-y-3 text-gray-700">
            {menus.map((menu) => (
              <Link
                key={menu.id}
                href={menu.link}
                onClick={toggleMenu}
                className="hover:text-premiere transition-colors">
                {menu.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
              <Button
                variant="outline"
                className="border-premiere bg-transparent text-premiere hover:bg-white/80 hover:text-premiere"
                asChild
                onClick={toggleMenu}>
                <Link href="/se-reabonner">Payer l&apos;abonnement</Link>
              </Button>
              <Button
                className="bg-premiere hover:bg-premiere-foreground text-white"
                asChild
                onClick={toggleMenu}>
                <Link href="/connexion">Se connecter</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
