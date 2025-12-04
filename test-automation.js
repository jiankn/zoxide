#!/usr/bin/env node

/**
 * 代码块改造自动化测试脚本
 * 用于检查代码块改造的基本问题
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// 检查文件是否存在
function checkFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    errors.push(`❌ ${description}: ${filePath} 不存在`);
    return false;
  }
  return true;
}

// 检查文件内容
function checkFileContent(filePath, pattern, description, shouldExist = true) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const exists = pattern.test(content);
  
  if (shouldExist && !exists) {
    errors.push(`❌ ${description}: ${filePath} 中未找到预期内容`);
  } else if (!shouldExist && exists) {
    warnings.push(`⚠️  ${description}: ${filePath} 中发现旧代码`);
  }
}

console.log('🚀 开始代码块改造测试...\n');

// 1. 检查组件文件
console.log('1. 检查组件文件...');
const componentFiles = [
  'components/CodeBlock/CodeBlock.tsx',
  'components/CodeBlock/CodeBlockWrapper.tsx',
  'components/CodeBlock/index.ts',
];

componentFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  checkFileExists(filePath, `组件文件 ${file}`);
});

// 2. 检查页面是否正确导入
console.log('2. 检查页面导入...');
const pageFiles = [
  'app/[locale]/tutorials/[slug]/page.tsx',
  'app/[locale]/blog/[slug]/page.tsx',
  'app/[locale]/blog/blog/[slug]/page.tsx',
  'app/[locale]/tutorials/tutorials/[slug]/page.tsx',
  'app/[locale]/download/page.tsx',
];

pageFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    checkFileContent(
      filePath,
      /CodeBlockWrapper|CodeBlock/,
      `页面 ${file} 导入 CodeBlock`,
      true
    );
  }
});

// 3. 检查是否还有旧样式
console.log('3. 检查旧样式...');
const oldStylePattern = /bg-\[#FBF9F5\]/;
pageFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    checkFileContent(
      filePath,
      oldStylePattern,
      `页面 ${file} 中的旧样式`,
      false
    );
  }
});

// 4. 检查国际化
console.log('4. 检查国际化...');
const downloadPage = path.join(__dirname, 'app/[locale]/download/page.tsx');
if (fs.existsSync(downloadPage)) {
  const content = fs.readFileSync(downloadPage, 'utf-8');
  const hardcodedChinese = /在 macOS|安装|配置|下载/;
  if (hardcodedChinese.test(content)) {
    warnings.push('⚠️  下载页面可能包含硬编码中文文本');
  }
}

// 5. 检查翻译文件
console.log('5. 检查翻译文件...');
const translationFiles = [
  'messages/en.json',
  'messages/zh.json',
];

translationFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  checkFileExists(filePath, `翻译文件 ${file}`);
});

// 输出结果
console.log('\n📊 测试结果:\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 所有检查通过！');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('❌ 发现错误:');
    errors.forEach(error => console.log(`  ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  警告:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  process.exit(errors.length > 0 ? 1 : 0);
}

