import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({});

// next-intl 依赖的 @swc/core 使用 native binding（.node 文件），
// 无法被 esbuild 打包到 Workers runtime。将其添加到 edgeExternals 以排除。
config.edgeExternals = [
    ...(config.edgeExternals || []),
    "@swc/core",
    "@swc/wasm",
    "@swc/core-win32-x64-msvc",
];

export default config;
