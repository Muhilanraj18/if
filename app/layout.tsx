/**
 * Root Layout — Inan Infinites
 * 
 * Next.js App Router root layout.
 * Loads Playfair Display + Inter via next/font (self-hosted, no FOUT).
 * Initialises GSAP + Lenis on client mount via GSAPProvider.
 * Full SEO metadata.
 */

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import GSAPProvider from "@/components/GSAPProvider";
import CustomCursor from "@/components/CustomCursor";

// Self-hosted via next/font — subset to latin, variable weights
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1F3F",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://inaninfinites.com"),
  title: {
    default: "Inan Infinites — Infinite ideas. Engineered.",
    template: "%s | Inan Infinites",
  },
  description:
    "Inan Infinites is a technology and software innovation company that builds exceptional products and services — from product engineering and AI automation to cloud platforms and digital consulting.",
  keywords: [
    "technology company",
    "software engineering",
    "AI automation",
    "cloud platforms",
    "product development",
    "digital consulting",
    "Inan Infinites",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inaninfinites.com",
    siteName: "Inan Infinites",
    title: "Inan Infinites — Infinite ideas. Engineered.",
    description:
      "We build technology products and services that push boundaries — from AI automation to cloud-native platforms and beyond.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inan Infinites — Infinite ideas. Engineered.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inan Infinites — Infinite ideas. Engineered.",
    description: "Technology & software innovation. Innovate · Inspire · Infinite.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        {/* GSAP + Lenis initialisation (client-only) */}
        <GSAPProvider />
        {/* Custom diamond cursor (hidden on touch devices) */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
