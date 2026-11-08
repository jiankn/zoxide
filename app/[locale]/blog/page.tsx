import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import GuideIndex from '@/components/TaskGuides/GuideIndex';
import { words } from '@/data/task-guides';

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
  setRequestLocale(locale);
  const title = words(locale, 'All zoxide guides', 'zoxide 全部指南', 'zoxide ガイド一覧');
  return <div className="mx-auto max-w-5xl px-5 py-12"><Breadcrumbs locale={locale} path="/blog" currentLabel={title} /><h1 className="mt-4 font-serif text-4xl font-bold">{title}</h1><p className="my-6 max-w-3xl text-lg leading-8 text-gray-600">{words(locale, 'Find an installation path, fix an error, look up commands, or compare tools. Every guide below has a specific job.', '按任务找指南：安装配置、修复错误、查询命令或比较工具，每个页面负责一个具体问题。', '導入、エラー解決、コマンド、ツール比較。目的に合ったガイドを選んでください。')}</p><GuideIndex locale={locale} /></div>;
}
