import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "@/provider/react-query.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Bienvenue à Connect Student",
    default: "Accueil - Bienvenue à Connect Student",
  },
  description:
    "Une plateforme EdTech qui rélie les étudiants et jeunes diplômés aux entreprises pour faciliter leur insertion professionnelle à travers des opportunités de stages, d'emplois et de formations.",
  keywords: ["emploi", "job", "formations", "trouvez un emploi"],
  twitter: {
    card: "summary_large_image",
    site: "@ConnectStudent",
    title: "Connect Student",
    description:
      "Une plateforme EdtTech qui rélie les étudiants et jeunes diplômés aux entreprises pour faciliter leur insertion professionnelle à travers des opportunités de stages, d'emplois et de formations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <NextTopLoader
            color="hsl(244.92, 98.39%, 24.31%)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px hsl(244.92, 98.39%, 24.31%),0 0 5px hsl(238.11, 75.15%, 33.14%)"
            zIndex={1600}
            showAtBottom={false}
          />
          <Toaster richColors />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
