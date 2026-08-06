import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookOpen, Video } from 'lucide-react';
import { getTutorialsByCategory } from '@/data/tutorials';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

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

export default async function TutorialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);
  const t = await getTranslations('tutorials');
  const bridgeCopy = locale === 'zh'
    ? { title: '教程之外：查看实战文章与排错案例', description: '博客覆盖命令参考、工具对比、安装问题和更具体的工作流，适合在完成教程后继续深入。', blog: '浏览博客文章', download: '回到安装入口' }
    : locale === 'ja'
      ? { title: 'チュートリアルの次は実践記事へ', description: 'ブログではコマンド一覧、ツール比較、導入トラブル、具体的な運用例を扱います。', blog: 'ブログを見る', download: 'インストール方法へ' }
      : { title: 'Beyond tutorials: practical articles and fixes', description: 'The blog covers command references, tool comparisons, installation failures, and focused workflows to continue after a tutorial.', blog: 'Browse the blog', download: 'Return to installation' };

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
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/tutorials" currentLabel={t('title')} />
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{bridgeCopy.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">{bridgeCopy.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/blog" className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">{bridgeCopy.blog}</Link>
            <Link href="/download" className="rounded-lg border border-blue-200 bg-white px-4 py-3 font-semibold text-blue-800 hover:border-blue-400">{bridgeCopy.download}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

