import AdSlot from '@/components/AdSlot/AdSlot';
import { Link } from '@/i18n/routing';
import { getTranslations, getLocale } from 'next-intl/server';
import { getAllPosts } from '@/data/blog';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const tBlog = await getTranslations('blog');
  
  return {
    title: t('titles.blog'),
    description: tBlog('description'),
    keywords: t('blog'),
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations('blog');
  const blogPosts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <AdSlot slotId="blog-list-top" />

          <div className="space-y-6">
            {blogPosts.map((post) => {
              const tData = t.raw(`data.${post.slug}`);
              // 分类翻译
              const categoryMap: Record<string, string> = {
                '教程': locale === 'zh' ? '教程' : 'Tutorial',
                '对比': locale === 'zh' ? '对比' : 'Comparison',
                '技巧': locale === 'zh' ? '技巧' : 'Tips',
              };
              const category = tData?.category || categoryMap[post.category] || post.category;
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.date}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime} {t('readTime')}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tData?.title || post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tData?.excerpt || post.excerpt}
                  </p>
                </Link>
              );
            })}
          </div>

          <AdSlot slotId="blog-list-middle" />
          <AdSlot slotId="blog-list-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="blog-list-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
