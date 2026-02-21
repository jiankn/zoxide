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
  // Cloudflare Workers 不支持 native Node.js 二进制文件（.node）
  // next-intl 依赖的 @swc/core 使用了 native binding，需要排除
  serverExternalPackages: ['@swc/core', '@swc/wasm'],
  outputFileTracingExcludes: {
    '*': ['@swc/core*', '@swc/wasm*', '@swc/core-win32-x64-msvc*', '@parcel/watcher*'],
  },
  // 图片优化配置 - Cloudflare Pages 不支持 Vercel 的图片优化 API
  // Hero 图片已是 WebP 格式，Logo 是 SVG，禁用优化影响极小
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
