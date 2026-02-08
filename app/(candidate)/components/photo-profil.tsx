"use client";

import CropImage from "@/components/crop-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { defaultImage, getName, isImage } from "@/services/helpers";
import { useAuthStore } from "@/store/store";
import { Edit } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const PhotoProfil = ({
  fullname,
  city,
}: {
  fullname: string;
  city: string;
}) => {
  const admin = useAuthStore((state) => state.admin);
  const [image, setimage] = useState<string>("");
  const [openCropImage, setopenCropImage] = useState(false);
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // Taille max de 3 Mo

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setimage(reader.result as string);
          setopenCropImage(!openCropImage);
        };
        reader.readAsDataURL(selectedFile[0]);
      } else {
        toast.error("Veuillez sélectionner une image s'il vous plaît !");
      }
    }
  };
  return (
    <div className="relative">
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 linear-premiere from-primary to-secondary relative group">
          {/* <button className="absolute right-4 top-4 p-2 bg-white/80 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-foreground" />
          </button> */}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 -mt-16 relative z-10">
          <div className="">
            <div className="flex flex-col items-center gap-4">
              {/* Profile Picture */}
              <div className="shrink-0 relative w-max">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={admin?.image || defaultImage}
                    alt={fullname}
                  />
                  <AvatarFallback className="text-lg">
                    {getName(fullname)}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="imageUpload"
                  className="bg-black/40 absolute bottom-1 -right-1 w-max p-2 rounded-full">
                  <Edit size={16} className="text-white" />
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </Label>
              </div>

              {/* Basic Info */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground text-center capitalize">
                  {fullname}
                </h1>
                <p className="">{city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CropImage open={openCropImage} setopen={setopenCropImage} img={image} />
    </div>
  );
};

export default PhotoProfil;
