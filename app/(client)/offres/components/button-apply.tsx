// src/app/(main)/offres/[slug]/components/ButtonApply.tsx
"use client"; // <--- CECI EST ESSENTIEL POUR LE MARQUER COMME COMPOSANT CLIENT

import { ApplyModal } from "@/components/apply-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MyProfilType } from "@/entities/types";
import { getActionText } from "@/services/helpers";
import { useFetch } from "@/services/query";
import { useAuthStore } from "@/store/store";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type ApplyButtonProps = {
  offerType: string;
  offerSlug: string; // Slug (pour la navigation si besoin)
  offerTitle: string; // Titre (pour le modal)
};

const ButtonApply: React.FC<ApplyButtonProps> = ({
  offerType,
  offerSlug,
  offerTitle,
}) => {
  const token = useAuthStore((s) => s.token);
  const {
    data: candidateData,
    isLoading,
  } = useFetch({
    route: "/candidate/myprofil",
    query: "me",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    enabled: !!token,
  });

  const myProfile: MyProfilType = candidateData?.data;

  const searchParams = useSearchParams();
  const [openApply, setopenApply] = useState(false);

  useEffect(() => {
    const openModalParam = searchParams.get("openModal");
    if (openModalParam === "true") {
      toast.info("Vous pouvez postuler maintenant !");

      // OPTIONNEL: Nettoyer l'URL après l'ouverture pour éviter une réouverture au rechargement
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("openModal");
      window.history.replaceState(null, "", newUrl.toString());
    }
  }, [searchParams]);

  const handleClick = () => {
    // 2. Ouvrir le modal au clic
    setopenApply(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="linear-premiere hover:bg-premiere cursor-pointer text-white font-semibold h-12 px-8">
        {getActionText(offerType)}
      </Button>
      {isLoading ? (
        <Skeleton className="w-full h-60" />
      ) : (
        <ApplyModal
          open={openApply}
          setopen={setopenApply}
          jobSlug={offerSlug}
          jobTitle={offerTitle}
          userProfile={
            myProfile
              ? {
                fullname: myProfile.fullname,
                email: myProfile.email,
                phone: myProfile.phone as string,
                cvUrl: myProfile?.candidateProfile?.cvUrl || "",
              }
              : null
          }
          isAuthenticated={token ? true : false}
        />
      )}
    </>
  );
};

export default ButtonApply;
