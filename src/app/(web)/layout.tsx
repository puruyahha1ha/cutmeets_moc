import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./_components/common/Header";
import Footer from "./_components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "cutmeets",
    template: "%s | cutmeets",
  },
  description: "cutmeets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col`}
      >
        <Header />
        <main className="flex-1 container mx-auto px-4 lg:px-6 xl:px-8 pt-20 lg:pt-28 pb-24 lg:pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
