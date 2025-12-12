import { Metadata } from "next";
import FormContact from "./components/form-contact";
import HeroContact from "./components/hero-contact";
import SocialNetwork from "./components/social-network";

export const metadata: Metadata = {
  title: "Contact - Connect Student",
};

export default function ContactPage() {
  return (
    <main className="">
      <HeroContact />
      <FormContact />
      <SocialNetwork />
    </main>
  );
}
