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
    [key: string]: any;
  }
): Metadata {
  // 处理路径：首页为空字符串，其他页面以 / 开头
  // 如果 path 是空字符串，normalizedPath 也应该是空字符串
  // 如果 path 不是空字符串且不以 / 开头，则添加 /
  const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);
  
  // 生成 canonical URL：所有语言版本都指向默认语言版本（主语言版本）
  // 这是 Google 推荐的多语言网站最佳实践，可以避免重复内容问题
  // 首页：https://zoxide.org/en/
  // 其他页面：https://zoxide.org/en/blog/xxx
  const defaultLocale = routing.defaultLocale;
  const canonicalUrl = normalizedPath === '' 
    ? `${baseUrl}/${defaultLocale}/`
    : `${baseUrl}/${defaultLocale}${normalizedPath}`;
  
  // 生成所有语言版本的 URL（用于 hreflang）
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = normalizedPath === ''
      ? `${baseUrl}/${loc}/`
      : `${baseUrl}/${loc}${normalizedPath}`;
  });
  
  return {
    ...additionalMetadata,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

