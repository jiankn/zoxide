/**
 * 构建前脚本：stub @swc/core native binding
 *
 * next-intl 依赖 @swc/core，但 @swc/core 使用 native .node 文件，
 * 无法被 esbuild 打包到 Cloudflare Workers runtime。
 *
 * 此脚本将 @swc/core 的 binding.js 和 index.js 替换为空 stub，
 * 因为 @swc/core 只在 next-intl 编译时使用，Workers 运行时不需要。
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const bindingPath = path.join(
    rootDir,
    'node_modules/next-intl/node_modules/@swc/core/binding.js'
);

const indexPath = path.join(
    rootDir,
    'node_modules/next-intl/node_modules/@swc/core/index.js'
);

// Stub binding.js — 导出空对象
const bindingStub = `
// Stubbed by scripts/stub-swc.js for Cloudflare Workers compatibility
module.exports = {};
`;

// Stub index.js — 导出空方法
const indexStub = `
// Stubbed by scripts/stub-swc.js for Cloudflare Workers compatibility
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = "stubbed";
exports.parse = async () => { throw new Error("@swc/core is not available in Workers"); };
exports.parseSync = () => { throw new Error("@swc/core is not available in Workers"); };
exports.transform = async () => { throw new Error("@swc/core is not available in Workers"); };
exports.transformSync = () => { throw new Error("@swc/core is not available in Workers"); };
exports.minify = async () => { throw new Error("@swc/core is not available in Workers"); };
exports.minifySync = () => { throw new Error("@swc/core is not available in Workers"); };
exports.print = async () => { throw new Error("@swc/core is not available in Workers"); };
exports.printSync = () => { throw new Error("@swc/core is not available in Workers"); };
exports.bundle = async () => { throw new Error("@swc/core is not available in Workers"); };
exports.plugins = () => (m) => m;
exports.Compiler = class Compiler {};
exports.DEFAULT_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
`;

if (fs.existsSync(bindingPath)) {
    fs.writeFileSync(bindingPath, bindingStub);
    console.log('✅ Stubbed @swc/core/binding.js');
} else {
    console.log('⚠️ @swc/core/binding.js not found at:', bindingPath);
}

if (fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexStub);
    console.log('✅ Stubbed @swc/core/index.js');
} else {
    console.log('⚠️ @swc/core/index.js not found at:', indexPath);
}
