"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TestimonyType } from "@/entities/types";
import { defaultImage } from "@/services/helpers";
import Image from "next/image";
import React from "react";

type Props = {
  open: boolean;
  setopen: (v: boolean) => void;
  avis: TestimonyType;
};

const ViewAvis = ({ avis, open, setopen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <div className="flex flex-col gap-4 justify-center items-center p-4">
          <div className="flex flex-col items-center">
            <Image
              src={avis.photo || defaultImage}
              alt={avis.fullname}
              width={400}
              height={400}
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold mt-2">{avis.fullname}</h3>
            <p className="text-gray-500">{avis.post}</p>
          </div>
          <div className="w-full h-[200px] overflow-y-auto bg-gray-100 p-4 rounded-md">
            <h4 className="text-lg font-semibold">Commentaire:</h4>
            <p className="mt-2 text-gray-700">{avis.comment}</p>
          </div>
          <div className="w-full">
            <h4 className="text-lg font-semibold">Évaluation:</h4>
            <p className="mt-2 text-yellow-500">{"⭐".repeat(avis.stars)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAvis;
