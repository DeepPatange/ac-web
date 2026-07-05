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
        {/* Tritone filter for the Spline hero — maps the scene's tones onto a
            strict three-colour ramp: shadows → near-black, mids → brand red,
            highlights → white. No hue-rotate (that produced magenta), so the
            scene reads ONLY white / red / black. Referenced from globals.css
            via `.spline-tint canvas { filter: url(#accord-tritone) }`. */}
        <svg
          aria-hidden
          focusable="false"
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <filter id="accord-tritone" colorInterpolationFilters="sRGB">
            {/* 1 — collapse to perceptual luminance (Rec.709) */}
            <feColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0 0 0 1 0"
            />
            {/* 2 — punch contrast so tones commit to the ramp's ends */}
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude="1" exponent="0.82" offset="0" />
              <feFuncG type="gamma" amplitude="1" exponent="0.82" offset="0" />
              <feFuncB type="gamma" amplitude="1" exponent="0.82" offset="0" />
            </feComponentTransfer>
            {/* 3 — map that ramp: black → red (held across the mids) → white */}
            <feComponentTransfer>
              <feFuncR
                type="table"
                tableValues="0.043 0.882 0.882 0.882 0.882 0.996 0.996 0.996"
              />
              <feFuncG
                type="table"
                tableValues="0.043 0.106 0.106 0.106 0.106 0.996 0.996 0.996"
              />
              <feFuncB
                type="table"
                tableValues="0.051 0.133 0.133 0.133 0.133 0.996 0.996 0.996"
              />
            </feComponentTransfer>
          </filter>
        </svg>
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
