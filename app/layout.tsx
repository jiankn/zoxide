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
  // 不在根 layout 中设置 lang，由 head 中的 script 在 React 水合之前设置
  // 这样可以确保服务端和客户端都通过 script 设置 lang，避免水合错误
  // suppressHydrationWarning 用于避免任何可能的警告
  return (
    <html suppressHydrationWarning>
      <head>
        {/* 在 head 中立即设置 html lang 属性，确保在 React 水合之前执行 */}
        {/* 从 URL 路径中提取 locale（格式：/zh/... 或 /en/...） */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var path = window.location.pathname;
                var match = path.match(/^\\/(zh|en|ja|fr|de)(\\/|$)/);
                var locale = match ? match[1] : '${routing.defaultLocale}';
                document.documentElement.setAttribute('lang', locale);
              })();
            `,
          }}
        />
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
