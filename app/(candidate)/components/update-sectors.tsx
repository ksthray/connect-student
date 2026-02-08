/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { SectorType } from "@/entities/types";
import { useFetch } from "@/services/query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

interface UpdateSectorsProps {
  initialSelectedSectors?: {
    id: string;
    name: string;
    slug: string;
  }[]; // Secteurs déjà sélectionnés
  token: string;
}

const UpdateSectors: React.FC<UpdateSectorsProps> = ({
  initialSelectedSectors = [],
  token,
}) => {
  const { data: sectorsData, isLoading } = useFetch({
    route: "/candidate/sectors",
    query: "sectors-candidates",
  });

  const sectors: SectorType[] = sectorsData?.data || [];

  const [selectedSectors, setSelectedSectors] = useState(
    initialSelectedSectors ||
    ([] as UpdateSectorsProps["initialSelectedSectors"])
  );

  const [isSaving, setIsSaving] = useState(false);

  // Mettre à jour les secteurs initiaux si ça change côté parent
  useEffect(() => {
    setSelectedSectors(initialSelectedSectors);
  }, [initialSelectedSectors]);

  const handleToggleSector = (sector: SectorType) => {
    if (selectedSectors.some((s) => s.id === sector.id)) {
      setSelectedSectors(selectedSectors.filter((s) => s.id !== sector.id));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await api.patch(
        "/candidate/myprofil",
        {
          // On envoie uniquement les IDs au backend
          sectors: selectedSectors.map((s) => s.id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Secteurs mis à jour avec succès !");
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour des secteurs.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <p className="flex items-center gap-2">
        <Loader2 className="animate-spin" /> Chargement des secteurs...
      </p>
    );

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Sélectionnez vos secteurs d&apos;intérêt
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectors.map((sector) => (
          <div key={sector.id} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedSectors.some((s) => s.id === sector.id)}
              onCheckedChange={() => handleToggleSector(sector)}
            />
            <span className="font-normal">{sector.name}</span>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="">
        {isSaving ? <Loader2 className="animate-spin" /> : "Sauvegarder"}
      </Button>
    </div>
  );
};

export default UpdateSectors;
