import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { routing } from '@/i18n/routing';
import Script from "next/script";

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
  metadataBase: new URL('https://zoxide.org'),
  title: "zoxide - 更智能的 cd 命令 | 让目录导航快 10 倍",
  description: "zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。支持模糊搜索、学习你的使用习惯，让终端导航变得轻松高效。",
  keywords: "zoxide, smart cd command, cd alternative, how to use zoxide, zoxide quick start",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 设置默认 lang，[locale]/layout.tsx 中的 script 会在服务端渲染时输出正确的 lang
  // suppressHydrationWarning 用于避免客户端修改 lang 时的水合警告
  // 注意：虽然服务端和客户端的 lang 可能不同，但 suppressHydrationWarning 会抑制警告
  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <head>
        {/* 备用 script：如果 [locale]/layout.tsx 中的 script 没有执行，这个 script 会从 URL 提取 locale */}
        {/* 这个 script 会在 React 水合之前执行，确保 lang 属性在检查之前就设置好 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && window.location) {
                  var path = window.location.pathname;
                  var match = path.match(/^\\/(zh|en|ja|fr|de)(\\/|$)/);
                  var locale = match ? match[1] : '${routing.defaultLocale}';
                  if (document.documentElement.getAttribute('lang') !== locale) {
                    document.documentElement.setAttribute('lang', locale);
                  }
                }
              })();
            `,
          }}
        />
        {/* Google Analytics 将在用户同意后通过 GoogleAnalytics 组件加载 */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
