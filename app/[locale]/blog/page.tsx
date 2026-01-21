import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts } from "@/data/blog";
import { generateMultilingualMetadata } from "@/lib/seo/metadata";

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
  const blogPosts = getAllPosts()
    .filter(
      (post) =>
        !post.locales || post.locales.includes(locale as "zh" | "en" | "ja"),
    )
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("description")}</p>
        </div>

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
      </main>
    </div>
  );
}

