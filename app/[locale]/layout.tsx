import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from "../providers";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner/DisclaimerBanner";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { generateOrganizationSchema } from "@/lib/seo/schema";
import { Geist, Geist_Mono } from "next/font/google"; // Moved from root layout
import { Metadata } from 'next'; // Moved from root layout
import "@/app/globals.css"; // Moved from root layout

// Font configurations
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

// Default Metadata (fallback)
export const metadata: Metadata = {
  metadataBase: new URL('https://zoxide.org'),
  title: "zoxide - 更智能的 cd 命令 | 让目录导航快 10 倍",
  description: "zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。支持模糊搜索、学习你的使用习惯，让终端导航变得轻松高效。",
  keywords: "zoxide, smart cd command, cd alternative, how to use zoxide, zoxide quick start",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 启用静态渲染 (SSG)
  setRequestLocale(locale);

  // 验证 locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // 获取消息
  const messages = await getMessages();

  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 结构化数据 - 放在 head 中 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <DisclaimerBanner />
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CookieBanner />
            <GoogleAnalytics />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

