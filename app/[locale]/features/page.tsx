import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Zap, Search, Brain, Users, Settings, Rocket } from 'lucide-react';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

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

  const featureGroups = [
    {
      title: t('core.title'),
      features: [
        {
          icon: Zap,
          title: t('core.fast.title'),
          description: t('core.fast.description'),
        },
        {
          icon: Search,
          title: t('core.fuzzy.title'),
          description: t('core.fuzzy.description'),
        },
        {
          icon: Brain,
          title: t('core.smart.title'),
          description: t('core.smart.description'),
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
        },
        {
          icon: Users,
          title: t('advanced.team.title'),
          description: t('advanced.team.description'),
        },
        {
          icon: Rocket,
          title: t('advanced.performance.title'),
          description: t('advanced.performance.description'),
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
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
                  <div
                    key={index}
                    className="bg-white border border-[#E9E9E7] rounded-md p-6 transition-colors hover:bg-[#F7F6F3]"
                  >
                    <Icon className="h-6 w-6 text-[#37352F] mb-4" />
                    <h3 className="font-serif font-bold text-lg mb-2 text-[#37352F]">
                      {feature.title}
                    </h3>
                    <p className="font-sans text-[#6a6968] text-sm leading-6">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

