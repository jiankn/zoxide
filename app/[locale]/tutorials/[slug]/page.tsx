import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTutorialBySlug, getAllTutorials } from "@/data/tutorials";

import { createMarkdownComponents } from "@/components/Markdown/markdownComponents";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";
import { stripLeadingH1 } from '@/lib/markdown/normalize';

const tutorialMarkdownComponents = createMarkdownComponents();

interface TutorialPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

type TutorialTranslation = {
  title?: string;
  excerpt?: string;
  content?: string;
  level?: string;
  duration?: string;
};

const fetchTutorialTranslation = (
  translator: Awaited<ReturnType<typeof getTranslations>>,
  slug: string,
): TutorialTranslation | undefined => {
  try {
    return translator.raw(`data.${slug}`) as TutorialTranslation;
  } catch {
    return undefined;
  }
};

export async function generateStaticParams() {
  const tutorials = getAllTutorials();

  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

export async function generateMetadata({ params }: TutorialPageProps) {
  const { slug, locale } = await params;
  const tutorial = getTutorialBySlug(slug);
  const t = await getTranslations("tutorials");

  if (!tutorial) {
    const tNotFound = await getTranslations("tutorials");
    return {
      title: tNotFound("notFound"),
    };
  }

  const tData = fetchTutorialTranslation(t, slug);
  const title = tData?.title || tutorial.title;
  const excerpt = tData?.excerpt || tutorial.excerpt;
  const tSeo = await getTranslations("seo");

  // 使用 SEO 标题模板，替换 {title} 占位符
  const seoTitle = tSeo("titles.tutorial", { title });

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  return generateMultilingualMetadata(locale, `/tutorials/${slug}`, {
    title: seoTitle,
    description: excerpt,
  });
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug, locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);
  const tutorial = getTutorialBySlug(slug);
  const t = await getTranslations("tutorials.detail");

  if (!tutorial) {
    notFound();
  }

  const tTutorials = await getTranslations("tutorials");
  const translation = fetchTutorialTranslation(tTutorials, slug);

  // 获取翻译后的数据
  const title = translation?.title || tutorial.title;
  const content = translation?.content || tutorial.content;
  // 规范化 markdown 内容：去除开头的 H1（ATX / Setext），避免与模板重复
  const normalizedContent = stripLeadingH1(content);
  // 分类需要从翻译文件中获取，如果数据文件中的分类是中文，需要映射
  const categoryKey =
    tutorial.category === "入门教程"
      ? "beginner"
      : tutorial.category === "进阶技巧"
        ? "advanced"
        : "video";
  const category = tTutorials(`categories.${categoryKey}`);
  const level = translation?.level || tutorial.level;
  const duration = translation?.duration || tutorial.duration;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-3 space-y-8">
          <header>
            <div className="mb-4">
              <Link
                href="/tutorials"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← {t("backToList")}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

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
                <span>{category}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {level}
              </span>
            </div>
          </header>

          <article className="markdown-content max-w-3xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={tutorialMarkdownComponents}
            >
              {normalizedContent}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
