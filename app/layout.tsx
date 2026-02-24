import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { DynamicBreadcrumbs } from "@/components/layout/DynamicBreadcrumbs";
import { Providers } from "@/components/providers/Providers";
import { FloatingGuide } from "@/components/lms/FloatingGuide";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS-Z | Course Lesson Player",
  description: "Learn with the best courses online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap" rel="stylesheet" precedence="default" /> 
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" precedence="default" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`} >
        <Providers>
          <Header />
          <DynamicBreadcrumbs />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster />
          <FloatingGuide />
        </Providers>
      </body>
    </html>
  );
}
