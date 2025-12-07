import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://zoxide.org';

  return {
    rules: [
      {
        userAgent: '*',
        // 允许所有路径，包括 _next/static/ 下的资源文件
        // Googlebot 需要这些 JS/CSS 文件来正确渲染页面
        allow: '/',
        // 只禁止 API 路由，允许 _next/static/ 下的静态资源
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

