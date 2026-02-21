/**
 * Post-install: 将 @vercel/og 的 wasm 文件替换为最小有效 wasm 模块
 *
 * 问题：Wrangler 在 Windows 上无法处理 .wasm?module 路径。
 * Next.js 内置了 @vercel/og（包含 resvg.wasm 和 yoga.wasm），
 * 即使项目没有使用 OG 图片生成，Wrangler 也会尝试打包这些文件。
 *
 * 修复：用最小有效 WebAssembly 模块（8 字节）替换这些 wasm 文件。
 */

const fs = require('fs');
const path = require('path');

// 最小有效 WebAssembly 模块：magic number + version
const WASM_MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00]);

const ogDir = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og');

const wasmFiles = ['resvg.wasm', 'yoga.wasm'];

for (const file of wasmFiles) {
  const filePath = path.join(ogDir, file);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.size > 100) {
      fs.writeFileSync(filePath, WASM_MAGIC);
      console.log(`✅ Stubbed ${file} (${stat.size} -> 8 bytes)`);
    } else {
      console.log(`ℹ️  ${file} already stubbed.`);
    }
  } else {
    console.log(`⚠️  ${file} not found, skipping.`);
  }
}
