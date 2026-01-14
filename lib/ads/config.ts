// 广告位配置
export const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

// 广告提供商类型
export type AdProvider = 'ezoic' | 'adsense' | 'none';

// 当前广告提供商（从环境变量读取）
export const AD_PROVIDER: AdProvider =
  (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'none';

// Ezoic 站点 ID
export const EZOIC_SITE_ID = process.env.NEXT_PUBLIC_EZOIC_SITE_ID || '';

// 广告位尺寸配置
export interface AdConfig {
  desktop: {
    width: number;
    height: number;
  };
  mobile: {
    width: number;
    height: number;
  };
  slotId: string;
  placeholderKey?: string; // 占位符提示文本的翻译键
  ezoicPlaceholderId?: number; // Ezoic 广告位 ID
}

// 所有广告位配置
export const AD_CONFIGS: Record<string, AdConfig> = {
  // 首页广告位
  'home-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'home-top',
    placeholderKey: 'ads.home.top',
    ezoicPlaceholderId: 109, // under_first_paragraph
  },
  'home-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'home-middle',
    placeholderKey: 'ads.home.middle',
  },
  'home-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'home-sidebar',
    placeholderKey: 'ads.home.sidebar',
    ezoicPlaceholderId: 107, // sidebar_floating_1
  },
  'home-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'home-bottom',
    placeholderKey: 'ads.home.bottom',
  },
  // Features 页面广告位
  'features-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'features-top',
    placeholderKey: 'ads.features.top',
  },
  'features-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'features-sidebar',
    placeholderKey: 'ads.features.sidebar',
  },
  'features-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'features-middle',
    placeholderKey: 'ads.features.middle',
  },
  'features-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'features-bottom',
    placeholderKey: 'ads.features.bottom',
  },
  // Tutorials 页面广告位
  'tutorials-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'tutorials-top',
    placeholderKey: 'ads.tutorials.top',
  },
  'tutorials-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'tutorials-sidebar',
    placeholderKey: 'ads.tutorials.sidebar',
    ezoicPlaceholderId: 108, // sidebar_floating_2
  },
  'tutorials-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'tutorials-middle',
    placeholderKey: 'ads.tutorials.middle',
  },
  'tutorials-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'tutorials-bottom',
    placeholderKey: 'ads.tutorials.bottom',
  },
  // Download 页面广告位
  'download-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'download-top',
    placeholderKey: 'ads.download.top',
  },
  'download-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'download-sidebar',
    placeholderKey: 'ads.download.sidebar',
  },
  'download-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'download-middle',
    placeholderKey: 'ads.download.middle',
  },
  'download-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'download-bottom',
    placeholderKey: 'ads.download.bottom',
  },
  // Blog 列表页广告位
  'blog-list-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'blog-list-top',
    placeholderKey: 'ads.blog.list.top',
  },
  'blog-list-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'blog-list-sidebar',
    placeholderKey: 'ads.blog.list.sidebar',
    ezoicPlaceholderId: 106, // sidebar_bottom
  },
  'blog-list-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'blog-list-middle',
    placeholderKey: 'ads.blog.list.middle',
  },
  'blog-list-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'blog-list-bottom',
    placeholderKey: 'ads.blog.list.bottom',
  },
  // Blog 文章详情页广告位
  'article-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'article-top',
    placeholderKey: 'ads.article.top',
    ezoicPlaceholderId: 110, // under_second_paragraph
  },
  'article-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'article-sidebar',
    placeholderKey: 'ads.article.sidebar',
  },
  'in-article': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'in-article',
    placeholderKey: 'ads.article.inArticle',
    ezoicPlaceholderId: 111, // mid_content
  },
  'article-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'article-bottom',
    placeholderKey: 'ads.article.bottom',
  },
  // Changelog 页面广告位
  'changelog-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'changelog-top',
    placeholderKey: 'ads.changelog.top',
  },
  'changelog-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'changelog-sidebar',
    placeholderKey: 'ads.changelog.sidebar',
  },
  'changelog-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'changelog-middle',
    placeholderKey: 'ads.changelog.middle',
  },
  'changelog-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'changelog-bottom',
    placeholderKey: 'ads.changelog.bottom',
  },
  // FAQ 页面广告位
  'faq-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'faq-top',
    placeholderKey: 'ads.faq.top',
  },
  'faq-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'faq-sidebar',
    placeholderKey: 'ads.faq.sidebar',
  },
  'faq-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'faq-middle',
    placeholderKey: 'ads.faq.middle',
  },
  'faq-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'faq-bottom',
    placeholderKey: 'ads.faq.bottom',
  },
  // Comparisons 页面广告位
  'comparisons-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'comparisons-top',
    placeholderKey: 'ads.comparisons.top',
  },
  'comparisons-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'comparisons-sidebar',
    placeholderKey: 'ads.comparisons.sidebar',
  },
  'comparisons-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'comparisons-middle',
    placeholderKey: 'ads.comparisons.middle',
  },
  'comparisons-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'comparisons-bottom',
    placeholderKey: 'ads.comparisons.bottom',
  },
  // About 页面广告位
  'about-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'about-top',
    placeholderKey: 'ads.about.top',
  },
  'about-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'about-sidebar',
    placeholderKey: 'ads.about.sidebar',
  },
  'about-middle': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
    slotId: 'about-middle',
    placeholderKey: 'ads.about.middle',
  },
  'about-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'about-bottom',
    placeholderKey: 'ads.about.bottom',
  },
  // Privacy Policy 页面广告位
  'privacy-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'privacy-top',
    placeholderKey: 'ads.privacy.top',
  },
  'privacy-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'privacy-sidebar',
    placeholderKey: 'ads.privacy.sidebar',
  },
  'privacy-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'privacy-bottom',
    placeholderKey: 'ads.privacy.bottom',
  },
  // Terms of Service 页面广告位
  'terms-top': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
    slotId: 'terms-top',
    placeholderKey: 'ads.terms.top',
  },
  'terms-sidebar': {
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 600 },
    slotId: 'terms-sidebar',
    placeholderKey: 'ads.terms.sidebar',
  },
  'terms-bottom': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 300, height: 250 },
    slotId: 'terms-bottom',
    placeholderKey: 'ads.terms.bottom',
  },
};

// 获取广告位配置
export function getAdConfig(slotId: string): AdConfig | undefined {
  return AD_CONFIGS[slotId];
}
