import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';
import { BookOpen, Video } from 'lucide-react';
import { getTutorialsByCategory } from '@/data/tutorials';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

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

export default function TutorialsPage() {
  const beginnerTutorials = getTutorialsByCategory('入门教程');
  const advancedTutorials = getTutorialsByCategory('进阶技巧');
  const videoFaqTutorials = getTutorialsByCategory('视频 & FAQ');

  const tutorialCategories = [
    {
      title: '入门教程',
      icon: BookOpen,
      tutorials: beginnerTutorials.map((t) => ({
        title: t.title,
        href: `/tutorials/${t.slug}`,
        duration: t.duration,
        level: t.level,
      })),
    },
    {
      title: '进阶技巧',
      icon: BookOpen,
      tutorials: advancedTutorials.map((t) => ({
        title: t.title,
        href: `/tutorials/${t.slug}`,
        duration: t.duration,
        level: t.level,
      })),
    },
    {
      title: '视频 & FAQ',
      icon: Video,
      tutorials: [
        ...videoFaqTutorials.map((t) => ({
          title: t.title,
          href: `/tutorials/${t.slug}`,
          duration: t.duration,
          level: t.level,
        })),
        { title: '常见问题', href: '/faq', duration: '阅读', level: '所有' },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              zoxide 教程
            </h1>
            <p className="text-lg text-gray-600">
              从快速开始到高级配置，这里有完整的 zoxide 使用教程。
              无论你是初学者还是高级用户，都能找到适合的内容。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="tutorials-top" />

          {/* 教程分类 */}
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

          {/* 广告位 3: 教程卡片区域中段 */}
          <AdSlot slotId="tutorials-middle" />

          {/* 广告位 4: 页面底部 */}
          <AdSlot slotId="tutorials-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="tutorials-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

