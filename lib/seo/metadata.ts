import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://zoxide.org';

/**
 * 生成多语言页面的 SEO 元数据
 * 包括 canonical URL 和 hreflang 标签
 * 
 * @param locale - 当前语言代码
 * @param path - 页面路径（不包含语言前缀，例如：'/blog/zoxide-commands'）
 * @param additionalMetadata - 额外的元数据（title, description 等）
 * @returns 完整的 Metadata 对象
 */
export function generateMultilingualMetadata(
  locale: string,
  path: string,
  additionalMetadata?: {
    title?: string;
    description?: string;
    keywords?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
): Metadata {
  // 验证 locale 是否有效
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    // 如果 locale 无效，使用默认语言
    locale = routing.defaultLocale;
  }

  // 处理路径：首页为空字符串，其他页面以 / 开头
  // 如果 path 是空字符串，normalizedPath 也应该是空字符串
  // 如果 path 不是空字符串且不以 / 开头，则添加 /
  const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);

  // 生成 canonical：指向当前语言版本，确保每个页面的 canonical 指向自己
  // 这是 SEO 最佳实践：每个页面的 canonical URL 应该指向自己，而不是其他语言版本
  // 注意：next.config.ts 中启用了 trailingSlash: true，所以这里必须添加末尾斜杠
  // 对于默认语言（英文），不添加语言前缀
  const canonicalUrl = normalizedPath === ''
    ? (locale === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}/`)
    : (locale === routing.defaultLocale ? `${baseUrl}${normalizedPath}/` : `${baseUrl}/${locale}${normalizedPath}/`);

  // 生成所有语言版本的 URL（用于 hreflang）
  // 重要：每个页面必须在 hreflang 中包含自己（自引用），这是 Google 推荐的最佳实践
  const languages: Record<string, string> = {};

  // 首先添加所有语言版本
  routing.locales.forEach((loc) => {
    // 确保每个语言版本都有对应的 hreflang URL
    // 对于默认语言，不添加语言前缀
    languages[loc] = normalizedPath === ''
      ? (loc === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${loc}/`)
      : (loc === routing.defaultLocale ? `${baseUrl}${normalizedPath}/` : `${baseUrl}/${loc}${normalizedPath}/`);
  });

  // 确保当前语言版本在 hreflang 中（自引用），并且指向 canonical URL
  // 这确保 Google 知道当前页面就是规范页面
  languages[locale] = canonicalUrl;

  // 添加 x-default，指向默认语言版本（不带前缀）
  languages['x-default'] = normalizedPath === ''
    ? `${baseUrl}/`
    : `${baseUrl}${normalizedPath}/`;

  // 确保 additionalMetadata 中的 alternates 不会覆盖我们的设置
  // 根据 Chrome 开发者文档：使用 hreflang 时，canonical 必须指向该语言版本的自己
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { alternates, ...restMetadata } = additionalMetadata || {};
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return {
    ...restMetadata,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

