import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Zap, Search, Brain, Users, Settings, Rocket } from 'lucide-react';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tFeatures = await getTranslations('features');
  return generateMultilingualMetadata(
    locale,
    '/features',
    {
      title: t('titles.features'),
      description: tFeatures('description'),
      keywords: t('features'),
    }
  );
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('features');
  const factualIntroduction = locale === 'zh'
    ? '了解 zoxide 的 Rust 实现、frecency 智能排序、模糊目录搜索，以及 Bash、Zsh、Fish 和 PowerShell 的 Shell 集成。'
    : locale === 'ja'
      ? 'zoxideのRust実装、frecencyランキング、ファジーディレクトリ検索、Bash・Zsh・Fish・PowerShellとのシェル統合を紹介します。'
      : 'Explore zoxide’s Rust implementation, frecency ranking, fuzzy directory search, and shell integration for Bash, Zsh, Fish, and PowerShell.';
  const linkLabel = locale === 'zh' ? '查看对应教程 →' : locale === 'ja' ? '関連ガイドを見る →' : 'Open the related guide →';
  const nextStep = locale === 'zh'
    ? { title: '下一步：安装并完成第一次跳转', description: '选好平台安装方式，再用快速上手教程验证 z、zi 和 Shell 初始化。', install: '查看安装方法', tutorial: '进入快速上手' }
    : locale === 'ja'
      ? { title: '次の手順：導入して最初のジャンプを確認', description: 'OS に合う方法で導入し、クイックスタートで z、zi、シェル初期化を確認します。', install: 'インストール方法', tutorial: 'クイックスタート' }
      : { title: 'Next: install it and verify your first jump', description: 'Choose the right installer, then use the quick-start tutorial to verify z, zi, and shell initialization.', install: 'Choose an install method', tutorial: 'Open the quick start' };

  const featureGroups = [
    {
      title: t('core.title'),
      features: [
        {
          icon: Zap,
          title: t('core.fast.title'),
          description: t('core.fast.description'),
          href: '/tutorials/performance',
        },
        {
          icon: Search,
          title: t('core.fuzzy.title'),
          description: t('core.fuzzy.description'),
          href: '/tutorials/fzf-integration',
        },
        {
          icon: Brain,
          title: t('core.smart.title'),
          description: t('core.smart.description'),
          href: '/tutorials/basic-commands',
        },
      ],
    },
    {
      title: t('advanced.title'),
      features: [
        {
          icon: Settings,
          title: t('advanced.config.title'),
          description: t('advanced.config.description'),
          href: '/tutorials/advanced-config',
        },
        {
          icon: Users,
          title: t('advanced.team.title'),
          description: t('advanced.team.description'),
          href: '/tutorials/shell-setup',
        },
        {
          icon: Rocket,
          title: t('advanced.performance.title'),
          description: t('advanced.performance.description'),
          href: '/tutorials/performance',
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/features" currentLabel={t('title')} />
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {factualIntroduction}
          </p>
        </div>

        {featureGroups.map((group, groupIndex) => (
          <section key={groupIndex} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {group.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={index}
                    className="flex flex-col bg-white border border-[#E9E9E7] rounded-md p-6 transition-colors hover:bg-[#F7F6F3]"
                  >
                    <Icon className="h-6 w-6 text-[#37352F] mb-4" />
                    <h3 className="font-serif font-bold text-lg mb-2 text-[#37352F]">
                      {feature.title}
                    </h3>
                    <p className="font-sans text-[#6a6968] text-sm leading-6">
                      {feature.description}
                    </p>
                    <Link href={feature.href} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900">
                      {linkLabel}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="rounded-2xl bg-gray-950 p-6 text-white md:p-8">
          <h2 className="text-2xl font-bold">{nextStep.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-300">{nextStep.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/download" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">{nextStep.install}</Link>
            <Link href="/tutorials/quick-start" className="rounded-lg border border-gray-600 px-5 py-3 font-semibold text-white hover:border-blue-400">{nextStep.tutorial}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

