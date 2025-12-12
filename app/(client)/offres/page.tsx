import SearchFilter from "./components/search-filter";
import OffresList from "./components/offres-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les opportunités et offres d'emploi - Connect Student",
};

export default function OffresPage() {
  return (
    <main className="">
      <SearchFilter />
      <OffresList />
    </main>
  );
}
