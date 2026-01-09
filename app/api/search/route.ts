import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/data/blog';
import { getAllTutorials } from '@/data/tutorials';
import { routing } from '@/i18n/routing';

export interface SearchResult {
  type: 'blog' | 'tutorial' | 'page';
  title: string;
  description: string;
  url: string;
  locale: string; // 语言标识
  matchScore?: number; // 匹配分数（可选）
}

type BlogTranslation = Record<string, { title?: string; excerpt?: string }>;
type TutorialTranslation = Record<string, { title?: string; excerpt?: string }>;

type PageSection = {
  title?: string;
  description?: string;
};

type LocaleMessages = {
  blog?: {
    data?: BlogTranslation;
  };
  tutorials?: {
    data?: TutorialTranslation;
  };
  common?: Record<string, string>;
  features?: PageSection;
  download?: PageSection;
  faq?: PageSection;
  changelog?: PageSection;
  comparisons?: PageSection;
  about?: PageSection;
};

// 获取单个语言的可搜索内容
async function getSearchDataForLocale(locale: string): Promise<SearchResult[]> {
  // 直接导入 messages 文件（API 路由不在 next-intl 上下文中）
  const messages = (await import(`@/messages/${locale}.json`)).default as LocaleMessages;
  const results: SearchResult[] = [];

  // 博客文章 - 从数据文件动态获取
  const posts = getAllPosts();
  for (const post of posts) {
    if (post.locales && !post.locales.includes(locale as 'zh' | 'en' | 'ja')) {
      continue;
    }
    const tData = messages.blog?.data?.[post.slug];
    results.push({
      type: 'blog',
      title: tData?.title || post.title,
      description: tData?.excerpt || post.excerpt,
      url: `/${locale}/blog/${post.slug}`,
      locale: locale,
    });
  }

  // 教程 - 从数据文件动态获取
  const tutorials = getAllTutorials();
  for (const tutorial of tutorials) {
    const tData = messages.tutorials?.data?.[tutorial.slug];
    results.push({
      type: 'tutorial',
      title: tData?.title || tutorial.title,
      description: tData?.excerpt || tutorial.excerpt,
      url: `/${locale}/tutorials/${tutorial.slug}`,
      locale: locale,
    });
  }

  // 静态页面 - 从翻译文件获取
  const common = messages.common || {};
  const pages = [
    {
      type: 'page' as const,
      titleKey: 'features',
      descriptionKey: 'features',
      url: `/${locale}/features`,
    },
    {
      type: 'page' as const,
      titleKey: 'download',
      descriptionKey: 'download',
      url: `/${locale}/download`,
    },
    {
      type: 'page' as const,
      titleKey: 'faq',
      descriptionKey: 'faq',
      url: `/${locale}/faq`,
    },
    {
      type: 'page' as const,
      titleKey: 'changelog',
      descriptionKey: 'changelog',
      url: `/${locale}/changelog`,
    },
    {
      type: 'page' as const,
      titleKey: 'comparisons',
      descriptionKey: 'comparisons',
      url: `/${locale}/comparisons`,
    },
    {
      type: 'page' as const,
      titleKey: 'about',
      descriptionKey: 'about',
      url: `/${locale}/about`,
    },
  ];

  for (const page of pages) {
    const pageMessages = messages[page.titleKey as keyof LocaleMessages] as PageSection | undefined;
    results.push({
      type: page.type,
      title: pageMessages?.title || common[page.titleKey] || page.titleKey,
      description: pageMessages?.description || common[page.descriptionKey] || '',
      url: page.url,
      locale: locale,
    });
  }

  return results;
}

// 获取所有语言的可搜索内容（跨语言搜索）
async function getAllSearchData(): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];

  // 遍历所有支持的语言
  for (const locale of routing.locales) {
    const localeResults = await getSearchDataForLocale(locale);
    allResults.push(...localeResults);
  }

  return allResults;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || routing.defaultLocale;
    const allLocales = searchParams.get('allLocales') === 'true'; // 是否跨语言搜索

    // 验证 locale
    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      );
    }

    // 根据参数决定是否跨语言搜索
    const searchData = allLocales
      ? await getAllSearchData()
      : await getSearchDataForLocale(locale);

    return NextResponse.json({ data: searchData });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

