import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

const config = defineCloudflareConfig({
    // SSG 站点使用 Static Assets 缓存 — 最快的选项
    // 预渲染的页面直接从 Workers Static Assets 提供，无需 SSR
    incrementalCache: staticAssetsIncrementalCache,
    // 启用缓存拦截，避免加载 NextServer JS，改善冷启动性能
    enableCacheInterception: true,
});

// next-intl 依赖的 @swc/core 使用 native binding（.node 文件），
// 无法被 esbuild 打包到 Workers runtime。将其添加到 edgeExternals 以排除。
config.edgeExternals = [
    ...(config.edgeExternals || []),
    "@swc/core",
    "@swc/wasm",
    "@swc/core-win32-x64-msvc",
];

export default config;
