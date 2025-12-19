import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getMessages, getLocale } from 'next-intl/server';
import { generateFAQPageSchema } from '@/lib/seo/schema';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const tFaq = await getTranslations('faq');
  const locale = await getLocale();
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

export default async function FAQPage() {
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
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <main className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('description')}
              </p>
            </div>

            <AdSlot slotId="faq-top" />

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

            <AdSlot slotId="faq-middle" />
            <AdSlot slotId="faq-bottom" />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
              <AdSlot slotId="faq-sidebar" lazy={true} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
