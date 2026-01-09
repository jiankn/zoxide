import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  // Vercel 会在 x-forwarded-proto header 中提供协议信息
  const protocol = request.headers.get('x-forwarded-proto') || (url.protocol === 'https:' ? 'https' : 'http');
  const pathname = url.pathname;

  // 1. HTTP 到 HTTPS 重定向（301 永久重定向）
  // 注意：Vercel 通常会自动处理，但这里作为备用
  if (protocol !== 'https' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, { status: 301 });
  }

  // 2. www 到非 www 重定向（301 永久重定向）
  // 统一使用非 www 版本：zoxide.org（而不是 www.zoxide.org）
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace(/^www\./, '');
    return NextResponse.redirect(url, { status: 301 });
  }



  // 3. 阻止代码示例中的路径被访问（返回 404）
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
  // 创建 next-intl 中间件实例，启用语言检测
  const intlMiddleware = createMiddleware({
    ...routing,
    localeDetection: true,
    localePrefix: 'always',
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
