import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../(web)/_components/providers/AuthProvider";
import { BookingProvider } from "../(web)/_components/providers/BookingProvider";

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
    default: "Assistant Dashboard | cutmeets",
    template: "%s | Assistant Dashboard | cutmeets",
  },
  description: "Manage your assistant profile and bookings",
};

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}