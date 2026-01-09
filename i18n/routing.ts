import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['zh', 'en', 'ja'],

  // 默认语言：让next-intl根据浏览器语言自动检测
  // 如果检测失败，则使用英文作为fallback
  defaultLocale: 'en',

  // URL 前缀策略
  localePrefix: 'always', // 所有语言都显示前缀
});

// 创建导航工具
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
