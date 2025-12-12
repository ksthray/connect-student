/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobType } from "@/entities/types";
import { useAuthStore } from "@/store/store";

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
  window.location.href = "/connexion";
}

// async function fetchCompanyLogout() {
//   await fetch("/api/recruiter/auth/logout", { method: "POST" });
//   window.location.href = "/connexion";
// }

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
      return "bg-blue-600";
    case "FULL_TIME":
      return "bg-gree-600";
    case "PART_TIME":
      return "bg-purple-600";
    case "EVENT":
      return "bg-oran-600ge";
    case "CONFERENCE":
      return "bg-teal-600";
    case "TRAINING":
      return "bg-cyan-600";
    default:
      return "bg-gray-300";
  }
}

export function filterData(array: any[], limit: number) {
  return array.map((item) => item).filter((_, key: number) => key < limit);
}
