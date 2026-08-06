import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getComparisonGuides } from '@/data/comparison-guides';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tComparisons = await getTranslations('comparisons');
  return generateMultilingualMetadata(locale, '/comparisons', {
    title: t('titles.comparisons'),
    description: tComparisons('description'),
    keywords: t('comparison'),
  });
}

export default async function ComparisonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('comparisons');
  const comparisons = getComparisonGuides(locale);
  const copy = locale === 'zh'
    ? { criterion: '比较维度', verdict: '快速结论', details: '查看完整对比与迁移建议 →' }
    : locale === 'ja'
      ? { criterion: '比較項目', verdict: '短い結論', details: '詳しい比較と移行手順を見る →' }
      : { criterion: 'Criterion', verdict: 'Short answer', details: 'Read the full comparison and migration guide →' };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/comparisons" currentLabel={t('title')} />
      <main className="space-y-12">
        <header>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-lg leading-8 text-gray-600">{t('description')}</p>
        </header>

        <div className="space-y-8">
          {comparisons.map((comparison) => (
            <section
              id={comparison.slug}
              key={comparison.slug}
              className="scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="bg-gray-50 px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-900">{comparison.title}</h2>
                <p className="mt-3 leading-7 text-gray-700">
                  <strong>{copy.verdict}:</strong> {comparison.verdict}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[42rem]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{copy.criterion}</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">zoxide</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{comparison.tool}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row) => (
                      <tr key={row.criterion} className="border-b border-gray-100 last:border-0">
                        <th scope="row" className="px-6 py-4 text-left text-sm font-medium text-gray-900">{row.criterion}</th>
                        <td className="px-6 py-4 text-sm leading-6 text-gray-700">{row.zoxide}</td>
                        <td className="px-6 py-4 text-sm leading-6 text-gray-700">{row.alternative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-100 px-6 py-5">
                <Link href={`/comparisons/${comparison.slug}`} className="font-semibold text-blue-700 hover:text-blue-900">
                  {copy.details}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
