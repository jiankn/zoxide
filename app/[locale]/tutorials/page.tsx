import AdSlot from '@/components/AdSlot/AdSlot';
import { Link } from '@/i18n/routing';
import { getTranslations, getLocale } from 'next-intl/server';
import { BookOpen, Video } from 'lucide-react';
import { getTutorialsByCategory } from '@/data/tutorials';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

type TutorialTranslationMeta = {
  title?: string;
  duration?: string;
  level?: string;
};

const fetchTutorialTranslation = (
  translator: Awaited<ReturnType<typeof getTranslations>>,
  slug: string
): TutorialTranslationMeta | undefined => {
  try {
    return translator.raw(`data.${slug}`) as TutorialTranslationMeta;
  } catch {
    return undefined;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tTutorials = await getTranslations('tutorials');

  return generateMultilingualMetadata(
    locale,
    '/tutorials',
    {
      title: t('titles.tutorials'),
      description: tTutorials('description'),
      keywords: t('tutorial'),
    }
  );
}

export default async function TutorialsPage() {
  const locale = await getLocale();
  const t = await getTranslations('tutorials');

  // 根据语言获取分类映射（数据文件中的分类名是中文）
  const categoryMap: Record<string, string> = locale === 'zh' ? {
    'beginner': '入门教程',
    'advanced': '进阶技巧',
    'video': '视频 & FAQ',
    'installation': '安装指南',
  } : {
    'beginner': '入门教程', // 数据文件中是中文，需要保持
    'advanced': '进阶技巧',
    'video': '视频 & FAQ',
    'installation': '安装指南',
  };

  const beginnerTutorials = getTutorialsByCategory(categoryMap.beginner);
  const advancedTutorials = getTutorialsByCategory(categoryMap.advanced);
  const videoFaqTutorials = getTutorialsByCategory(categoryMap.video);
  const installationTutorials = getTutorialsByCategory(categoryMap.installation);

  const tutorialCategories = [
    {
      title: t('categories.beginner'),
      icon: BookOpen,
      tutorials: beginnerTutorials.map((tutorial) => {
        const translation = fetchTutorialTranslation(t, tutorial.slug);
        return {
          title: translation?.title || tutorial.title,
          href: `/tutorials/${tutorial.slug}`,
          duration: translation?.duration || tutorial.duration,
          level: translation?.level || tutorial.level,
        };
      }),
    },
    {
      title: t('categories.advanced'),
      icon: BookOpen,
      tutorials: advancedTutorials.map((tutorial) => {
        const translation = fetchTutorialTranslation(t, tutorial.slug);
        return {
          title: translation?.title || tutorial.title,
          href: `/tutorials/${tutorial.slug}`,
          duration: translation?.duration || tutorial.duration,
          level: translation?.level || tutorial.level,
        };
      }),
    },
    {
      title: t('categories.video'),
      icon: Video,
      tutorials: [
        ...videoFaqTutorials.map((tutorial) => {
          const translation = fetchTutorialTranslation(t, tutorial.slug);
          return {
            title: translation?.title || tutorial.title,
            href: `/tutorials/${tutorial.slug}`,
            duration: translation?.duration || tutorial.duration,
            level: translation?.level || tutorial.level,
          };
        }),
        { title: t('faqLink'), href: '/faq', duration: ({ zh: '阅读', en: 'Read', ja: '読む' } as Record<string, string>)[locale] || 'Read', level: t('detail.all') },
      ],
    },
    {
      title: t('categories.installation'),
      icon: BookOpen,
      tutorials: installationTutorials.map((tutorial) => {
        const translation = fetchTutorialTranslation(t, tutorial.slug);
        return {
          title: translation?.title || tutorial.title,
          href: `/tutorials/${tutorial.slug}`,
          duration: translation?.duration || tutorial.duration,
          level: translation?.level || tutorial.level,
        };
      }),
    },
  ];

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

          <AdSlot slotId="tutorials-top" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {tutorialCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      {category.title}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {category.tutorials.map((tutorial, index) => (
                      <Link
                        key={index}
                        href={tutorial.href}
                        className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {tutorial.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{tutorial.duration}</span>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            {tutorial.level}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <AdSlot slotId="tutorials-middle" />
          <AdSlot slotId="tutorials-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="tutorials-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
