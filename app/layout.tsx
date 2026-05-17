import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebsiteJsonLd from "@/components/WebsiteJsonLd";
import { SITE_URL as siteUrl } from "@/lib/types";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#273312",
};

export const metadata: Metadata = {
  title: {
    default: "كوماندو - البوابة المعرفية العسكرية | دليل التجنيد في مصر",
    template: "%s | كوماندو - البوابة المعرفية العسكرية",
  },
  description:
    "دليل شامل ومرجع معرفي عن التجنيد والخدمة العسكرية في مصر. أسئلة وأجوبة موثوقة عن شروط التجنيد، مدة الخدمة العسكرية، تأجيل التجنيد للطلاب، إعفاء التجنيد، الأوراق المطلوبة للتجنيد، والتسجيل في الجيش المصري.",
  keywords: [
    "التجنيد في مصر",
    "شروط الخدمة العسكرية",
    "مدة الخدمة العسكرية",
    "تأجيل التجنيد للطلاب",
    "إعفاء التجنيد",
    "الأوراق المطلوبة للتجنيد",
    "التسجيل في الجيش المصري",
    "الخدمة العسكرية المصرية",
    "شروط التجنيد",
    "دفعة يوليو 2026",
    "التطوع في القوات المسلحة",
    "عقوبة التخلف عن التجنيد",
    "موقف تجنيدي",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "كوماندو - البوابة المعرفية العسكرية",
    title: "كوماندو - البوابة المعرفية العسكرية | دليل التجنيد في مصر",
    description:
      "إجابات واضحة ومباشرة على أكثر الأسئلة شيوعًا عن التجنيد والخدمة العسكرية في مصر. شروط التقديم، مدة الخدمة، الإعفاءات، والأوراق المطلوبة.",
  },
  twitter: {
    card: "summary_large_image",
    title: "كوماندو - البوابة المعرفية العسكرية",
    description:
      "دليل شامل عن التجنيد والخدمة العسكرية في مصر - أسئلة وأجوبة موثوقة",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google8ff3c5c981d30acb",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(ibmPlexSansArabic.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-on-background font-body-md min-h-screen flex flex-col"
      >
        <WebsiteJsonLd />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
