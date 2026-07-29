import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyHub — Class 10 CBSE | Science & Social Science",
  description:
    "The complete CBSE Class 10 study companion. NCERT Science (Chem/Bio/Phy) + Social Science notes, PYQ-style MCQs, flashcards, formulas, mock tests, AI tutor, spaced repetition, and gamified learning.",
  keywords: ["CBSE Class 10", "NCERT Science", "Social Science", "PYQ", "Mock Test", "AI Tutor", "Study Hub", "Board Exam"],
  authors: [{ name: "StudyHub" }],
  manifest: "/manifest.webmanifest",
  icons: { icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg" },
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
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
