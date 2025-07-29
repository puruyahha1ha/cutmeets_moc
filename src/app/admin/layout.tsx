'use client';

import { useState } from 'react';
import type { Metadata } from "next";
import { Noto_Sans_JP, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';
import AdminAuthCheck from './_components/AdminAuthCheck';

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata export doesn't work in client components
// This will be handled in a separate server component or moved to page level

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="ja">
      <head>
        <title>Cutmeets 管理者パネル</title>
        <meta name="description" content="Cutmeets 管理者用ダッシュボード" />
      </head>
      <body
        className={`${notoSansJP.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <AdminAuthCheck>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <AdminSidebar />
            </div>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
              <AdminHeader 
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
              />
              
              <main className="flex-1 overflow-y-auto pt-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminAuthCheck>
      </body>
    </html>
  );
}
