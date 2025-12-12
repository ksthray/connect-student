import Image from "next/image";
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-100 pt-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8 pt-6 pb-28">
        {/* Logo et description */}
        <div className="md:col-span-1">
          <div className="flex items-center mb-3">
            <Image
              src="/images/connect-student-logo.png" // change selon ton chemin de logo
              alt="Student Connect Logo"
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
          <h4 className="font-semibold mb-3">Produits</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-premiere">
                Accueil
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-premiere">
                Les offres
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-premiere">
                Pour les entreprises
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-premiere">
                Tarifs
              </a>
            </li>
          </ul>
        </div>

        {/* Entreprise */}
        <div>
          <h4 className="font-semibold mb-3">Entreprise</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-premiere">
                À propos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-premiere">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + réseaux sociaux */}
        <div>
          <h4 className="font-semibold mb-3">Entrer en contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="mailto:hello@studentconnect.com" className="underline">
                hello@studentconnect.com
              </a>
            </li>
            <li>+234820091675</li>
            <li>123 Tech Street, Innovation City, IC 12345</li>
            <li>
              <a href="#" className="hover:text-premiere">
                Tarifs
              </a>
            </li>
          </ul>

          <div className="flex space-x-3 mt-4">
            <a href="#" className="hover:text-premiere">
              <Music2 className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-premiere">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-premiere">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-premiere">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-200 flex flex-col md:flex-row justify-between items-center px-6">
        <p>© 2025 Student Connect. Tous droits réservés.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-premiere">
            Politique de confidentialité
          </a>
          <a href="#" className="hover:text-premiere">
            Conditions d&apos;utilisation
          </a>
        </div>
      </div>
    </footer>
  );
}
