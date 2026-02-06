import { Metadata } from "next";
import AuthPage from "./components/auth";

export const metadata: Metadata = {
  title: "Connexion - Connect Student",
};

export default function Page() {
  return (
    <main className="bg-gray-50">
      <AuthPage />
    </main>
  );
}
