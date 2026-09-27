import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velocity AI — Intelligent Productivity & Consequence Engine",
  description: "An AI-powered productivity assistant featuring the Consequence Engine, Adaptive Rescheduling, Future Me simulation, and Proof-of-Work portfolio.",
  keywords: ["Velocity AI", "AI Productivity", "Consequence Engine", "Procrastination Simulator", "Adaptive Rescheduling", "Student Productivity"],
  authors: [{ name: "Aditya Vardhan" }],
  icons: {
    icon: "/favicon.ico",
  }
};

export const viewport: Viewport = {
  themeColor: "#080A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#080A0F] text-zinc-100 flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

