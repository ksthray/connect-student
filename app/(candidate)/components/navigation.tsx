"use client";

import { Home, User, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: 1, label: "Tableau de bord", icon: Home, to: "/user/dashboard" },
  {
    id: 3,
    label: "Mes candidatures",
    icon: Briefcase,
    to: "/user/applications",
  },
  {
    id: 4,
    label: "Recommandations",
    icon: Sparkles,
    to: "/user/recommendations",
  },
  { id: 2, label: "Mon profil", icon: User, to: "/user/my-profile" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 w-[90%] bg-white border-t border-gray-200 shadow-lg z-50 md:w-[600px] left-1/2 -translate-x-1/2 rounded-full">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;
          return (
            <Link
              href={item.to}
              key={item.id}
              className="relative flex flex-col items-center justify-center text-gray-500 focus:outline-none w-1/4">
              <motion.div
                animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Icon
                  className={cn(
                    "w-6 h-6 mb-1",
                    isActive
                      ? "text-premiere"
                      : "text-gray-400 hover:text-blue-500 transition-colors"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[8px] md:text-xs font-medium",
                  isActive ? "text-premiere" : "text-gray-500"
                )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
