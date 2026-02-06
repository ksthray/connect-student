/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobType } from "@/entities/types";
import { useAuthStore } from "@/store/store";
import { Area } from "react-easy-crop";

export const defaultImage =
  "https://isobarscience-1bfd8.kxcdn.com/wp-content/uploads/2020/09/default-profile-picture1.jpg";

export const handleLogout = (role: 1 | 2 | 3) => {
  const isLogout = useAuthStore.getState().isLogout;
  const confirm = window.confirm("Voulez-vous vous déconnecter ?");
  if (confirm) {
    isLogout();
    if (role === 1) {
      fetchLogout();
    } else if (role === 2) {
      fetchCandidateLogout();
    } else if (role === 3) {
      fetchRecruiterLogout();
    }
  }
};

async function fetchLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/panel-admin";
}

async function fetchCandidateLogout() {
  await fetch("/api/candidate/auth/logout", { method: "POST" });
  window.location.href = "/connexion";
}

async function fetchRecruiterLogout() {
  await fetch("/api/recruiter/auth/logout", { method: "POST" });
  window.location.href = "/entreprise";
}

// async function fetchCompanyLogout() {
//   await fetch("/api/recruiter/auth/logout", { method: "POST" });
//   window.location.href = "/connexion";
// }

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Pour éviter les problèmes CORS
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx: any = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file: any = new File([blob], "croppedImage.jpeg", {
          type: "image/jpeg",
        });
        resolve(file);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
};

export function getName(fullname: string) {
  if (fullname !== "") {
    const name = fullname.split(" ");
    const goodName = [];
    for (const iterator of name) {
      if (iterator !== "") {
        goodName.push(iterator);
      }
    }

    return `${goodName[0]?.split("")[0]}${goodName[1]?.split("")[0]}`;
  }
  return "";
}

export function frDate(date: Date) {
  const formated = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(formated);
}

export function isImage(file: File) {
  const typeFile = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
  ];
  return typeFile.includes(file.type);
}

export function isEmpty(obj: any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else {
    const formattedNum = (num / 1000).toFixed(1);
    return formattedNum + "k";
  }
}

export function toFixedAmount(amount: number, currency: string) {
  const amounttFixed: any = amount.toFixed(2);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toLowerCase(),
  }).format(amounttFixed);
}

export function returnNameOfJobType(type: keyof JobType) {
  switch (type) {
    case "INTERNSHIP":
      return "Stage";
    case "FULL_TIME":
      return "Temps plein";
    case "PART_TIME":
      return "Temps partiel";
    case "EVENT":
      return "Événement";
    case "CONFERENCE":
      return "Conférence";
    case "TRAINING":
      return "Formation";
    default:
      return "Type inconnu";
  }
}

export function returnBadgeColorOfJobType(type: keyof JobType) {
  switch (type) {
    case "INTERNSHIP":
      return "bg-blue-500";
    case "FULL_TIME":
      return "bg-gree-500";
    case "PART_TIME":
      return "bg-purple-500";
    case "EVENT":
      return "bg-orange-500";
    case "CONFERENCE":
      return "bg-teal-500";
    case "TRAINING":
      return "bg-cyan-500";
    default:
      return "bg-gray-300";
  }
}

export function getTypeBgColor(type: string) {
  switch (type) {
    case "INTERNSHIP":
      return "bg-blue-100/80";
    case "FULL_TIME":
      return "bg-green-100/80";
    case "PART_TIME":
      return "bg-purple-100/80";
    case "EVENT":
      return "bg-orange-100/80";
    case "CONFERENCE":
      return "bg-teal-100/80";
    case "TRAINING":
      return "bg-cyan-100/80";
    default:
      return "bg-gray-300";
  }
}

export function getTypeTextColor(type: string) {
  switch (type) {
    case "INTERNSHIP":
      return "text-blue-800";
    case "FULL_TIME":
      return "text-green-800";
    case "PART_TIME":
      return "text-purple-800";
    case "EVENT":
      return "text-orange-800";
    case "CONFERENCE":
      return "text-teal-800";
    case "TRAINING":
      return "text-cyan-800";
    default:
      return "text-gray-300";
  }
}

export function getActionText(type: string): string {
  switch (type) {
    case "INTERNSHIP":
    case "FULL_TIME":
    case "PART_TIME":
      // Pour tous les types d'emploi (stage, temps plein, temps partiel)
      return "Postuler maintenant";

    case "EVENT":
    case "CONFERENCE":
      // Pour les événements et conférences
      return "S'inscrire";

    case "TRAINING":
      // Pour les formations
      return "S'inscrire";

    default:
      return "Voir les détails";
  }
}

export function filterData(array: any[], limit: number) {
  return array.map((item) => item).filter((_, key: number) => key < limit);
}

export const socials_networks = [
  {
    name: "Facebook",
    icon: "/icons/fb.png",
    url: "https://www.facebook.com/share/173mZo3wyg/?mibextid=wwXIfr",
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.png",
    url: "https://www.instagram.com/connect__student?igsh=ajI5YXA4ajJoaTNv&utm_source=qr",
  },
  {
    name: "LinkedIn",
    icon: "/icons/linkedin2.png",
    url: "https://www.linkedin.com/company/connect-student-officiel/",
  },
];
