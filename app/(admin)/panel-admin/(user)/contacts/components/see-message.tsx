"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { defaultImage } from "@/services/helpers";
import { ContactType } from "@/entities/types";

const SeeMessage = ({
  message,
  open,
  setopen,
}: {
  message: ContactType;
  open: boolean;
  setopen: (v: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message</DialogTitle>
          <Separator />
        </DialogHeader>
        <div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              src={defaultImage}
              alt={message.fullname}
              width={400}
              height={400}
              className="w-20 rounded-full"
            />
            <div className="flex flex-col gap-2 text-center">
              <b className="text-lg capitalize">{message.fullname}</b>
              <span>{message.email}</span>
            </div>
          </div>
          <div className="w-full mt-6 h-72 overflow-y-scroll p-2 bg-gray-200 rounded-md">
            <p>{message.message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeeMessage;
