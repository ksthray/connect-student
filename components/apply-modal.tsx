/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modals/ApplyModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApplyJob } from "@/hooks/useApplyJob";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Mail,
  Smartphone,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/store/store";

// --- Types Locaux ---
type ApplicationData = {
  coverLetter: string;
  cvUrl: string; // URL du CV (Cloudinary)
};

type UserProfile = {
  fullname: string;
  email: string;
  phone: string;
  cvUrl: string; // CV existant
} | null;

type ApplyModalProps = {
  open: boolean;
  setopen: (isOpen: boolean) => void;
  jobSlug: string;
  jobTitle: string;
  userProfile: UserProfile;
  isAuthenticated: boolean;
};

// --- Composant Principal ---
export const ApplyModal: React.FC<ApplyModalProps> = ({
  open,
  setopen,
  jobSlug,
  jobTitle,
  userProfile,
  isAuthenticated,
}) => {
  const token = useAuthStore((state) => state.token);
  // État local pour le formulaire
  const [formData, setFormData] = useState<ApplicationData>({
    coverLetter: "",
    cvUrl: userProfile?.cvUrl || "", // Initialisation correcte au montage
  });

  const [isUploading, setIsUploading] = useState(false);

  const pathname = usePathname();
  const encodedReturnUrl = encodeURIComponent(pathname);

  const { mutate, isPending, isSuccess, isError, error, reset } = useApplyJob();

  // Correction : Réinitialisation à la fermeture. L'état est réinitialisé
  // à la valeur du profil uniquement lorsque le modal se ferme.
  useEffect(() => {
    if (!open) {
      reset();
      setFormData({
        coverLetter: "",
        cvUrl: userProfile?.cvUrl || "",
      });
    }
  }, [open, reset, userProfile?.cvUrl]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cvUrl) {
      toast.error(
        "Veuillez télécharger votre CV avant de soumettre la candidature."
      );
      return;
    }

    // Soumission de la coverLetter ET du cvUrl
    mutate({
      jobSlug: jobSlug,
      coverLetter: formData.coverLetter,
      cvUrl: formData.cvUrl,
      token: token,
    });
  };

  // --- Logique d'Upload vers Cloudinary ---
  // Mise en useCallback pour la stabilité, dépend uniquement des outils externes
  const uploadToPdfCloudinary = useCallback(async (pdfFile: File) => {
    const toastId = toast.loading(`Chargement de "${pdfFile.name}"...`);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("upload_preset", "newhope");

      // Pour les PDF, Cloudinary accepte souvent l'endpoint /image/upload,
      // mais /auto/upload est plus sûr pour détecter le format.
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgfkv4isa/image/upload",
        formData
      );

      // Cloudinary renvoie les données directement dans response.data
      if (response.data && response.data.secure_url) {
        toast.success(`"${pdfFile.name}" téléchargé avec succès !`, {
          id: toastId,
        });

        // On retourne l'URL sécurisée fournie par Cloudinary
        return response.data.secure_url;
      } else {
        toast.error(`Erreur inattendue lors de l'envoi de "${pdfFile.name}"`, {
          id: toastId,
        });
        return null;
      }
    } catch (error) {
      console.error("Erreur d'upload :", error);
      toast.error(
        `Erreur d'upload pour "${pdfFile.name}". Vérifiez la taille/le format.`,
        { id: toastId }
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // --- Handler d'Upload de CV ---
  const handleCvUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Seuls les fichiers PDF sont acceptés pour le CV.");
      return;
    }

    const newCvUrl = await uploadToPdfCloudinary(file);

    if (newCvUrl) {
      // C'est cet appel qui déclenche la mise à jour de l'interface
      // et active le bouton de soumission.
      setFormData((prev) => ({ ...prev, cvUrl: newCvUrl }));
    }
  };
  // ---------------------------------------

  // A. Étape 1 : Demande de connexion (si non connecté)
  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={setopen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Accédez à cette opportunité !
            </DialogTitle>
          </DialogHeader>

          <div className="text-center">
            <h3 className="text-md font-semibold mb-3 text-gray-800">
              Connectez-vous ou créez un compte pour postuler.
            </h3>
            <p className="text-sm text-muted-foreground">
              Vos informations de profil (CV, email, nom) seront pré-remplies
              automatiquement.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href={`/connexion?returnTo=${encodedReturnUrl}`}
              passHref
              className="w-full">
              <Button
                variant="secondary"
                onClick={() => setopen(false)}
                className="w-full">
                Se connecter
              </Button>
            </Link>
            <Link
              href={`/connexion?tab=account&returnTo=${encodedReturnUrl}`}
              passHref
              className="w-full">
              <Button onClick={() => setopen(false)} className="w-full">
                Créer mon compte
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // B. Étape 2 : Statut de la candidature (isPending, isSuccess, isError)
  if (isPending || isSuccess || isError) {
    const statusTitle = isPending
      ? "Soumission en cours..."
      : isSuccess
        ? "Candidature Envoyée !"
        : "Échec de la Candidature";
    const StatusIcon = isPending ? Loader2 : isSuccess ? CheckCircle : XCircle;
    const statusMessage = isPending
      ? "Veuillez patienter..."
      : isSuccess
        ? "Félicitations ! Votre candidature a été transmise."
        : (error as any)?.response?.data?.message ||
        "Une erreur inconnue est survenue.";




    return (
      <Dialog open={open} onOpenChange={setopen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">{statusTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center flex flex-col items-center">
            <StatusIcon
              className={`w-10 h-10 ${isSuccess
                ? "text-green-500"
                : isError
                  ? "text-red-500"
                  : "text-primary"
                } ${isPending ? "animate-spin" : ""}`}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {statusMessage}
            </p>
          </div>
          <DialogFooter className="justify-center">
            <Button asChild variant={"secondary"}>
              <Link href={"/user/applications"}>Voir mes candidatures</Link>
            </Button>
            <Button onClick={() => setopen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // C. Étape 3 : Formulaire de soumission (État initial connecté)
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Postuler à :{" "}
            <span className="font-semibold text-primary">{jobTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleApply} className="space-y-4">
          {/* Infos Candidat (Disabled) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nom Complet */}
            <div>
              <Label htmlFor="fullname">Nom Complet *</Label>
              <div className="relative mt-1">
                <Input
                  id="fullname"
                  value={userProfile?.fullname || "Non défini"}
                  disabled
                  className="pl-9"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email">Adresse Email *</Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  value={userProfile?.email || "Non défini"}
                  disabled
                  className="pl-9"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            {/* Téléphone */}

          </div>
          <div>
            <Label htmlFor="phone">Numéro de Téléphone *</Label>
            <div className="relative mt-1">
              <Input
                id="phone"
                value={userProfile?.phone || "Non défini"}
                disabled
                className="pl-9"
              />
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          {/* CV URL / Upload */}
          <div className="space-y-2 pt-4">
            <Label htmlFor="cvFile">CV Actuel *</Label>
            <div className="flex items-center gap-3">
              <div className="relative grow">
                <Input
                  id="cvUrl"
                  value={
                    isUploading
                      ? "Téléchargement en cours..."
                      : formData.cvUrl
                        ? `CV: ${formData.cvUrl.split("/").pop() || "Prêt"}` // Affiche le nom du fichier
                        : "Aucun CV sélectionné/défini."
                  }
                  disabled
                  className="pl-9 pr-2 border-dashed"
                />
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              {/* Bouton d'Upload ou de modification */}
              <Label htmlFor="cv-upload-input" className="cursor-pointer">
                <Button asChild variant="outline" disabled={isUploading}>
                  <div>
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {formData.cvUrl ? "Modifier CV" : "Télécharger CV (PDF)"}
                  </div>
                </Button>
              </Label>
              <input
                id="cv-upload-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCvUpload(e.target.files[0]);
                    e.target.value = ""; // Important: Réinitialiser pour permettre l'upload du même fichier
                  }
                }}
              />
            </div>
            {formData.cvUrl ? (
              <p className="text-xs text-green-600">
                Votre CV actuel sera soumis.
              </p>
            ) : (
              <p className="text-xs text-red-500 font-semibold">
                Le CV est manquant ! Veuillez en télécharger un au format PDF.
              </p>
            )}
          </div>

          {/* Lettre de Motivation (Optionnel) */}
          <div className="pt-4">
            <Label htmlFor="coverLetter">
              Lettre de Motivation (Optionnel)
            </Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverLetter: e.target.value,
                }))
              }
              placeholder="Écrivez ici votre lettre de motivation ou votre message d'accompagnement..."
              rows={4}
              className="mt-1"
            />
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2 w-full">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setopen(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!formData.cvUrl || isUploading} // Fonctionne correctement maintenant
              className="">
              Soumettre Candidature
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
