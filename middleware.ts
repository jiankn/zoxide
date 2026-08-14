import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 0. HTTP→HTTPS 保底重定向（301 永久重定向）
  // 主要由 Cloudflare 的 "Always Use HTTPS" 处理，此处作为安全保底
  // 防止 HTTP 版本被搜索引擎索引，避免重复内容问题
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  // 注意：www→非www 重定向由 Cloudflare 自动处理，无需在此实现

  // 1. 阻止代码示例中的路径被访问（返回 404）
  // 这些路径通常出现在代码示例中，不应该被当作真实 URL
  // 匹配模式：
  // - /home/user/... (代码示例中的用户目录)
  // - /tmp:/var:... (环境变量示例)
  // - /persist (NixOS 配置示例)
  // - /shared/path/... (共享路径示例)
  // - /node_modules (依赖目录示例)
  // - /.git (Git 目录示例)
  const codeExamplePatterns = [
    /^\/home\//,           // /home/user/...
    /^\/tmp:/,             // /tmp:/var:...
    /^\/var:/,             // /var:/...
    /^\/persist(\/|$)/,    // /persist 或 /persist/...
    /^\/shared\//,         // /shared/...
    /^\/node_modules(\/|$)/, // /node_modules 或 /node_modules/...
    /^\/\.git(\/|$)/,      // /.git 或 /.git/...
  ];

  // 检查路径是否匹配代码示例模式
  const isCodeExamplePath = codeExamplePatterns.some(pattern => pattern.test(pathname));

  if (isCodeExamplePath) {
    // 返回 404 响应
    return new NextResponse(null, { status: 404 });
  }

  // 4. 处理国际化路由（next-intl）
  // 创建 next-intl 中间件实例
  // localeDetection: false - 禁用自动语言检测，让用户手动选择语言
  // next-intl 会自动使用 NEXT_LOCALE Cookie 记住用户的语言偏好
  const intlMiddleware = createMiddleware({
    ...routing,
    localeDetection: false,
    // Page metadata owns hreflang so redirect responses never advertise
    // alternate URLs that themselves redirect in another locale.
    alternateLinks: false,
  });

  // 执行 next-intl 中间件（这会处理语言检测和根路径重定向）
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了：
  // - API 路由
  // - _next 静态文件
  // - 图片文件
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
