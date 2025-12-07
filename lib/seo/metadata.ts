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
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 生成当前页面的完整 URL（canonical）
  const canonicalUrl = `${baseUrl}/${locale}${normalizedPath}`;
  
  // 生成所有语言版本的 URL（用于 hreflang）
  const languages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${baseUrl}/${loc}${normalizedPath}`;
  });
  
  return {
    ...additionalMetadata,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

