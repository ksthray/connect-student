import { Metadata } from "next";
import AuthPage from "./components/auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Connexion - Connect Student",
};

export default function Page() {
  return (
    <main className="bg-gray-50">
      <Suspense fallback={<Loading />}>
        <AuthPage />
      </Suspense>
    </main>
  );
}

function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Skeleton className="w-full h-72 bg-gray-300 rounded-lg" />
    </div>
  );
}