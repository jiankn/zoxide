import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://zoxide.org';

  return {
    rules: [
      {
        userAgent: '*',
        // 明确允许 Next.js 静态资源（字体、JS、CSS 等）
        // Googlebot 需要这些资源来正确渲染页面
        // 注意：在 robots.txt 中，allow 规则会优先于 disallow 规则
        allow: [
          '/_next/static/',  // 允许所有 _next/static/ 下的资源（包括字体文件）
          '/_next/image',     // 允许 Next.js 图片优化
          '/',                // 允许所有其他路径
        ],
        // 禁止 API 路由和代码示例中常见的路径模式
        // 这些规则不会影响 _next/static/ 路径，因为 allow 规则优先
        disallow: [
          '/api/',
          // 排除代码示例中的路径模式（防止 Google 误抓取）
          '/home/',
          '/tmp:',
          '/var:',
          '/persist',
          '/shared/',
          '/node_modules',
          '/.git',
          '/favicon.ico', // 禁止抓取 favicon，避免出现在"已抓取 - 尚未编入索引"报告中
        ],
      },
      // 为 Googlebot 添加明确的允许规则（确保字体文件可访问）
      {
        userAgent: 'Googlebot',
        allow: [
          '/_next/static/',
          '/_next/image',
          '/',
        ],
        disallow: [
          '/api/',
          '/home/',
          '/tmp:',
          '/var:',
          '/persist',
          '/shared/',
          '/node_modules',
          '/.git',
          '/favicon.ico', // 禁止抓取 favicon，避免出现在"已抓取 - 尚未编入索引"报告中
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

