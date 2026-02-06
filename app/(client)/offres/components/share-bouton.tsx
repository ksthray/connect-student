"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import React, { useCallback } from "react";

const ShareButtonForSlug = ({ title, url }: { title: string; url: string }) => {
  const handleNativeShare = useCallback(() => {
    // Vérifie si l'API Web Share est supportée
    navigator
      .share({
        title: title,
        url: url,
      })
      .then(() => console.log("Partage réussi"))
      .catch((error) => console.error("Erreur de partage:", error));
  }, [title, url]);

  return (
    <Button onClick={handleNativeShare} variant="outline" className="border-2">
      <Share2 className="w-4 h-4 mr-2" />
      Partager
    </Button>
  );
};

export default ShareButtonForSlug;
