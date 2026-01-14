import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // 开启末尾斜杠规范化（默认 false），这会自动处理所有页面的斜杠重定向
  // 例如：/en -> /en/，确保与 canonical URL 一致
  trailingSlash: true,
  // 禁用生产环境的 source map
  productionBrowserSourceMaps: false,
  // Turbopack 配置（Next.js 16 默认使用）
  turbopack: {
    // 如果需要禁用开发环境的 source map，可以在这里配置
    // 但通常不需要，因为 Turbopack 会自动处理
  },
  // Ezoic ads.txt 自动管理
  // 重定向 /ads.txt 到 Ezoic 的 ads.txt 管理服务
  async rewrites() {
    return [
      {
        source: '/ads.txt',
        destination: 'https://srv.adstxtmanager.com/19390/zoxide.org',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
