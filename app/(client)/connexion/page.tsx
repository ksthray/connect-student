import { Metadata } from "next";
import Login from "./components/login";

export const metadata: Metadata = {
  title: "Connexion - Connect Student",
};

export default function LoginPage() {
  return (
    <main className="bg-gray-50">
      <Login />
    </main>
  );
}
