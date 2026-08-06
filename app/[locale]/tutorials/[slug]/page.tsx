import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTutorialBySlug, getAllTutorials } from "@/data/tutorials";

import { createMarkdownComponents } from "@/components/Markdown/markdownComponents";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";
import { normalizeZoxideFacts, stripLeadingH1 } from '@/lib/markdown/normalize';
import { getTutorialContentOverride } from "@/data/tutorial-content-overrides";
import GuideLinks from "@/components/GuideLinks/GuideLinks";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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
  const verificationNote = slug === "install-ubuntu"
    ? locale === "zh"
      ? "独立核验说明。本教程的 Ubuntu 24.04 软件包版本、上游安装方式与 fzf 要求已于 2026 年 8 月 6 日复核；安装时仍应查看本机候选版本。"
      : locale === "ja"
        ? "独立検証メモ：Ubuntu 24.04のパッケージ版、上流の導入方法、fzf要件は2026年8月6日に照合しました。導入時は手元の候補版も確認してください。"
        : "Independent verification note: Ubuntu 24.04 package versions, upstream installation methods, and the fzf requirement were checked on August 6, 2026. Confirm the versions offered to your machine when installing."
    : locale === "zh"
      ? "独立核验说明。本教程的命令与配置说明已于 2026 年 7 月 16 日对照 zoxide 官方仓库复核；不同版本可能存在差异。"
      : locale === "ja"
        ? "独立検証メモ：このチュートリアルのコマンドと設定は2026年7月16日にzoxide公式リポジトリと照合しました。バージョンによる差異に注意してください。"
        : "Independent verification note: commands and configuration guidance were checked against the official zoxide repository on July 16, 2026. Behavior can differ by version.";

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
        </main>
      </div>
    </div>
  );
}
