'use client';

import { Link } from '@/i18n/routing';
import { BlogPost } from '@/data/blog';
import { useTranslations, useLocale } from 'next-intl';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const t = useTranslations('blog.detail');
  const tBlog = useTranslations('blog');
  const locale = useLocale();

  const categoryMap: Record<string, string> = {
    '教程': locale === 'zh' ? '教程' : 'Tutorial',
    '对比': locale === 'zh' ? '对比' : 'Comparison',
    '技巧': locale === 'zh' ? '技巧' : 'Tips',
  };

  const translatedPosts = posts.map((post) => {
    let translation: { title?: string; excerpt?: string; category?: string } | undefined;
    try {
      translation = tBlog.raw(`data.${post.slug}`) as typeof translation;
    } catch {
      translation = undefined;
    }

    return {
      ...post,
      title: translation?.title || post.title,
      excerpt: translation?.excerpt || post.excerpt,
      category: translation?.category || categoryMap[post.category] || post.category,
    };
  });

  if (translatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('relatedPosts')}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {translatedPosts.map((post) => (
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
                {post.readTime} {tBlog('readTime')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

