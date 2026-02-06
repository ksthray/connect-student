// src/app/(main)/offres/[slug]/components/ButtonApply.tsx
"use client"; // <--- CECI EST ESSENTIEL POUR LE MARQUER COMME COMPOSANT CLIENT

import { ApplyModal } from "@/components/apply-modal";
import { Button } from "@/components/ui/button";
import { getActionText } from "@/services/helpers";
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
  const searchParams = useSearchParams();
  const { admin, isAuthenticed } = useAuthStore((s) => s);
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
        className="linear-premiere text-white font-semibold h-12 px-8">
        {getActionText(offerType)}
      </Button>
      <ApplyModal
        open={openApply}
        setopen={setopenApply}
        jobSlug={offerSlug}
        jobTitle={offerTitle}
        userProfile={{
          fullname: admin.fullname,
          email: admin.email,
          phone: admin.phone as string,
          cvUrl: "",
        }}
        isAuthenticated={isAuthenticed}
      />
    </>
  );
};

export default ButtonApply;
