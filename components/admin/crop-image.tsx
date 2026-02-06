/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/services/helpers";
import { Loader2 } from "lucide-react";

const CropImage = ({
  open,
  setopen,
  img,
  setpreviewImage,
}: {
  open: boolean;
  setopen: (value: boolean) => void;
  img: string;
  setpreviewImage: (v: string) => void;
}) => {
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
      formData.append("upload_preset", "agc-cd");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duydcyifk/image/upload",
        formData
      );

      setpreviewImage(response.data.secure_url);
      toast.success("Photo ajoutée avec succès !");

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
