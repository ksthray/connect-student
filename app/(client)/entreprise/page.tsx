import { Metadata } from "next";
import { LoginPage } from "./components/login-recruiter";

export const metadata: Metadata = {
  title: "Connexion à la page entreprise",
};

export default function Page() {
  return (
    <main className="bg-gray-50">
      <LoginPage />
    </main>
  );
}
