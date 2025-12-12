import HeaderUser from "../components/header-user";
import BottomNavigation from "../components/navigation";

export default function RecruiterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeaderUser />
      {children}
      <BottomNavigation />
    </div>
  );
}
