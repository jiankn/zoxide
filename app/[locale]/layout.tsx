import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from "../providers";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner/DisclaimerBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schema";
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

// Default Metadata (fallback) — uses English since defaultLocale is 'en'
export const metadata: Metadata = {
  metadataBase: new URL('https://zoxide.org'),
  title: "zoxide - A Smarter cd Command | Navigate Directories 10x Faster",
  description: "zoxide is a smarter cd command written in Rust. It learns your habits and lets you jump to any directory with just a few keystrokes. Supports fuzzy matching across all major shells.",
  keywords: "zoxide, smart cd command, cd alternative, how to use zoxide, zoxide quick start",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Messages = Awaited<ReturnType<typeof getMessages>>;

// 客户端组件使用的命名空间：common、footer、home，以及 RelatedPosts 用到的 blog 摘要字段
function pickClientMessages(all: Messages): Messages {
  const blog = (all.blog ?? {}) as Record<string, unknown>;
  const data = (blog.data ?? {}) as Record<string, { title?: string; excerpt?: string; category?: string }>;
  const blogSummaries = Object.fromEntries(
    Object.entries(data).map(([slug, post]) => [
      slug,
      { title: post.title, excerpt: post.excerpt, category: post.category },
    ]),
  );

  return {
    common: all.common,
    footer: all.footer,
    home: all.home,
    blog: { readTime: blog.readTime, detail: blog.detail, data: blogSummaries },
  } as Messages;
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

  // 只把客户端组件用到的文案发给浏览器。完整文案里有文章全文和 SEO 字段，
  // 若整份序列化进每个页面的 HTML，会让爬虫读到大量与当前页面无关的隐藏文本。
  const messages = pickClientMessages(await getMessages());

  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* AdSense 账户归属验证，与 ads.txt 及广告脚本的发布商 ID 保持一致 */}
        <meta name="google-adsense-account" content="ca-pub-3562784107542460" />
        {/* Run before either Google tag, including the asynchronous AdSense tag. */}
        <script
          id="google-consent-defaults"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
        {/* AdSense 站点审核要求在初始 HTML 的 head 中直接看到该脚本，不能用 next/script 延迟注入 */}
        <script
          async
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3562784107542460"
          crossOrigin="anonymous"
        />
        {/* 结构化数据 - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* 结构化数据 - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
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
            <GoogleAnalytics />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

