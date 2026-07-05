import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ContactPill from "@/components/ui/ContactPill";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const seoTitle =
  "Petrochemical Trading, Imports & Indenting Company in Mumbai | Accord Chemical Corporation";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.accordchemicals.com"),
  title: {
    default: seoTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: seoTitle,
    description: siteConfig.description,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    // 1200×630 red port scene — asset supplied at integration (public/og.png).
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Accord Chemical Corporation — petrochemical trade, moved with precision",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <MotionConfig reducedMotion="user">
          <ScrollProgress />
          <SmoothScroll>{children}</SmoothScroll>
          {/* The ONE floating affordance (§7.6). Back-to-top lives in Footer. */}
          <ContactPill />
        </MotionConfig>
      </body>
    </html>
  );
}
