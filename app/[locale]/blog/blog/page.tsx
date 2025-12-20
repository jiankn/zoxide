import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';
import { getAllPosts } from '@/data/blog';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const tBlog = await getTranslations('blog');
  const locale = await getLocale();
  return generateMultilingualMetadata(
    locale,
    '/blog',
    {
      title: t('titles.blog'),
      description: tBlog('description'),
      keywords: t('blog'),
    }
  );
}

export default async function BlogPage() {
  const blogPosts = getAllPosts();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              zoxide 博客
            </h1>
            <p className="text-lg text-gray-600">
              阅读 zoxide 相关文章：使用教程、配置技巧、性能优化、版本更新等。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="blog-list-top" />

          {/* 文章列表 */}
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.date}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.readTime} 分钟阅读
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          {/* 广告位 3: 文章列表中间位置 */}
          <AdSlot slotId="blog-list-middle" />

          {/* 广告位 4: 文章列表底部 */}
          <AdSlot slotId="blog-list-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="blog-list-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

