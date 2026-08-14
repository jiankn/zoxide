import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getComparisonGuides } from '@/data/comparison-guides';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { getContentRedirect } from '@/data/search-intents';

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
    ? { verdict: '快速结论', details: '查看完整对比与迁移建议 →' }
    : locale === 'ja'
      ? { verdict: '短い結論', details: '詳しい比較と移行手順を見る →' }
      : { verdict: 'Short answer', details: 'Read the full comparison and migration guide →' };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/comparisons" currentLabel={t('title')} />
      <main className="space-y-12">
        <header>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-lg leading-8 text-gray-600">{t('description')}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {comparisons.map((comparison) => (
            <Link
              id={comparison.slug}
              key={comparison.slug}
              href={getContentRedirect(locale, `/comparisons/${comparison.slug}`) || `/comparisons/${comparison.slug}`}
              className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900">{comparison.title}</h2>
              <p className="mt-3 leading-7 text-gray-700">
                <strong>{copy.verdict}:</strong> {comparison.verdict}
              </p>
              <span className="mt-5 inline-block font-semibold text-blue-700">{copy.details}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
