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
  
  // 生成 canonical：指向当前语言版本，避免各语言都指向同一个 canonical 造成提示
  const canonicalUrl = normalizedPath === ''
    ? `${baseUrl}/${locale}/`
    : `${baseUrl}/${locale}${normalizedPath}`;
  
  // 生成所有语言版本的 URL（用于 hreflang）
  const languages: Record<string, string> = {
    'x-default': normalizedPath === ''
      ? `${baseUrl}/${routing.defaultLocale}/`
      : `${baseUrl}/${routing.defaultLocale}${normalizedPath}`,
  };

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

