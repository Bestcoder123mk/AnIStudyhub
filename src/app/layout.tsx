import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

// Geist — Vercel's SF Pro-adjacent typeface, self-hosted (no external font
// request, no render-blocking round trip to Google Fonts). One family for
// both body and display type, the way Apple's own HIG uses SF Pro at
// different weights instead of mixing typefaces — that restraint is a
// bigger part of the "premium" feel than any single glyph shape.
// GeistSans/GeistMono are next/font/local instances, so `.variable`
// already carries the right CSS custom property.
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "StudyHub — Class 10 CBSE | Science & Social Science",
  description:
    "The complete CBSE Class 10 study companion. NCERT Science (Chem/Bio/Phy) + Social Science notes, PYQ-style MCQs, flashcards, formulas, mock tests, AI tutor, spaced repetition, and gamified learning.",
  keywords: ["CBSE Class 10", "NCERT Science", "Social Science", "PYQ", "Mock Test", "AI Tutor", "Study Hub", "Board Exam"],
  authors: [{ name: "StudyHub" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/icon-32.png"],
  },
  openGraph: {
    title: "StudyHub — Class 10 CBSE",
    description: "Complete board exam preparation companion with AI tutor",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0c1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
