import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['zh', 'en'],

  // 默认语言：根据浏览器语言判断，中文显示中文，其他都显示英文
  defaultLocale: 'en',

  // URL 前缀策略
  localePrefix: 'always', // 所有语言都显示前缀
});

// 创建导航工具
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
