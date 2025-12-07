import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { routing } from '@/i18n/routing';
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zoxide - 更智能的 cd 命令 | 让目录导航快 10 倍",
  description: "zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。支持模糊搜索、学习你的使用习惯，让终端导航变得轻松高效。",
  keywords: "zoxide, smart cd command, cd alternative, how to use zoxide, zoxide quick start",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 设置默认 lang，[locale]/layout.tsx 中的 script 会在客户端立即更新为正确的 locale
  // suppressHydrationWarning 用于避免客户端修改 lang 时的水合警告
  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-417HF3TV3L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-417HF3TV3L');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
