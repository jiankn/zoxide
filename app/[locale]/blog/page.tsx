import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts } from "@/data/blog";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { getPrimaryPaths, isRedirectedContentPath } from '@/data/search-intents';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("seo");
  const tBlog = await getTranslations("blog");

  return generateMultilingualMetadata(locale, "/blog", {
    title: t("titles.blog"),
    description: tBlog("description"),
    keywords: t("blog"),
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const primary = getPrimaryPaths(locale);
  const intentHub = locale === 'zh'
    ? {
        title: '按问题找主页面',
        description: '每类搜索意图只保留一个主要答案；其他文章负责补充案例并给主页面投票。',
        cards: [
          { href: primary.howTo, title: '完整使用指南', description: '从安装、初始化到日常使用，适合系统学习。' },
          { href: primary.commands, title: '命令主参考页', description: '集中查询 z、zi、query、add、remove。' },
          { href: primary.troubleshooting, title: '故障排查中心', description: 'zoxide 已安装但不能正常工作时从这里开始。' },
          { href: primary.autojump, title: 'zoxide 与 autojump', description: '查看差异、选择建议和迁移方法。' },
        ],
      }
    : locale === 'ja'
      ? {
          title: '目的別のメインページ',
          description: '検索意図ごとに主要な回答を一つにし、関連記事は事例を補足して主要ページを支えます。',
          cards: [
            { href: primary.howTo, title: '完全な使い方ガイド', description: '導入、初期化、日常操作を順番に学びます。' },
            { href: primary.commands, title: 'コマンドリファレンス', description: 'z、zi、query、add、remove をまとめて確認します。' },
            { href: primary.troubleshooting, title: 'トラブル解決', description: '導入済みなのに動かない場合はここから診断します。' },
            { href: primary.autojump, title: 'zoxide と autojump', description: '違い、選び方、安全な移行手順を確認します。' },
          ],
        }
      : {
          title: 'Start with the main page for your task',
          description: 'Each search intent has one primary answer. Supporting articles add examples and point back to it.',
          cards: [
            { href: primary.howTo, title: 'Complete how-to guide', description: 'Learn installation, initialization, and daily use in one path.' },
            { href: primary.commands, title: 'Command reference', description: 'Look up z, zi, query, add, remove, and maintenance commands.' },
            { href: primary.troubleshooting, title: 'Troubleshooting hub', description: 'Start here when zoxide is installed but does not work.' },
            { href: primary.autojump, title: 'zoxide vs autojump', description: 'Compare behavior, tradeoffs, and a safe migration path.' },
          ],
        };
  const bridgeCopy = locale === "zh"
    ? { title: "想按步骤学习？从教程路线开始", description: "教程中心按入门、进阶、安装和视频整理内容，比按发布时间浏览更适合完成一个明确任务。", tutorials: "进入教程中心", troubleshooting: "查看常见问题" }
    : locale === "ja"
      ? { title: "順番に学ぶならチュートリアルへ", description: "チュートリアルは入門、応用、導入、動画に分かれ、投稿日順より目的に沿って進めます。", tutorials: "チュートリアルへ", troubleshooting: "FAQを見る" }
      : { title: "Prefer a step-by-step path? Start with tutorials", description: "The tutorial hub groups beginner, advanced, installation, and video guides so you can complete a task instead of browsing by publish date.", tutorials: "Open the tutorial hub", troubleshooting: "Read the FAQ" };
  const blogPosts = getAllPosts()
    .filter(
      (post) =>
        (!post.locales || post.locales.includes(locale as "zh" | "en" | "ja"))
        && !isRedirectedContentPath(locale, `/blog/${post.slug}`),
    )
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/blog" currentLabel={t("title")} />
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("description")}</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{intentHub.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">{intentHub.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {intentHub.cards.map((card) => (
              <Link key={card.href} href={card.href} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                <h3 className="font-semibold text-gray-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-0 border border-[#E9E9E7] rounded-md overflow-hidden">
          {blogPosts.map((post, index) => {
            // 防御：当翻译中缺少对应 slug 时不抛错
            const tData = t.has(`data.${post.slug}`)
              ? t.raw(`data.${post.slug}`)
              : undefined;
            // 分类翻译映射表
            const categoryTranslations: Record<
              string,
              Record<string, string>
            > = {
              教程: { zh: "教程", en: "Tutorial", ja: "チュートリアル" },
              对比: { zh: "对比", en: "Comparison", ja: "比較" },
              技巧: { zh: "技巧", en: "Tips", ja: "ヒント" },
              故障排除: {
                zh: "故障排除",
                en: "Troubleshooting",
                ja: "トラブルシューティング",
              },
            };
            const category =
              tData?.category ||
              categoryTranslations[post.category]?.[locale] ||
              post.category;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`group py-6 px-6 transition-colors hover:bg-[#F7F6F3] ${index !== blogPosts.length - 1
                  ? "border-b border-[#E9E9E7] "
                  : ""
                  }`}
              >
                <h2 className="font-serif text-xl font-bold text-[#37352F] mb-2">
                  {tData?.title || post.title}
                </h2>
                <div className="flex items-center mb-2">
                  <span className="text-xs font-sans text-[#6a6968] uppercase tracking-wide">
                    {post.date}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E3E2E0] text-[#32302C] text-xs mr-3 ml-3">
                    {category}
                  </span>
                  <span className="text-xs font-sans text-[#6a6968] uppercase tracking-wide">
                    {post.readTime} {t("readTime")}
                  </span>
                </div>
                <p className="text-[#37352F] mt-2 line-clamp-2">
                  {tData?.excerpt || post.excerpt}
                </p>
              </Link>
            );
          })}
        </div>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{bridgeCopy.title}</h2>
          <p className="mt-3 leading-7 text-gray-700">{bridgeCopy.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/tutorials" className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">{bridgeCopy.tutorials}</Link>
            <Link href="/faq" className="rounded-lg border border-blue-200 bg-white px-4 py-3 font-semibold text-blue-800 hover:border-blue-400">{bridgeCopy.troubleshooting}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

