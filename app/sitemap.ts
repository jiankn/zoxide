import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/blog';
import { getAllTutorials } from '@/data/tutorials';
import { routing } from '@/i18n/routing';
import { comparisonSlugs } from '@/data/comparison-guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zoxide.org';
  // Keep lastmod tied to a real content release instead of changing it on every build.
  const staticContentLastModified = '2026-08-07';
  const priorityContentLastModified = '2026-08-09';
  const updatedEnglishBlogSlugs = new Set([
    'mastering-terminal-navigation-zoxide-guide',
    'zoxide-init-guide',
    'zoxide-commands',
    'zoxide-fzf-interactive-guide-en',
  ]);
  const currentDate = staticContentLastModified;
  const locales = routing.locales; // ['zh', 'en']

  // 生成多语言静态页面
  const staticPages: MetadataRoute.Sitemap = [];

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/features', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tutorials', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/download', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tools/zoxide-doctor', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/changelog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/comparisons', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms-of-service', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  // 为每个语言生成静态页面
  // 注意：routing.localePrefix 设置为 'as-needed'，默认语言（英文）不带前缀
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      // 确保 URL 格式一致：所有路径都必须以斜杠结尾
      // next.config.ts 中配置了 trailingSlash: true
      // 默认语言（en）不带语言前缀，其他语言带前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = route.path === ''
        ? (isDefaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}/`)
        : (isDefaultLocale ? `${baseUrl}${route.path}/` : `${baseUrl}/${locale}${route.path}/`);

      staticPages.push({
        url,
        lastModified: isDefaultLocale && route.path === '/download'
          ? priorityContentLastModified
          : currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  const blogPosts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = [];
  blogPosts.forEach((post) => {
    locales.forEach((locale) => {
      // 如果文章有限定语言，只生成对应语言的页面
      if (post.locales && !post.locales.includes(locale as 'zh' | 'en' | 'ja')) {
        return;
      }

      // 默认语言（en）不带语言前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = isDefaultLocale
        ? `${baseUrl}/blog/${post.slug}/`
        : `${baseUrl}/${locale}/blog/${post.slug}/`;

      blogPages.push({
        url,
        lastModified: isDefaultLocale && updatedEnglishBlogSlugs.has(post.slug)
          ? priorityContentLastModified
          : post.date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  // 教程页面（多语言）
  const tutorials = getAllTutorials();
  const tutorialPages: MetadataRoute.Sitemap = [];
  tutorials.forEach((tutorial) => {
    locales.forEach((locale) => {
      // 默认语言（en）不带语言前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = isDefaultLocale
        ? `${baseUrl}/tutorials/${tutorial.slug}/`
        : `${baseUrl}/${locale}/tutorials/${tutorial.slug}/`;

      tutorialPages.push({
        url,
        lastModified: tutorial.date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  const comparisonPages: MetadataRoute.Sitemap = [];
  comparisonSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      const isDefaultLocale = locale === routing.defaultLocale;
      comparisonPages.push({
        url: isDefaultLocale
          ? `${baseUrl}/comparisons/${slug}/`
          : `${baseUrl}/${locale}/comparisons/${slug}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      });
    });
  });

  return [...staticPages, ...blogPages, ...tutorialPages, ...comparisonPages];
}

