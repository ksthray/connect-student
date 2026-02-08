"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, FileText, Trash2, Users2 } from "lucide-react";
import FormsCandidate from "../../components/forms.candidate";
import { useFetch } from "@/services/query";
import { MyProfilType } from "@/entities/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import api from "@/services/api";
import UpdateSectors from "../../components/update-sectors";
import PhotoProfil from "../../components/photo-profil";
import CompletionProfil from "../../components/completion-profil";
import SkillsSection from "../../components/skills-section";

export default function CandidateProfile({ token }: { token: string }) {
  const {
    data: candidateData,
    isLoading,
    refetch,
  } = useFetch({
    route: "/candidate/myprofil",
    query: "me",
    params: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const myProfile: MyProfilType = candidateData?.data;

  /* ---------------- CV ---------------- */
  const [isUploading, setIsUploading] = useState(false);

  const uploadToPdfCloudinary = useCallback(
    async (file: File) => {
      const toastId = toast.loading("Upload du CV...");
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "newhope");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dgfkv4isa/image/upload",
          formData
        );

        if (!response?.data?.secure_url) throw new Error();

        await api.patch(
          "/candidate/myprofil",
          { cvUrl: response.data.secure_url },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("CV mis à jour", { id: toastId });
        refetch();
        window.location.reload();
      } catch {
        toast.error("Erreur lors de l’upload", { id: toastId });
      } finally {
        setIsUploading(false);
      }
    },
    [token, refetch]
  );

  return (
    <div className="space-y-8 px-6">
      {/* Profile Header */}
      {!isLoading ? (
        <>
          <PhotoProfil
            fullname={myProfile.fullname}
            city={myProfile.candidateProfile.city as string}
          />
        </>
      ) : (
        <div className="space-y-8">
          <Skeleton className="w-full h-60" />
          <Skeleton className="w-full h-60" />
        </div>
      )}

      {!isLoading && <CompletionProfil token={token} />}

      {!isLoading ? (
        <FormsCandidate myProfile={myProfile} token={token} />
      ) : (
        <Skeleton className="w-full h-60" />
      )}

      {/* ================= CV ================= */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-bold">CV</h2>
        </div>

        <Input
          type="file"
          accept="application/pdf"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadToPdfCloudinary(file);
          }}
        />

        {myProfile?.candidateProfile?.cvUrl && (
          <a
            href={myProfile.candidateProfile.cvUrl}
            target="_blank"
            className="block mt-3 text-primary underline">
            Voir le CV actuel
          </a>
        )}
      </div>

      {/* ================= SKILLS ================= */}
      {!isLoading && (
        <SkillsSection initialSkills={myProfile.candidateProfile.skills || []} token={token} />
      )}
      {/* ================= SECTORS ================= */}

      {!isLoading && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users2 className="w-5 h-5" />
            <h2 className="text-xl font-bold">Centres d'intérêts</h2>
          </div>
          <UpdateSectors
            token={token}
            initialSelectedSectors={myProfile.candidateProfile.sectors}
          />
        </div>
      )}
    </div>
  );
}
