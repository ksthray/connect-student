"use client";

import CropImage from "@/components/crop-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { defaultImage, getName, isImage } from "@/services/helpers";
import { useAuthStore } from "@/store/store";
import { Edit } from "lucide-react";
import React, { ChangeEvent, useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/services/api";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const CompanyLogoProfil = ({
    companyName,
    location,
    logoUrl,
    token,
    onImageChanged
}: {
    companyName: string;
    location: string;
    logoUrl: string | null;
    token: string;
    onImageChanged: () => void;
}) => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // Taille max de 3 Mo

    const uploadToCloudinary = async (file: File) => {
        const toastId = toast.loading("Mise à jour du logo en cours...");
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "connect");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/drarsensj/image/upload",
                formData
            );

            const res = await api.patch(`/recruiter/us`, { logo: response.data.secure_url }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data.state) {
                toast.success("Logo mis à jour avec succès !", { id: toastId });
                onImageChanged();
            } else {
                toast.error("Une erreur est survenue.", { id: toastId });
            }
        } catch (error) {
            console.log("err:", error);
            toast.error("Une erreur est survenue lors de la mise à jour du logo !", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const selectedFile = event.target.files;
        if (selectedFile && selectedFile.length > 0) {
            const file = selectedFile[0];
            if (isImage(file)) {
                if (file.size > MAX_FILE_SIZE) {
                    toast.info("Votre image est trop lourde");
                    event.target.value = "";
                    return;
                }
                await uploadToCloudinary(file);
            } else {
                toast.error("Veuillez sélectionner une image s'il vous plaît !");
            }
            event.target.value = "";
        }
    };

    return (
        <div className="relative">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Cover Image */}
                <div className="h-32 linear-premiere from-primary to-secondary relative group">
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 -mt-16 relative z-10">
                    <div className="">
                        <div className="flex flex-col items-center gap-4">
                            {/* Profile Picture */}
                            <div className="shrink-0 relative w-max">
                                <div className="bg-white p-10 rounded-md shadow">
                                    <Image
                                        src={logoUrl || defaultImage}
                                        alt={companyName}
                                        width={400}
                                        height={400}
                                        className="w-32"
                                    />
                                </div>

                                <Label
                                    htmlFor="imageUpload"
                                    className="bg-black/40 absolute top-1 right-1 w-max p-2 rounded-full cursor-pointer hover:bg-black/60 transition"
                                    title="Modifier le logo de l'entreprise">
                                    <Edit size={16} className="text-white" />
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </Label>
                            </div>

                            {/* Basic Info */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-foreground text-center capitalize">
                                    {companyName || "Nom de l'entreprise"}
                                </h1>
                                <p className="">{location || "Emplacement non défini"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyLogoProfil;
