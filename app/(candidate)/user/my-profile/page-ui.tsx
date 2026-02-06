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

        const { data } = await axios.post(
          "https://apiw3.faja-lobi.com/api/upload",
          formData
        );

        if (!data?.datas) throw new Error();

        await api.patch(
          "/candidate/myprofil",
          { cvUrl: data.datas },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("CV mis à jour", { id: toastId });
        refetch();
      } catch {
        toast.error("Erreur lors de l’upload", { id: toastId });
      } finally {
        setIsUploading(false);
      }
    },
    [token, refetch]
  );

  /* ---------------- SKILLS ---------------- */
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (myProfile?.candidateProfile?.skills) {
      setSkills(myProfile.candidateProfile.skills);
    }
  }, [myProfile]);

  const updateSkills = async (updatedSkills: string[]) => {
    setSkills(updatedSkills);

    try {
      await api.patch(
        "/candidate/myprofil",
        { skills: updatedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Compétences mises à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour des compétences");
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill)) return;

    updateSkills([...skills, newSkill]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    updateSkills(skills.filter((s) => s !== skill));
  };

  console.log(myProfile);

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
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="text-xl font-bold">Compétences</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouvelle compétence"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <Button onClick={addSkill}>Ajouter</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center justify-between p-3 border rounded-lg">
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* ================= SECTORS ================= */}

      {!isLoading && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users2 className="w-5 h-5" />
            <h2 className="text-xl font-bold">Compétences</h2>
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
