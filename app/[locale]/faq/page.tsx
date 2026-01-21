import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { generateFAQPageSchema } from '@/lib/seo/schema';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tSeo = await getTranslations('seo');
  const tFaq = await getTranslations('faq');
  return generateMultilingualMetadata(
    locale,
    '/faq',
    {
      title: tSeo('titles.faq'),
      description: tFaq('description'),
      keywords: tSeo('faq'),
    }
  );
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const messages = await getMessages();
  const faqs = messages.faq.items as Array<{ question: string; answer: string }>;
  const faqSchema = generateFAQPageSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <main className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h2>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

