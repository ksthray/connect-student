import SearchFilter from "./components/search-filter";
import OffresList from "./components/offres-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les opportunités et offres d'emploi",
};

import { Suspense } from "react";

export default function OffresPage() {
  return (
    <main className="">
      <Suspense fallback={<div>Chargement...</div>}>
        <SearchFilter />
      </Suspense>
      <OffresList />
    </main>
  );
}
