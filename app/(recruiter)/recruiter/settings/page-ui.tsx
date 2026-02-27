"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Lock, User, Briefcase } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import { toast } from "sonner";
import CompanyLogoProfil from "./components/company-logo-profil";

export default function RecruiterSettings({ token }: { token: string }) {
  const { data: profile, isLoading, isError } = useCompanyProfile(token);
  const queryClient = useQueryClient();
  const [companySettings, setCompanySettings] = useState({
    companyName: "",
    industry: "",
    website: "",
    location: "",
    description: "",
    fullname: "",
  });

  useEffect(() => {
    if (profile) {
      setCompanySettings({
        companyName: profile.companyProfile?.companyName || "",
        industry: profile.companyProfile?.industry || "",
        website: profile.companyProfile?.website || "",
        location: profile.companyProfile?.location || "",
        description: profile.companyProfile?.description || "",
        fullname: profile.fullname || "",
      });
    }
  }, [profile]);

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    onMutate: () => {
      const toastId = toast.loading("Enregistrement...");
      return { toastId };
    },
    mutationFn: (dataToUpdate: any) => {
      return api.patch("/recruiter/us", dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res, variables, context) => {
      toast.success(res.data.message || "Paramètres enregistrés !", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
      if (variables.currentPassword) {
        setPasswordChange({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    },
    onError: (err: any, variables, context) => {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement", {
        id: context?.toastId,
      });
    },
  });

  const handleCompanySave = () => {
    updateProfileMutation.mutate(companySettings);
  };

  const handlePasswordChange = () => {
    if (
      !passwordChange.currentPassword ||
      !passwordChange.newPassword ||
      !passwordChange.confirmPassword
    ) {
      toast.error("Veuillez remplir tous les champs de mot de passe");
      return;
    }
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    updateProfileMutation.mutate({
      currentPassword: passwordChange.currentPassword,
      newPassword: passwordChange.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-10">
        <Skeleton className="w-full h-[400px] rounded-xl" />
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-10 text-red-500">Erreur lors du chargement de la page.</div>;
  }

  return (
    <div className="space-y-8 px-6 pb-20">
      {/* Profile Header (Logo & Banner) */}
      <CompanyLogoProfil
        companyName={profile?.companyProfile?.companyName || ""}
        location={profile?.companyProfile?.location || ""}
        logoUrl={profile?.companyProfile?.logo || null}
        token={token}
        onImageChanged={() => queryClient.invalidateQueries({ queryKey: ["company-profile"] })}
      />

      {/* Company Information */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Informations de l'entreprise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom de l'entreprise
            </label>
            <Input
              value={companySettings.companyName}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  companyName: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Représentant (Nom complet)
            </label>
            <Input
              value={companySettings.fullname}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  fullname: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Secteur d'activité
            </label>
            <Input
              value={companySettings.industry}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  industry: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Web
            </label>
            <Input
              value={companySettings.website}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  website: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Emplacement
            </label>
            <Input
              value={companySettings.location}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  location: e.target.value,
                })
              }
              className="border-border"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <Textarea
            value={companySettings.description}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                description: e.target.value,
              })
            }
            placeholder="À propos de l'entreprise..."
            className="border-border min-h-[120px]"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleCompanySave}
            disabled={updateProfileMutation.isPending}
            className="">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Sécurité</h2>
        </div>

        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Changer le mot de passe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe actuel
                </label>
                <Input
                  type="password"
                  value={passwordChange.currentPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      currentPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      newPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) =>
                    setPasswordChange({
                      ...passwordChange,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handlePasswordChange}
                disabled={updateProfileMutation.isPending}
                className="">
                <Save className="w-4 h-4 mr-2" />
                Mettre à jour le mot de passe
              </Button>
            </div>
          </div>

          {/* Last Password Change */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Dernier changement de mot de passe : {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Non renseigné"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
