import Image from "next/image";
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";
import { socials_networks } from "@/services/helpers";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-100 pt-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8 pt-6 pb-28">
        {/* Logo et description */}
        <div className="md:col-span-1">
          <div className="flex items-center mb-3">
            <Image
              src="/images/connect-student-logo.png" // change selon ton chemin de logo
              alt="Connect Student Logo"
              width={500}
              height={500}
              className="w-[150px]"
            />
          </div>
          <p className="text-sm text-gray-100 max-w-xs">
            Mettre en relation les étudiants et les diplômés avec leurs
            prochaines opportunités.
          </p>
        </div>

        {/* Produits */}
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-premiere">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/offres" className="hover:text-premiere">
                Les offres
              </Link>
            </li>
            <li>
              <Link href="/entreprise" className="hover:text-premiere">
                Pour les entreprises
              </Link>
            </li>
            <Link href="/pricing" className="hover:text-premiere">
              Tarifs
            </Link>
          </ul>
        </div>

        {/* Entreprise */}
        <div>
          <h4 className="font-semibold mb-3">Entreprise</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/a-propos" className="hover:text-premiere">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-premiere">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + réseaux sociaux */}
        <div>
          <h4 className="font-semibold mb-3">Entrer en contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="mailto:contact@connect-student.com" className="underline">
                contact@connect-student.com
              </Link>
            </li>
            <li>
              <Link href="tel:+243989281540" className="underline">
                +243 989 281 540
              </Link>
            </li>
            <li>Avenue OUA, N°01, Quartier Basoko, Commune de Ngaliema,
              Kinshasa – République Démocratique du Congo</li>
          </ul>

          <div className="flex space-x-3 mt-4">
            {socials_networks.map((social, index) => (
              <Link key={index} href={social.url} target="_blank" className="hover:text-premiere hover:translate-y-[-5px] transition-all duration-300">
                <Image src={social.icon} alt={social.name} width={24} height={24} className="" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-200 flex flex-col md:flex-row justify-between items-center px-6">
        <p>© 2026 Connect Student. Tous droits réservés.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="/pdf/pdc.pdf" target="_blank" className="hover:text-premiere">
            Politique de confidentialité
          </Link>
          <Link href="/pdf/cgu.pdf" target="_blank" className="hover:text-premiere">
            Conditions d&apos;utilisation
          </Link>
        </div>
      </div>
    </footer>
  );
}
