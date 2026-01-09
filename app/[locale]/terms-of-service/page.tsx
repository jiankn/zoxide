import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

type LegalSection = {
  title: string;
  content: string | string[];
};

type LegalSectionMap = Record<string, LegalSection>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tTerms = await getTranslations('termsOfService');
  return generateMultilingualMetadata(
    locale,
    '/terms-of-service',
    {
      title: t('titles.termsOfService'),
      description: tTerms('description'),
      keywords: t('legal'),
    }
  );
}

export default async function TermsOfServicePage() {
  const t = await getTranslations('termsOfService');
  const sections = t.raw('sections') as LegalSectionMap;
  const sectionEntries = Object.entries(sections);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {t('lastUpdated')}
            </p>
          </div>

          <AdSlot slotId="terms-top" />

          <section className="prose prose-lg max-w-none">
            {sectionEntries.map(([key, section]) => (
              <div key={key} className="mb-8">
                <h2>{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <ul>
                    {section.content.map((item, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
              </div>
            ))}
          </section>

          <AdSlot slotId="terms-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="terms-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
