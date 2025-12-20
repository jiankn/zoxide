import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getLocale } from 'next-intl/server';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

type ComparisonFeatureSet = Record<string, string>;

interface ComparisonItem {
  tool: string;
  features: ComparisonFeatureSet;
  zoxideFeatures: ComparisonFeatureSet;
}

type ComparisonMessages = {
  comparisons?: {
    items?: ComparisonItem[];
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tComparisons = await getTranslations('comparisons');
  return generateMultilingualMetadata(
    locale,
    '/comparisons',
    {
      title: t('titles.comparisons'),
      description: tComparisons('description'),
      keywords: t('comparison'),
    }
  );
}

export default async function ComparisonsPage() {
  const t = await getTranslations('comparisons');
  const locale = await getLocale();
  const messages: ComparisonMessages = locale === 'zh' ? zhMessages : enMessages;
  const comparisons = messages.comparisons?.items ?? [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          <AdSlot slotId="comparisons-top" />

          <div className="space-y-8">
            {comparisons.map((comparison, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('vs', { tool: comparison.tool })}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          {t('table.feature')}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          {comparison.tool}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-blue-600">
                          zoxide
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(comparison.features).map(([feature, value]) => (
                        <tr
                          key={feature}
                          className="border-b border-gray-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {t(`features.${feature}`)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {value as string}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                            {comparison.zoxideFeatures[feature] ?? ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <AdSlot slotId="comparisons-middle" />
          <AdSlot slotId="comparisons-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="comparisons-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
