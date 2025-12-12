import React, { PropsWithChildren } from "react";

import {
  SidebarProvider as SidebarProviderUI,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/templates/admin/app-sidebar";
import { AppHeader } from "@/components/templates/admin/app-header";

const SidebarProvider = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProviderUI>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProviderUI>
  );
};

export default SidebarProvider;
