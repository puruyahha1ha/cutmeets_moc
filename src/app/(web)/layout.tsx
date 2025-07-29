import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import Header from "./_components/common/Header";
import Footer from "./_components/common/Footer";
import FontOptimizer from "./_components/common/FontOptimizer";
import { AuthProvider } from "./_components/providers/AuthProvider";
import { BookingProvider } from "./_components/providers/BookingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", "Meiryo", "sans-serif"],
  adjustFontFallback: true,
  preload: true,
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
  adjustFontFallback: true,
  preload: false, // Not critical for initial render
});

export const metadata: Metadata = {
  title: {
    default: "Cutmeets - アシスタント美容師とお客様をマッチング",
    template: "%s | Cutmeets",
  },
  description: "技術向上を目指すアシスタント美容師の練習にご協力いただき、正規料金の約50%OFFでプロの施術を受けられるサービスです。",
  keywords: "美容師,アシスタント,練習台,格安,美容室,カット,カラー",
  authors: [{ name: "Cutmeets" }],
  creator: "Cutmeets",
  publisher: "Cutmeets",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Cutmeets - アシスタント美容師とお客様をマッチング",
    description: "技術向上を目指すアシスタント美容師の練習にご協力いただき、正規料金の約50%OFFでプロの施術を受けられます",
    url: "https://cutmeets.com",
    siteName: "Cutmeets",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cutmeets - アシスタント美容師とお客様をマッチング",
    description: "技術向上を目指すアシスタント美容師の練習にご協力いただき、正規料金の約50%OFFでプロの施術を受けられます",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* DNS prefetch and preconnect for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical hero image with optimal priority */}
        <link
          rel="preload"
          as="image"
          href="/FV.png"
          imageSizes="100vw"
          imageSrcSet="/_next/image?url=%2FFV.png&w=640&q=85 640w, /_next/image?url=%2FFV.png&w=750&q=85 750w, /_next/image?url=%2FFV.png&w=828&q=85 828w, /_next/image?url=%2FFV.png&w=1080&q=85 1080w, /_next/image?url=%2FFV.png&w=1200&q=85 1200w, /_next/image?url=%2FFV.png&w=1920&q=85 1920w, /_next/image?url=%2FFV.png&w=2048&q=85 2048w, /_next/image?url=%2FFV.png&w=3840&q=85 3840w"
          fetchPriority="high"
        />
        
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        
        {/* Optimize rendering for Japanese text */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col`}
      >
        <AuthProvider>
          <BookingProvider>
            <FontOptimizer />
            <Header />
            <main className="flex-1 w-full pb-16 sm:pb-20 lg:pb-12 pt-16">
              {children}
            </main>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
