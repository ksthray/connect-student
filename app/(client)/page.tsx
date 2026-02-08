import EnterpriseSection from "@/components/home/enterprise-section";
import FinalCTA from "@/components/home/finale-cta";
import HeroSection from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import Newsletter from "@/components/home/newsletter";
import OffresSection from "@/components/home/offres-section";
import Testimonials from "@/components/home/testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
};

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <HowItWorks />
      <OffresSection />
      <EnterpriseSection />
      <Testimonials />
      <FinalCTA />
      <Newsletter />
    </div>
  );
}
