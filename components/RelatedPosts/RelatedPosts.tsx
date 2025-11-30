'use client';

import { Link } from '@/i18n/routing';
import { BlogPost } from '@/data/blog';
import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const t = useTranslations('blog.detail');
  const tBlog = useTranslations('blog');
  const locale = useLocale();
  
  if (posts.length === 0) {
    return null;
  }

  // 获取翻译后的文章数据
  const translatedPosts = useMemo(() => {
    // 翻译分类映射
    const categoryMap: Record<string, string> = {
      '教程': locale === 'zh' ? '教程' : 'Tutorial',
      '对比': locale === 'zh' ? '对比' : 'Comparison',
      '技巧': locale === 'zh' ? '技巧' : 'Tips',
    };

    return posts.map((post) => {
      let tData: any = undefined;
      try {
        tData = tBlog.raw(`data.${post.slug}`);
      } catch {
        // 翻译不存在时使用默认值
      }
      return {
        ...post,
        title: tData?.title || post.title,
        excerpt: tData?.excerpt || post.excerpt,
        category: tData?.category || categoryMap[post.category] || post.category,
      };
    });
  }, [posts, tBlog, locale]);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('relatedPosts')}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {translatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {post.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.readTime} {tBlog('readTime')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

