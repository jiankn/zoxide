import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/blog';
import { getAllTutorials } from '@/data/tutorials';
import { routing } from '@/i18n/routing';
import { comparisonSlugs } from '@/data/comparison-guides';
import { isRedirectedContentPath } from '@/data/search-intents';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zoxide.org';
  // Keep lastmod tied to a real content release instead of changing it on every build.
  const staticContentLastModified = '2026-08-07';
  const priorityContentLastModified = '2026-08-09';
  const downloadContentLastModified = '2026-08-14';
  const intentArchitectureLastModified = '2026-08-15';
  // 2026-09-30：非官方身份说明（首页、About）与 Windows 实测教程（全部语言）
  const unofficialGuideLastModified = '2026-09-30';
  const unofficialGuidePaths = new Set(['', '/about']);
  const retestedTutorialSlugs = new Set(['install-windows', 'install-macos']);
  // 2026-10-08：修正虚构内容、补充 Linux 发行版与下载页版本历史（按 语言:路径 记录实际改动的页面）
  const correctionLastModified = '2026-10-08';
  const correctedPaths = new Set([
    // 2026-10-08：命令参考与初始化指南完成三语实测重写；中日路径已列在下方。
    'en:/blog/zoxide-commands', 'en:/blog/zoxide-init-guide',
    // 2026-10-08：定义页合并工作原理，正文来自同一次 Ubuntu 交互测试。
    'en:/blog/what-is-zoxide-smarter-cd',
    'zh:/blog/zoxide-shi-shenme-z-mingling-tidai-cd',
    'ja:/blog/zoxide-toha-cd-no-kawari',
    'en:/download', 'zh:/download', 'ja:/download',
    'en:/tutorials/install-arch-nixos', 'zh:/tutorials/install-arch-nixos', 'ja:/tutorials/install-arch-nixos',
    'en:/tutorials/advanced-config', 'zh:/tutorials/advanced-config', 'ja:/tutorials/advanced-config',
    'en:/blog/zoxide-alias-autocomplete', 'zh:/blog/zoxide-alias-autocomplete', 'ja:/blog/zoxide-alias-autocomplete',
    'zh:/blog/zoxide-commands', 'ja:/blog/zoxide-commands', 'ja:/blog/zoxide-init-guide',
    'en:', 'zh:', 'ja:', 'en:/tutorials',
    'zh:/tutorials/troubleshooting', 'ja:/tutorials/troubleshooting',
    'en:/tutorials/quick-start',
    'zh:/blog/zoxide-init-guide', 'ja:/blog/zoxide-init-guide',
    'en:/tools/zoxide-doctor', 'zh:/tools/zoxide-doctor', 'ja:/tools/zoxide-doctor',
    'en:/tutorials/install-ubuntu', 'zh:/tutorials/install-ubuntu', 'ja:/tutorials/install-ubuntu',
    'en:/tutorials/fzf-integration', 'zh:/tutorials/fzf-integration', 'ja:/tutorials/fzf-integration',
    'en:/blog/zoxide-command-not-found', 'zh:/blog/zoxide-command-not-found', 'ja:/blog/zoxide-command-not-found', 'en:/blog/troubleshooting-zoxide-no-match-found', 'zh:/blog/troubleshooting-zoxide-no-match-found', 'ja:/blog/troubleshooting-zoxide-no-match-found', 'en:/blog/zoxide-not-working', 'zh:/blog/zoxide-not-working', 'ja:/blog/zoxide-not-working', 'en:/blog/zoxide-alias-autocomplete', 'zh:/blog/zoxide-alias-autocomplete', 'ja:/blog/zoxide-alias-autocomplete', 'zh:/blog/zoxide-commands', 'ja:/blog/zoxide-commands',
  ]);
  const updatedIntentHubs = new Set(['/blog', '/tutorials', '/comparisons']);
  const updatedEnglishTutorialSlugs = new Set([
    'quick-start',
    'basic-commands',
    'fzf-integration',
  ]);
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
      // 已合并到其他页面的静态页（features、changelog、comparisons）不进入 sitemap
      if (route.path && isRedirectedContentPath(locale, route.path)) return;
      // 确保 URL 格式一致：所有路径都必须以斜杠结尾
      // next.config.ts 中配置了 trailingSlash: true
      // 默认语言（en）不带语言前缀，其他语言带前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = route.path === ''
        ? (isDefaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}/`)
        : (isDefaultLocale ? `${baseUrl}${route.path}/` : `${baseUrl}/${locale}${route.path}/`);

      staticPages.push({
        url,
        lastModified: correctedPaths.has(`${locale}:${route.path}`)
          ? correctionLastModified
          : unofficialGuidePaths.has(route.path)
          ? unofficialGuideLastModified
          : updatedIntentHubs.has(route.path)
          ? intentArchitectureLastModified
          : route.path === '/download'
          ? downloadContentLastModified
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
      if (isRedirectedContentPath(locale, `/blog/${post.slug}`)) return;

      // 默认语言（en）不带语言前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = isDefaultLocale
        ? `${baseUrl}/blog/${post.slug}/`
        : `${baseUrl}/${locale}/blog/${post.slug}/`;

      blogPages.push({
        url,
        lastModified: correctedPaths.has(`${locale}:/blog/${post.slug}`)
          ? correctionLastModified
          : isDefaultLocale && updatedEnglishBlogSlugs.has(post.slug)
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
      if (isRedirectedContentPath(locale, `/tutorials/${tutorial.slug}`)) return;

      // 默认语言（en）不带语言前缀
      const isDefaultLocale = locale === routing.defaultLocale;
      const url = isDefaultLocale
        ? `${baseUrl}/tutorials/${tutorial.slug}/`
        : `${baseUrl}/${locale}/tutorials/${tutorial.slug}/`;

      tutorialPages.push({
        url,
        lastModified: correctedPaths.has(`${locale}:/tutorials/${tutorial.slug}`)
          ? correctionLastModified
          : retestedTutorialSlugs.has(tutorial.slug)
          ? unofficialGuideLastModified
          : isDefaultLocale && updatedEnglishTutorialSlugs.has(tutorial.slug)
          ? intentArchitectureLastModified
          : tutorial.date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  const comparisonPages: MetadataRoute.Sitemap = [];
  comparisonSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      if (isRedirectedContentPath(locale, `/comparisons/${slug}`)) return;

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

