import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTutorialBySlug, getAllTutorials } from '@/data/tutorials';
import AdSlot from '@/components/AdSlot/AdSlot';
import { createMarkdownComponents } from '@/components/Markdown/markdownComponents';
import Link from 'next/link';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

const tutorialMarkdownComponents = createMarkdownComponents();

interface TutorialPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

// 生成静态路径
export async function generateStaticParams() {
  const tutorials = getAllTutorials();
  
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: TutorialPageProps) {
  const { slug, locale } = await params;
  const tutorial = getTutorialBySlug(slug);
  const t = await getTranslations('tutorials');
  
  if (!tutorial) {
    const tNotFound = await getTranslations('tutorials');
    return {
      title: tNotFound('notFound'),
    };
  }

  const tData = fetchTutorialTranslation(t, slug);
  const title = tData?.title || tutorial.title;
  const excerpt = tData?.excerpt || tutorial.excerpt;
  const tSeo = await getTranslations('seo');
  
  // 使用 SEO 标题模板，替换 {title} 占位符
  const seoTitle = tSeo('titles.tutorial', { title });

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  return generateMultilingualMetadata(
    locale,
    `/tutorials/${slug}`,
    {
      title: seoTitle,
      description: excerpt,
    }
  );
}

type TutorialTranslationMeta = {
  title?: string;
  duration?: string;
  level?: string;
  excerpt?: string;
  content?: string;
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

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const tutorial = getTutorialBySlug(slug);
  const t = await getTranslations('tutorials');

  if (!tutorial) {
    notFound();
  }

  const tData = fetchTutorialTranslation(t, slug);
  const title = tData?.title || tutorial.title;
  const content = tData?.content || tutorial.content;
  const duration = tData?.duration || tutorial.duration;
  const level = tData?.level || tutorial.level;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <header>
            <div className="mb-4">
              <Link
                href="/tutorials"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← {locale === 'zh' ? '返回教程列表' : 'Back to Tutorials'}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{tutorial.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{tutorial.category}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {level}
              </span>
            </div>
          </header>

          <AdSlot slotId="tutorials-top" />

          <article className="markdown-content max-w-3xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={tutorialMarkdownComponents}
            >
              {content}
            </ReactMarkdown>
          </article>

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

