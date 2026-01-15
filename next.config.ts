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
  // 图片优化配置
  images: {
    // 启用 AVIF 格式（比 WebP 更小 20-30%）
    formats: ['image/avif', 'image/webp'],
  },
  // Ezoic ads.txt 自动管理（重定向到 Ezoic 的 ads.txt 管理服务）
  // 使用 redirects() 返回 302（临时）以便 Ezoic 验证；验证通过后可改为 permanent: true（301）
  async redirects() {
    // 当前为了临时使用 public/ads.txt 做验证，暂时禁用 /ads.txt 的重定向。
    // 验证通过后会恢复重定向。
    return [];
  },
};

export default withNextIntl(nextConfig);
