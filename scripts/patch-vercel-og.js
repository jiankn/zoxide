/**
 * Post-build patch: 移除 handler.mjs 中所有对 @vercel/og 的 import 引用
 *
 * 问题：即使项目没有使用 @vercel/og，Next.js 的 server bundle 仍然包含
 * 对它的动态 import（可能出现多次）。Wrangler 在打包时会解析这些 import，
 * 导致引用 resvg.wasm，而在 Windows 上 Wrangler 无法正确处理 .wasm?module 路径。
 *
 * 修复：将所有 @vercel/og 的 import 替换为抛出错误的空实现。
 */

const fs = require('fs');
const path = require('path');

const handlerPath = path.join(__dirname, '..', '.open-next', 'server-functions', 'default', 'handler.mjs');

if (!fs.existsSync(handlerPath)) {
  console.log('⚠️  handler.mjs not found, skipping @vercel/og patch.');
  process.exit(0);
}

let content = fs.readFileSync(handlerPath, 'utf8');

// 全局替换所有 @vercel/og 的 import（可能出现多次）
const ogPattern = /case"next\/dist\/compiled\/@vercel\/og\/index\.node\.js":raw=await import\("next\/dist\/compiled\/@vercel\/og\/index\.edge\.js"\);break;/g;

const matches = content.match(ogPattern);
if (matches && matches.length > 0) {
  content = content.replace(
    ogPattern,
    'case"next/dist/compiled/@vercel/og/index.node.js":throw new Error("@vercel/og is not available");'
  );
  fs.writeFileSync(handlerPath, content);
  console.log(`✅ Patched handler.mjs: replaced ${matches.length} @vercel/og import(s)`);
} else if (content.includes('@vercel/og')) {
  // 可能已经部分 patch 过了，或者格式不同
  // 用更宽松的模式再试一次
  const loosePattern = /await import\("next\/dist\/compiled\/@vercel\/og\/index\.edge\.js"\)/g;
  const looseMatches = content.match(loosePattern);
  if (looseMatches && looseMatches.length > 0) {
    content = content.replace(
      loosePattern,
      '(() => { throw new Error("@vercel/og is not available") })()'
    );
    fs.writeFileSync(handlerPath, content);
    console.log(`✅ Patched handler.mjs: replaced ${looseMatches.length} @vercel/og import(s) (loose match)`);
  } else {
    console.log('⚠️  handler.mjs contains @vercel/og but no import pattern matched. Manual check needed.');
  }
} else {
  console.log('ℹ️  handler.mjs does not reference @vercel/og, no patch needed.');
}
