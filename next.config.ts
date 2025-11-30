import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // 禁用生产环境的 source map
  productionBrowserSourceMaps: false,
  // Turbopack 配置（Next.js 16 默认使用）
  turbopack: {
    // 如果需要禁用开发环境的 source map，可以在这里配置
    // 但通常不需要，因为 Turbopack 会自动处理
  },
};

export default withNextIntl(nextConfig);
