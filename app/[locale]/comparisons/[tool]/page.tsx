import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { comparisonSlugs, getComparisonGuide, getComparisonGuides } from '@/data/comparison-guides';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { getContentRedirect, localizePath } from '@/data/search-intents';

interface ComparisonPageProps {
  params: Promise<{ locale: string; tool: string }>;
}

export function generateStaticParams() {
  return comparisonSlugs.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: ComparisonPageProps) {
  const { locale, tool } = await params;
  const redirectTarget = getContentRedirect(locale, `/comparisons/${tool}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

  const guide = getComparisonGuide(locale, tool);
  if (!guide) return {};
  const alternatePaths = Object.fromEntries(
    (['en', 'zh', 'ja'] as const).map((targetLocale) => {
      const path = `/comparisons/${tool}`;
      return [targetLocale, getContentRedirect(targetLocale, path) ? null : path];
    }),
  );

  return generateMultilingualMetadata(locale, `/comparisons/${tool}`, {
    title: guide.title,
    description: guide.description,
  }, alternatePaths);
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { locale, tool } = await params;
  const redirectTarget = getContentRedirect(locale, `/comparisons/${tool}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

  setRequestLocale(locale);
  const guide = getComparisonGuide(locale, tool);
  if (!guide) notFound();

  const related = getComparisonGuides(locale).filter((item) => item.slug !== guide.slug);
  const copy = locale === 'zh'
    ? {
        criterion: '比较维度',
        shortAnswer: '简短结论',
        chooseZoxide: '这些情况更适合 zoxide',
        chooseOther: `这些情况可以保留 ${guide.tool}`,
        migration: '低风险迁移方法',
        official: `查看 ${guide.tool} 官方项目`,
        related: '继续比较',
        install: '决定试用 zoxide？查看安装与验证步骤 →',
      }
    : locale === 'ja'
      ? {
          criterion: '比較項目',
          shortAnswer: '短い結論',
          chooseZoxide: 'zoxide が向く場合',
          chooseOther: `${guide.tool} を残す場合`,
          migration: '安全に移行する手順',
          official: `${guide.tool} の公式プロジェクト`,
          related: 'ほかの比較',
          install: 'zoxide を試す場合は導入と確認手順へ →',
        }
      : {
          criterion: 'Criterion',
          shortAnswer: 'Short answer',
          chooseZoxide: 'Choose zoxide when',
          chooseOther: `Keep ${guide.tool} when`,
          migration: 'A low-risk migration path',
          official: `View the official ${guide.tool} project`,
          related: 'Compare another tool',
          install: 'Ready to try zoxide? Follow the install and verification steps →',
        };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path={`/comparisons/${guide.slug}`} currentLabel={guide.title} />
      <main className="space-y-10">
        <header className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950">{guide.title}</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">{guide.description}</p>
        </header>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-gray-950">{copy.shortAnswer}</h2>
          <p className="mt-3 leading-7 text-gray-700">{guide.verdict}</p>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{copy.criterion}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">zoxide</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{guide.tool}</th>
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row) => (
                  <tr key={row.criterion} className="border-t border-gray-100">
                    <th scope="row" className="px-6 py-4 text-left text-sm font-medium text-gray-900">{row.criterion}</th>
                    <td className="px-6 py-4 text-sm leading-6 text-gray-700">{row.zoxide}</td>
                    <td className="px-6 py-4 text-sm leading-6 text-gray-700">{row.alternative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-950">{copy.chooseZoxide}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-gray-700">
              {guide.chooseZoxide.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-950">{copy.chooseOther}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-gray-700">
              {guide.chooseAlternative.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>

        <section className="rounded-xl bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-950">{copy.migration}</h2>
          <p className="mt-3 leading-7 text-gray-700">{guide.migration}</p>
          <a href={guide.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
            {copy.official} ↗
          </a>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-950">{copy.related}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={getContentRedirect(locale, `/comparisons/${item.slug}`) || `/comparisons/${item.slug}`} className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                <h3 className="font-semibold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.verdict}</p>
              </Link>
            ))}
          </div>
          <Link href="/download" className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-900">
            {copy.install}
          </Link>
        </section>
      </main>
    </div>
  );
}
