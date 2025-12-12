import { Metadata } from "next";
import Faq from "./components/faq";
import HeroEntreprise from "./components/hero-entreprise";
import HowItWorks from "./components/how-it-works";
import Why from "./components/why";

export const metadata: Metadata = {
  title: "Entreprises & Partenariat - Connect Student",
};

export default function EntreprisePage() {
  return (
    <main className="">
      <HeroEntreprise />
      <Why />
      <HowItWorks />
      <Faq />
    </main>
  );
}
