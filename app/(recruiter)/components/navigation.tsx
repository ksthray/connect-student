"use client";

import { useState } from "react";
import { Home, User, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: 1, label: "Tableau de bord", icon: Home, to: "/recruiter/dashboard" },
  {
    id: 3,
    label: "Opportunités",
    icon: Briefcase,
    to: "/recruiter/opportunities",
  },
  {
    id: 4,
    label: "Applications",
    icon: Sparkles,
    to: "/recruiter/applications",
  },
  { id: 2, label: "Paramètres", icon: User, to: "/recruiter/settings" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 md:w-[600px] md:mx-auto md:left-0 md:right-0 rounded-full">
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
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-blue-500 transition-colors"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-1 h-1 w-6 rounded-full bg-blue-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
