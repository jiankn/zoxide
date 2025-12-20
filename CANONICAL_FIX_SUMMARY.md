# Canonical URL 修复总结

## 问题描述

Google Search Console 报告显示"备用网页 (有适当的规范标记)"，具体包括：
- `https://zoxide.org/zh` - 2025年12月10日抓取
- `https://zoxide.org/zh/download` - 2025年12月9日抓取

## 问题原因

1. **URL 格式不一致**：
   - 实际访问的 URL：`https://zoxide.org/zh`（无末尾斜杠）
   - Canonical URL：`https://zoxide.org/zh/`（有末尾斜杠）
   - Google 认为这是两个不同的页面，导致"备用网页"警告

2. **缺少重定向**：
   - 当用户或爬虫访问 `/zh` 时，没有自动重定向到 `/zh/`
   - 导致 Google 索引了无斜杠版本，但页面的 canonical 指向有斜杠版本

## 修复方案

### 1. 添加语言首页末尾斜杠规范化重定向

**修复文件：`middleware.ts`**

在中间件中添加了 301 永久重定向，将无末尾斜杠的语言首页重定向到带斜杠的版本：

```typescript
// 3. 语言首页末尾斜杠规范化（301 永久重定向）
// 将 /zh 重定向到 /zh/，确保与 canonical URL 一致
const localeMatch = pathname.match(/^\/(zh|en)$/);
if (localeMatch) {
  // 如果路径正好是 /zh 或 /en（无末尾斜杠），重定向到带斜杠的版本
  url.pathname = `/${localeMatch[1]}/`;
  return NextResponse.redirect(url, { status: 301 });
}
```

### 2. 确保 Canonical URL 格式一致

**已确认：`lib/seo/metadata.ts`**

Canonical URL 生成逻辑已经正确：
- 首页：`https://zoxide.org/{locale}/`（带末尾斜杠）
- 其他页面：`https://zoxide.org/{locale}{path}`（不带末尾斜杠）

### 3. 确保 Hreflang 配置正确

**已确认：`lib/seo/metadata.ts`**

Hreflang 标签配置正确：
- 每个页面都包含自引用（指向自己）
- 包含所有语言版本的链接
- 包含 x-default 指向默认语言版本

## 修复效果

修复后的行为：
- ✅ `/zh` → `/zh/`（301 重定向）
- ✅ `/en` → `/en/`（301 重定向）
- ✅ Canonical URL 与实际 URL 一致
- ✅ Google 不会再索引无斜杠版本
- ✅ "备用网页"警告将逐渐消失

## 下一步操作

1. **部署代码**：将修复后的代码部署到生产环境

2. **在 Google Search Console 中操作**：
   - 访问：索引编制 > 网页检查
   - 测试 URL：`https://zoxide.org/zh`
   - 确认显示 301 重定向到 `https://zoxide.org/zh/`
   - 使用"请求编入索引"功能，请求 Google 重新抓取

3. **验证修复**：
   - 等待 1-2 周，让 Google 重新抓取
   - 检查 Google Search Console 中的"备用网页"报告
   - 确认问题 URL 不再出现在列表中

## 技术细节

### 重定向顺序

中间件中的重定向按以下顺序执行：
1. HTTP → HTTPS（301）
2. www → 非 www（301）
3. 语言首页末尾斜杠规范化（301）← **新增**
4. 代码示例路径检测（404）
5. 国际化路由处理（next-intl）

### 正则表达式说明

```typescript
/^\/(zh|en)$/
```

- `^` - 字符串开始
- `\/` - 匹配斜杠
- `(zh|en)` - 匹配 zh 或 en
- `$` - 字符串结束

这个正则只匹配 `/zh` 或 `/en`，不匹配 `/zh/` 或 `/zh/download`。

## 预期时间线

- **代码修复**：已完成 ✅
- **部署**：需要重新部署后生效
- **Google 重新索引**：需要 1-2 周时间
- **问题解决**：2-4 周内"备用网页"警告应消失

