import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from "../providers";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner/DisclaimerBanner";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { generateOrganizationSchema } from "@/lib/seo/schema";

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

  // 验证 locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // 获取消息
  const messages = await getMessages();

  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* 结构化数据 - 放在 body 开头以避免 hydration 错误 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
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
    </>
  );
}

