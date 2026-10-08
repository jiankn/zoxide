import { notFound, permanentRedirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTutorialBySlug, getAllTutorials } from "@/data/tutorials";

import { createMarkdownComponents } from "@/components/Markdown/markdownComponents";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock, BookOpen, RefreshCw } from "lucide-react";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";
import { normalizeZoxideFacts, stripLeadingH1 } from '@/lib/markdown/normalize';
import { getTutorialContentOverride } from "@/data/tutorial-content-overrides";
import GuideLinks from "@/components/GuideLinks/GuideLinks";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { getContentRedirect, localizePath } from '@/data/search-intents';

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
  const redirectTarget = getContentRedirect(locale, `/tutorials/${slug}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

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
  const alternatePaths = Object.fromEntries(
    (['en', 'zh', 'ja'] as const).map((targetLocale) => {
      const path = `/tutorials/${slug}`;
      return [targetLocale, getContentRedirect(targetLocale, path) ? null : path];
    }),
  );
  return generateMultilingualMetadata(locale, `/tutorials/${slug}`, {
    title: seoTitle,
    description: excerpt,
  }, alternatePaths);
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug, locale } = await params;
  const redirectTarget = getContentRedirect(locale, `/tutorials/${slug}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

  // 启用静态渲染 (SSG)
  setRequestLocale(locale);
  const tutorial = getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  const tTutorials = await getTranslations("tutorials");
  const translation = fetchTutorialTranslation(tTutorials, slug);

  // 获取翻译后的数据
  const title = translation?.title || tutorial.title;
  const content = getTutorialContentOverride(locale, slug) || translation?.content || tutorial.content;
  const tutorialMarkdownComponents = createMarkdownComponents({ locale });
  // 规范化 markdown 内容：去除开头的 H1（ATX / Setext），避免与模板重复
  const normalizedContent = stripLeadingH1(normalizeZoxideFacts(content));
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
  // 仅对实际复核过的教程显示核验说明；Windows、macOS 教程正文自带测试环境表
  const verificationNote = slug === "install-ubuntu"
    ? locale === "zh"
      ? "实测说明。本教程于 2026 年 10 月 8 日在全新的官方 ubuntu:24.04 容器中逐条实测；软件包版本会随 Ubuntu 更新变化，安装时请以 apt-cache policy 的输出为准。"
      : locale === "ja"
        ? "検証メモ：このガイドは 2026 年 10 月 8 日に新規の公式 ubuntu:24.04 コンテナで手順ごとに実行しました。パッケージ版は Ubuntu の更新で変わるため、導入時は apt-cache policy の出力を確認してください。"
        : "Test note: every step in this guide was run on October 8, 2026 in a fresh official ubuntu:24.04 container. Package versions change with Ubuntu updates, so trust the output of apt-cache policy on your machine."
    : null;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <Breadcrumbs locale={locale} path={`/tutorials/${slug}`} currentLabel={title} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-3 space-y-8">
          <header>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{tutorial.date}</span>
              </div>
              {tutorial.updated && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    {locale === "zh" ? "更新于 " : locale === "ja" ? "更新日 " : "Updated "}
                    <time dateTime={tutorial.updated}>{tutorial.updated}</time>
                  </span>
                </div>
              )}
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

          <GuideLinks locale={locale} currentPath={`/tutorials/${slug}`} />

          {verificationNote && (
            <aside className="mx-auto max-w-3xl rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
              {verificationNote}{" "}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                GitHub
              </a>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
