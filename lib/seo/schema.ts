// Schema.org 结构化数据工具函数

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    email: string;
    contactType: string;
    availableLanguage: string[];
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  dateModified?: string;
  publisher: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': string;
    '@id': string;
  };
}

export interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export interface HowToSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  step: Array<{
    '@type': string;
    name: string;
    text: string;
  }>;
}

// 生成组织架构数据
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'zoxide.org',
    url: 'https://zoxide.org',
    logo: 'https://zoxide.org/icon.svg',
    description: 'Independent community documentation and tutorials for zoxide, the smarter cd command written in Rust. This website is not the official zoxide project.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@zoxide.org',
      contactType: 'customer support',
      availableLanguage: ['English', 'Chinese', 'Japanese'],
    },
  };
}

// 生成网站结构化数据
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'zoxide.org',
    url: 'https://zoxide.org',
    description: 'Independent community documentation, tutorials, and resources for zoxide — a smarter cd command written in Rust.',
    inLanguage: ['en', 'zh', 'ja'],
  };
}

// 生成文章结构化数据
export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  url: string,
  dateModified?: string
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'zoxide.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zoxide.org/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// 生成 FAQ 页面结构化数据
export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// 生成 HowTo 结构化数据
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>
): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };
}
