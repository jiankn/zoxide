import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getLocale } from 'next-intl/server';
import { Zap, Search, Brain, Users, Settings, Rocket } from 'lucide-react';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const tFeatures = await getTranslations('features');
  const locale = await getLocale();
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

export default async function FeaturesPage() {
  const t = await getTranslations('features');

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
    <div className="container mx-auto px-4 py-12">
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

          <AdSlot slotId="features-top" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureGroups.map((group, groupIndex) => (
              <section key={groupIndex} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {group.title}
                </h2>
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
              </section>
            ))}
          </div>

          <AdSlot slotId="features-middle" />
          <AdSlot slotId="features-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="features-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
