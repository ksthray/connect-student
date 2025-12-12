import { AdminStatsProvider } from "@/context/AdminStatsContext";
import SidebarProvider from "@/provider/sidebar.provider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminStatsProvider>
        <main>{children}</main>
      </AdminStatsProvider>
    </SidebarProvider>
  );
}
