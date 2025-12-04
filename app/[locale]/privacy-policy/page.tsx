import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations } from 'next-intl/server';

type LegalSection = {
  title: string;
  content: string | string[];
};

type LegalSectionMap = Record<string, LegalSection>;

export async function generateMetadata() {
  const t = await getTranslations('seo');
  return {
    title: t('titles.privacyPolicy'),
    description: 'zoxide.org 隐私政策，说明我们如何收集、使用和保护您的个人信息。',
    keywords: t('legal'),
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacyPolicy');
  const sections = t.raw('sections') as LegalSectionMap;
  const sectionEntries = Object.entries(sections);

  return (
    <div className="container mx-auto px-4 py-12">
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

          <AdSlot slotId="privacy-top" />

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

          <AdSlot slotId="privacy-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="privacy-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
