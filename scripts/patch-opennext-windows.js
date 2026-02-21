/**
 * Post-install 补丁：修复 @opennextjs/aws 在 Windows 上的 ESM 路径问题
 *
 * Bug: 多处使用 Windows 原始路径（如 C:\...）做 dynamic import，
 * 但 Node.js ESM 要求 file:///C:/... 格式。
 *
 * 修复方式：使用 url.pathToFileURL() 转换路径。
 */

const fs = require('fs');
const path = require('path');

const awsDir = path.join(__dirname, '..', 'node_modules', '@opennextjs', 'aws', 'dist');

// ── Patch 1: build/compileConfig.js ──
const compileConfigPath = path.join(awsDir, 'build', 'compileConfig.js');
patchFile(compileConfigPath, {
  name: 'compileConfig.js',
  bugPattern: /if \(process\.platform === "win32"\)\s*\n?\s*configPath = `file:\/\/\$\{configPath\}`;/,
  replacement: `if (process.platform === "win32") {
        const url = await import("node:url");
        configPath = url.pathToFileURL(configPath).href;
    }`,
});

// ── Patch 2: build/patch/patches/patchOriginalNextConfig.js ──
const patchNextConfigPath = path.join(awsDir, 'build', 'patch', 'patches', 'patchOriginalNextConfig.js');
patchFile(patchNextConfigPath, {
  name: 'patchOriginalNextConfig.js',
  // 匹配函数末尾的 return (await import(configToImport)).default;
  // 且前面没有 pathToFileURL（说明还没被修过）
  bugPattern: /(?<!pathToFileURL.*\n.*)(\s+)(return \(await import\(configToImport\)\)\.default;)/,
  replacement: `$1if (process.platform === "win32") {\n$1    const url = await import("node:url");\n$1    configToImport = url.pathToFileURL(configToImport).href;\n$1}\n$1$2`,
  // 还需要确保顶部 import 了 url 模块
  ensureImport: {
    check: /import url from "node:url"/,
    after: /import path from "node:path";/,
    insert: '\nimport url from "node:url";',
  },
});

function patchFile(filePath, opts) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${opts.name} not found, skipping.`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 添加缺失的 import
  if (opts.ensureImport && !opts.ensureImport.check.test(content)) {
    content = content.replace(opts.ensureImport.after, (m) => m + opts.ensureImport.insert);
    changed = true;
  }

  if (opts.bugPattern.test(content)) {
    content = content.replace(opts.bugPattern, opts.replacement);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Patched ${opts.name} (Windows file:// URL fix)`);
  } else if (content.includes('pathToFileURL')) {
    console.log(`ℹ️  ${opts.name} already patched or fixed upstream.`);
  } else {
    console.log(`⚠️  ${opts.name}: pattern not matched, may need manual check.`);
  }
}
