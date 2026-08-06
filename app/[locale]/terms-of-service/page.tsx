import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

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

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('termsOfService');
  const sections = t.raw('sections') as LegalSectionMap;
  const sectionEntries = Object.entries(sections);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/terms-of-service" currentLabel={t('title')} />
      <main className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {t('lastUpdated')}
          </p>
        </div>

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
      </main>
    </div>
  );
}

