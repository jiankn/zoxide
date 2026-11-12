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
          '/_next/static/',
          '/_next/image',
        ],
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
      // 拦截已知的 AI 爬虫和高频采集工具（减少服务器负载）
      {
        userAgent: [
          'Bytespider', // 字节跳动爬虫
          'GPTBot',     // OpenAI 爬虫
          'ClaudeBot',  // Anthropic 爬虫
          'MJ12bot',    // 即使是 SEO 爬虫，如果过于频繁也先拦截
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
        ],
        disallow: ['/'],
      },
      // 为 Googlebot 添加明确的允许规则（确保字体文件可访问）
      {
        userAgent: 'Googlebot',
        allow: [
          '/_next/static/',
          '/_next/image',
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

