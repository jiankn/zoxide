import { notFound, permanentRedirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import { getPostBySlug, getRelatedPosts } from "@/data/blog";
import RelatedPosts from "@/components/RelatedPosts/RelatedPosts";
import GuideLinks from "@/components/GuideLinks/GuideLinks";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { createMarkdownComponents } from "@/components/Markdown/markdownComponents";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock, User } from "lucide-react";
import { generateArticleSchema } from "@/lib/seo/schema";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";
import { normalizeZoxideFacts, stripLeadingH1 } from '@/lib/markdown/normalize';
import { getBlogContentOverride } from '@/data/blog-content-overrides';
import { getEditorialGuide } from '@/data/zoxide-editorial-guides';
import { getContentRedirect, localizePath } from '@/data/search-intents';

const ShareButtons = dynamic(
  () => import("@/components/ShareButtons/ShareButtons"),
  {
    loading: () => null,
  },
);

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/data/blog");
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  const redirectTarget = getContentRedirect(locale, `/blog/${slug}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

  const post = getPostBySlug(slug);

  // 如果文章限定了语言且不包含当前 locale，返回 404 元数据
  if (
    post &&
    post.locales &&
    !post.locales.includes(locale as "zh" | "en" | "ja")
  ) {
    const notFoundTitles: Record<string, string> = {
      zh: "文章未找到",
      en: "Post Not Found",
      ja: "記事が見つかりません",
    };
    return {
      title: notFoundTitles[locale] || notFoundTitles.en,
    };
  }
  const t = await getTranslations("blog");

  if (!post) {
    const tNotFound = await getTranslations("blog");
    const notFoundTitles: Record<string, string> = {
      zh: "文章未找到",
      en: "Post Not Found",
      ja: "記事が見つかりません",
    };
    return {
      title:
        tNotFound("notFound") || notFoundTitles[locale] || notFoundTitles.en,
    };
  }

  const editorialGuide = getEditorialGuide(locale, slug);
  const tData = t.has(`data.${slug}`) ? t.raw(`data.${slug}`) : undefined;
  const title = editorialGuide?.title || tData?.title || post.title;
  const excerpt = editorialGuide?.excerpt || tData?.excerpt || post.excerpt;
  const author = tData?.author || post.author;
  const tSeo = await getTranslations("seo");

  // 使用 SEO 标题模板，替换 {title} 占位符
  const seoTitle = editorialGuide?.title || tSeo("titles.blogPost", { title });

  // 优化 description：确保长度在 150-160 字符之间，包含关键词
  const optimizedDescription =
    excerpt.length > 160 ? excerpt.substring(0, 157) + "..." : excerpt;

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  // canonical URL 必须与 sitemap 和 next.config 中的格式一致：
  // 1. 默认语言（en）不带语言前缀
  // 2. 所有 URL 必须有尾部斜杠（trailingSlash: true）
  const isDefaultLocale = locale === "en";
  const canonicalUrl = isDefaultLocale
    ? `https://zoxide.org/blog/${slug}/`
    : `https://zoxide.org/${locale}/blog/${slug}/`;
  const imageUrl = `https://zoxide.org/icon.svg`;

  // 生成 keywords：优先使用 primaryKeyword，确保主关键词在第一位
  const keywordsList = post.primaryKeyword
    ? [post.primaryKeyword, ...post.tags.filter(t => t !== post.primaryKeyword)]
    : post.tags;

  const supportedLocales = ["en", "zh", "ja"] as const;
  const alternatePaths = Object.fromEntries(
    supportedLocales.map((targetLocale) => {
      const alternateSlug = post.locales
        ? post.locales.includes(targetLocale)
          ? slug
          : post.alternateSlugs?.[targetLocale]
        : slug;
      const alternatePost = alternateSlug
        ? getPostBySlug(alternateSlug)
        : undefined;
      const candidatePath = alternateSlug ? `/blog/${alternateSlug}` : null;
      const isAvailable = alternatePost
        && (!alternatePost.locales || alternatePost.locales.includes(targetLocale))
        && candidatePath
        && !getContentRedirect(targetLocale, candidatePath);

      return [targetLocale, isAvailable ? candidatePath : null];
    }),
  );

  const metadata = generateMultilingualMetadata(locale, `/blog/${slug}`, {
    title: seoTitle,
    description: optimizedDescription,
    keywords: keywordsList.join(", "),
    // Open Graph 元数据
    openGraph: {
      title: seoTitle,
      description: optimizedDescription,
      url: canonicalUrl,
      siteName: "zoxide.org",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale:
        ({ zh: "zh_CN", en: "en_US", ja: "ja_JP" } as Record<string, string>)[
        locale
        ] || "en_US",
      type: "article",
      publishedTime: post.date,
      authors: [author],
      tags: keywordsList,
    },
    // Twitter Card 元数据
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: optimizedDescription,
      images: [imageUrl],
    },
  }, alternatePaths);

  return metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  const redirectTarget = getContentRedirect(locale, `/blog/${slug}`);
  if (redirectTarget) permanentRedirect(localizePath(locale, redirectTarget));

  // 启用静态渲染 (SSG)
  setRequestLocale(locale);
  const post = getPostBySlug(slug);
  const t = await getTranslations("blog.detail");

  if (
    !post ||
    (post.locales && !post.locales.includes(locale as "zh" | "en" | "ja"))
  ) {
    notFound();
  }

  const tBlog = await getTranslations("blog");
  const editorialGuide = getEditorialGuide(locale, slug);
  const tData = tBlog.has(`data.${slug}`) ? tBlog.raw(`data.${slug}`) : {};
  const relatedPosts = getRelatedPosts(post, 3, locale);

  // 获取翻译后的数据
  const title = editorialGuide?.title || tData?.title || post.title;
  const excerpt = editorialGuide?.excerpt || tData?.excerpt || post.excerpt;
  const content = editorialGuide?.content || getBlogContentOverride(locale, slug) || tData?.content || post.content;
  const blogMarkdownComponents = createMarkdownComponents({
    linkTarget: "_blank",
    locale,
  });
  // 规范化 markdown 内容：去除开头的 H1（ATX / Setext），避免与模板重复
  const normalizedContent = stripLeadingH1(normalizeZoxideFacts(content));
  // 分类翻译映射表
  const categoryTranslations: Record<string, Record<string, string>> = {
    教程: { zh: "教程", en: "Tutorial", ja: "チュートリアル" },
    对比: { zh: "对比", en: "Comparison", ja: "比較" },
    技巧: { zh: "技巧", en: "Tips", ja: "ヒント" },
  };
  const category =
    tData?.category ||
    categoryTranslations[post.category]?.[locale] ||
    post.category;
  const author = tData?.author || post.author;
  // 标签翻译
  const tags = tData?.tags || post.tags;

  // 使用与 canonical URL 一致的格式
  const isDefaultLocaleForSchema = locale === "en";
  const articleUrl = isDefaultLocaleForSchema
    ? `https://zoxide.org/blog/${post.slug}/`
    : `https://zoxide.org/${locale}/blog/${post.slug}/`;

  // 生成文章结构化数据
  const articleSchema = generateArticleSchema(
    title,
    excerpt,
    author,
    post.date,
    articleUrl,
    post.date, // dateModified 使用发布日期（如果有更新日期可以单独设置）
  );
  const verificationNote = slug === "zoxide-vs-autojump"
    ? locale === "zh"
      ? "独立核验说明。本文的命令与支持范围已于 2026 年 8 月 6 日对照 zoxide 与 autojump 上游资料复核；批量配置前请再次查看最新发行说明。"
      : locale === "ja"
        ? "独立検証メモ：コマンドと対応範囲は2026年8月6日にzoxideとautojumpの上流資料で照合しました。複数端末へ展開する前に最新リリース文書を再確認してください。"
        : "Independent verification note: commands and support statements were checked against the zoxide and autojump upstream sources on August 6, 2026. Recheck current release notes before a multi-machine rollout."
    : locale === "zh"
      ? "独立核验说明。文中的命令与版本说明已于 2026 年 7 月 16 日对照 zoxide 官方仓库复核；用于自动化前请再次查看最新发行说明。"
      : locale === "ja"
        ? "独立検証メモ：コマンドとバージョン情報は2026年7月16日にzoxide公式リポジトリと照合しました。自動化に利用する前に最新リリースノートを再確認してください。"
        : "Independent verification note: commands and version references were checked against the official zoxide repository on July 16, 2026. Recheck the latest release notes before using them in automation.";

  // 如果是教程类文章，添加 HowTo Schema
  const isTutorial = post.category === "教程" || post.category === "Tutorial";
  let howToSchema = null;

  if (isTutorial && slug === "zoxide-init-guide") {
    // 为 zoxide init 文章生成 HowTo Schema
    const { generateHowToSchema } = await import("@/lib/seo/schema");
    howToSchema = generateHowToSchema(title, excerpt, [
      {
        name: "Install zoxide",
        text: "Install zoxide using the official install script or a supported package manager such as Homebrew or Scoop.",
      },
      {
        name: "Initialize Shell",
        text: "Run zoxide init command for your shell (bash, zsh, fish, PowerShell, or nushell).",
      },
      {
        name: "Configure Shell",
        text: "Add the initialization command to your shell configuration file.",
      },
      {
        name: "Reload Shell",
        text: "Reload your shell or open a new terminal window to activate zoxide.",
      },
    ]);
  }

  return (
    <>
      {/* 文章结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {/* HowTo 结构化数据（如果是教程） */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Breadcrumbs locale={locale} path={`/blog/${slug}`} currentLabel={title} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <main className="lg:col-span-3 space-y-8">
            <header>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {post.readTime} {t("readTime")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{author}</span>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {category}
                </span>
              </div>

              <ShareButtons
                title={title}
                url={
                  locale === "en"
                    ? `/blog/${post.slug}`
                    : `/${locale}/blog/${post.slug}`
                }
              />
            </header>

            <article className="markdown-content max-w-3xl mx-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={blogMarkdownComponents}
              >
                {normalizedContent}
              </ReactMarkdown>
            </article>

            <GuideLinks locale={locale} currentPath={`/blog/${slug}`} />

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

            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <RelatedPosts posts={relatedPosts} />
          </main>
        </div>
      </div>
    </>
  );
}
