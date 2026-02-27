/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { getCroppedImg } from "@/services/helpers";
import { useAuthStore } from "@/store/store";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

const CropImage = ({
  open,
  setopen,
  img,
}: {
  open: boolean;
  setopen: (value: boolean) => void;
  img: string;
}) => {
  const { updateProfil, token } = useAuthStore((state) => state);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | any>(null);

  const [loading, setloading] = useState(false);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const uploadToCloudinary = async (croppedImage: File | any) => {
    try {
      setloading(true);
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", "connect");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drarsensj/image/upload",
        formData
      );

      const state = {
        image: response.data.secure_url,
      };
      const res = await api.patch(`/candidate/myprofil`, state, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.state) {
        updateProfil(response.data.secure_url);
        toast.success("Image téléchargée avec succès !");
      }

      setloading(false);
    } catch (error) {
      console.log("err:", error);
      toast.error("Une erreur est survenue, veuillez réessayer !");
      setloading(false);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(img, croppedAreaPixels);
      await uploadToCloudinary(croppedImage);
      setopen(false);
    } catch (e) {
      console.error(e);
    }
  }, [img, croppedAreaPixels, uploadToCloudinary, setopen]);

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent className="">
        <div className="w-full relative h-[400px]">
          <Cropper
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={4 / 4}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <Button disabled={loading} onClick={showCroppedImage}>
          {loading ? <Loader2 className="animate-spin" /> : "Valider"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CropImage;
