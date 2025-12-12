import HowItWorks from "@/components/home/how-it-works";
import HeroAbout from "./components/hero-about";
import History from "./components/history";
import Statistique from "./components/statistiques";
import Technology from "./components/technology";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Connect Student",
};

export default function AboutPage() {
  return (
    <main className="">
      <HeroAbout />
      <Statistique />
      <History />
      <HowItWorks />
      <Technology />
    </main>
  );
}
