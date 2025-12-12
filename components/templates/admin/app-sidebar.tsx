"use client";
import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  BarChart2,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { NavMain } from "@/components/templates/admin/nav-main";
import { NavUser } from "@/components/templates/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/store";
import { defaultImage } from "@/services/helpers";

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/panel-admin/dashboard",
      icon: BarChart3,
    },
    {
      title: "Utilisateurs",
      url: "/panel-admin/users",
      icon: Users,
    },
    {
      title: "Opportunités",
      url: "/panel-admin/opportunities",
      icon: Briefcase,
    },
    {
      title: "Entreprises",
      url: "/panel-admin/companies",
      icon: Building2,
    },
    {
      title: "Secteurs",
      url: "/panel-admin/sectors",
      icon: BarChart2,
    },
    {
      title: "Abonnements",
      url: "/panel-admin/subscriptions",
      icon: CreditCard,
    },
    // {
    //   title: "Analytics",
    //   url: "/panel-admin/analytics",
    //   icon: BarChart2,
    // },
    {
      title: "Administrateurs",
      url: "/panel-admin/gestion-admin",
      icon: Users,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const admin = useAuthStore((state) => state.admin);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <LayoutDashboard className="size-5!" />
                <span className="text-base text-premiere font-semibold">
                  Connect Student
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: admin?.fullname || "Admin Name",
            email: admin?.email || "",
            avatar: defaultImage,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
