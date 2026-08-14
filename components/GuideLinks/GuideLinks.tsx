import { Link } from '@/i18n/routing';
import { asSupportedLocale, getIntentGuideLinks, type SupportedLocale } from '@/data/search-intents';

interface GuideLinksProps {
  locale: string;
  currentPath: string;
}

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  description: string;
  guides?: never;
}> = {
  en: {
    eyebrow: 'Related learning path',
    title: 'Continue with a practical guide',
    description: 'Move from installation to daily use, troubleshooting, and tool selection without losing context.',
  },
  zh: {
    eyebrow: '相关学习路线',
    title: '接着解决下一个实际问题',
    description: '从安装、日常使用到故障排查和工具选择，沿着同一条内容线继续阅读。',
  },
  ja: {
    eyebrow: '関連する学習ルート',
    title: '次の実践ガイドへ進む',
    description: 'インストール、日常操作、問題解決、ツール選びを同じ流れで確認できます。',
  },
};

export default function GuideLinks({ locale, currentPath }: GuideLinksProps) {
  const supportedLocale = asSupportedLocale(locale);
  const localizedCopy = copy[supportedLocale];
  const guides = getIntentGuideLinks(supportedLocale, currentPath);

  return (
    <section
      aria-labelledby="related-learning-path"
      className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
        {localizedCopy.eyebrow}
      </p>
      <h2 id="related-learning-path" className="text-2xl font-bold text-slate-950">
        {localizedCopy.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {localizedCopy.description}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
              {guide.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
