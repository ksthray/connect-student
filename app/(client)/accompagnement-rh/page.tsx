
import { Metadata } from "next";
import RhClientPage from "./components/rh-client-page";

export const metadata: Metadata = {
  title: "Accompagnement RH - Connect Student",
  description:
    "Service de recrutement ciblé et structuré pour les entreprises. Accédez à des profils qualifiés issus de notre base de données d’étudiants et de jeunes diplômés.",
};

export default function AccompagnementRhPage() {
  return <RhClientPage />;
}
