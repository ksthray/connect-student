"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Briefcase, Clock, GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useQueryState } from "nuqs";

export default function SearchFilter() {
  const [words] = useQueryState("words");
  const [searchQuery, setSearchQuery] = useState(words || "");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/recherche?words=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full pt-32 pb-12 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
        <div className="w-full space-y-4 text-center flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Découvrez votre prochaine{" "}
            <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
              opportunité
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Parcourez des milliers d&apos;offres d&apos;emploi, de stages et de
            formations sélectionnées spécialement pour vous. Trouvez le poste
            qui correspond à vos compétences et à vos objectifs de carrière.
          </p>
          <div className="mt-4 flex flex-col md:flex-row items-center gap-3 w-full max-w-xl mx-auto">
            <Input
              placeholder="Rechercher un emploi, un stage..."
              className="bg-white h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button className="w-full md:w-auto h-12" onClick={handleSearch}>
              <Search size={20} className="mr-2" /> Rechercher
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
