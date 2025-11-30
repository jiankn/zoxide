import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  // 启用语言检测：根据浏览器 Accept-Language header 自动检测
  // 中文浏览器（zh, zh-CN, zh-TW 等）会匹配到 'zh'
  // 其他浏览器会使用默认语言 'en'
  localeDetection: true,
  // URL 前缀策略：所有语言都显示前缀（/zh 或 /en）
  localePrefix: 'always',
});

export const config = {
  // 匹配所有路径，除了：
  // - API 路由
  // - _next 静态文件
  // - 图片文件
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
