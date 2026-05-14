import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "البوابة المعرفية العسكرية - دليل المعرفة",
  description: "معلومات وإرشادات مهمة لكل من يبدأ أو يؤدي خدمته العسكرية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cn(ibmPlexSansArabic.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="bg-background text-on-background font-body-md min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
