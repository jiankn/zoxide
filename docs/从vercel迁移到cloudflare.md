# 从 Vercel 迁移到 Cloudflare 完整方案

> 本文档是 zoxide.org 网站从 Vercel（Next.js 16）迁移到 Cloudflare Pages（Astro）的完整实施计划。
> 包含：代码重构、域名迁移、SEO 保全、功能还原等所有细节。

---

## 目录

1. [迁移背景](#1-迁移背景)
2. [迁移前准备](#2-迁移前准备)
3. [Astro 项目初始化](#3-astro-项目初始化)
4. [功能还原清单](#4-功能还原清单)
5. [代码迁移详细步骤](#5-代码迁移详细步骤)
6. [域名迁移到 Cloudflare](#6-域名迁移到-cloudflare)
7. [Cloudflare Pages 部署配置](#7-cloudflare-pages-部署配置)
8. [SEO 保全方案](#8-seo-保全方案)
9. [上线切换流程](#9-上线切换流程)
10. [Cloudflare 免费版限制清单](#10-cloudflare-免费版限制清单)
11. [回滚预案](#11-回滚预案)

---

## 1. 迁移背景

### 1.1 为什么迁移

- **Vercel 免费版 CPU 限制**：每月仅 4 小时 Active CPU，zoxide 项目 30 天已消耗约 3h17m（87.2%），接近上限
- **无收入项目**：项目没有任何收益，不值得为平台付费
- **Cloudflare Pages 免费版更适合**：纯静态站点无带宽和请求数限制，无 CPU 限制

### 1.2 为什么选择 Astro 而不是保留 Next.js

| 对比 | Next.js（当前） | Astro（目标） |
|---|---|---|
| 定位 | 全栈框架，SSR 为主 | 内容网站专用框架 |
| 产物 | 需要 Node.js 运行时 | 纯静态 HTML，零 JS 开销 |
| 构建体积 | 较大（含 React 运行时） | 极小（按需加载） |
| i18n | 需要 next-intl + middleware | 原生支持 |
| Cloudflare 兼容 | 需要 OpenNext 适配器 | 原生支持 Cloudflare Pages |
| 性能 | 需要客户端 hydration | 默认零客户端 JS |

### 1.3 项目现状分析

**当前技术栈**：

| 组件 | 技术 | 文件大小 |
|---|---|---|
| 框架 | Next.js 16.1.0 + App Router | - |
| 国际化 | next-intl v4（zh/en/ja） | 翻译文件合计 ~383KB |
| 样式 | TailwindCSS 4 | - |
| 数据 | 本地 TS 文件 | `blog.ts` 141KB + `tutorials.ts` 48KB |
| 搜索 | fuse.js + API 路由 | - |
| 分析 | Google Analytics (G-417HF3TV3L) | - |
| SEO | 结构化数据 + canonical + hreflang | - |

**现有页面（共 14 个）**：

| 页面 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | Hero 区 + 功能亮点 + 安装指南 + 教程推荐 + CTA |
| 功能 | `/features` | 功能特性介绍 |
| 下载 | `/download` | 各平台下载指南 |
| 博客列表 | `/blog` | 所有博客文章列表 |
| 博客详情 | `/blog/[slug]` | 单篇博客文章 |
| 教程列表 | `/tutorials` | 所有教程列表 |
| 教程详情 | `/tutorials/[slug]` | 单个教程 |
| 教程视频 | `/tutorials/videos` | 视频教程 |
| FAQ | `/faq` | 常见问题 |
| 更新日志 | `/changelog` | 版本更新记录 |
| 对比 | `/comparisons` | 与其他工具对比 |
| 关于 | `/about` | 关于页面 |
| 隐私政策 | `/privacy-policy` | - |
| 服务条款 | `/terms-of-service` | - |

**现有组件（共 13 个）**：

| 组件 | 功能 | 迁移难度 |
|---|---|---|
| Navigation | 导航栏 + 语言切换 + 移动端汉堡菜单 | 中 |
| Hero | 首页大图区域（含 next/image） | 低 |
| Footer | 页脚（多列链接 + 法律链接） | 低 |
| Search | 全站搜索（fuse.js 客户端搜索） | 中 |
| CodeBlock | 代码块高亮（含复制按钮） | 低 |
| CookieBanner | Cookie 同意横幅 | 低 |
| GoogleAnalytics | GA4 集成（基于 Cookie 同意） | 低 |
| DisclaimerBanner | 免责声明横幅 | 低 |
| Logo | SVG Logo 组件 | 低 |
| Markdown | Markdown 渲染 | 低（Astro 原生支持更好） |
| HtmlLang | HTML lang 属性设置 | 低（Astro 原生处理） |
| RelatedPosts | 相关文章推荐 | 低 |
| ShareButtons | 社交分享按钮 | 低 |

---

## 2. 迁移前准备

### 2.1 备份当前项目

```bash
# 确保 git 仓库是最新的
git add -A
git commit -m "迁移前备份：记录 Next.js 版本最终状态"
git tag v1.0-nextjs-final

# 推送到远程仓库
git push origin main --tags
```

### 2.2 记录当前域名 DNS 配置

在迁移前，截图或记录当前 `zoxide.org` 的所有 DNS 记录：

```
# 需要确认并记录的信息：
- 域名注册商（在哪里购买的域名？）
- 当前 Nameserver 配置
- 所有 DNS 记录（A、CNAME、MX、TXT 等）
- 现有的 SSL/TLS 配置
- Vercel 上绑定的自定义域名设置
```

### 2.3 记录当前 Google Search Console 数据

- 导出当前已索引的 URL 列表
- 记录当前 sitemap 中的所有 URL
- 记录 Google Analytics 配置（GA ID: `G-417HF3TV3L`）

### 2.4 安装必要工具

```bash
# 安装 Wrangler CLI（Cloudflare 部署工具）
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

---

## 3. Astro 项目初始化

### 3.1 创建新的 Astro 项目

建议在新分支上进行重构，保留旧代码可参考：

```bash
# 创建新分支
git checkout -b feat/astro-migration

# 在项目根目录初始化 Astro（会覆盖现有文件，所以先在临时目录创建）
# 或者直接在另一个临时目录创建并复制过来
npx -y create-astro@latest ./astro-temp -- --template minimal --no-install --typescript strict

# 手动将 Astro 项目结构复制到主目录并清理临时目录
```

### 3.2 Astro 项目结构

```
zoxide/
├── astro.config.mjs          # Astro 配置（含 i18n、Cloudflare 适配器）
├── package.json
├── tsconfig.json
├── public/                    # 静态文件（图片、favicon、robots.txt 等）
│   ├── favicon.ico
│   ├── icon.svg
│   ├── tutorial.webp
│   └── _redirects             # Cloudflare Pages 重定向规则
├── src/
│   ├── layouts/               # 布局
│   │   └── BaseLayout.astro   # 基础布局（替代 Next.js layout.tsx）
│   ├── pages/                 # 页面（文件路由）
│   │   ├── index.astro        # 英文首页（默认语言）
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── tutorials/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── videos.astro
│   │   ├── features.astro
│   │   ├── download.astro
│   │   ├── faq.astro
│   │   ├── changelog.astro
│   │   ├── comparisons.astro
│   │   ├── about.astro
│   │   ├── privacy-policy.astro
│   │   ├── terms-of-service.astro
│   │   ├── zh/                # 中文页面
│   │   │   ├── index.astro
│   │   │   ├── blog/
│   │   │   ├── tutorials/
│   │   │   └── ...（镜像英文目录结构）
│   │   └── ja/                # 日文页面
│   │       ├── index.astro
│   │       └── ...（镜像英文目录结构）
│   ├── components/            # 组件（可混用 .astro 和 .tsx）
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── CodeBlock.astro
│   │   ├── Search.tsx         # 需要交互，保留 React（Astro Island）
│   │   ├── CookieBanner.tsx   # 需要交互，保留 React（Astro Island）
│   │   ├── Logo.astro
│   │   └── ShareButtons.astro
│   ├── i18n/                  # 国际化
│   │   ├── utils.ts           # i18n 工具函数
│   │   └── ui.ts              # UI 翻译字符串
│   ├── data/                  # 数据（直接复用现有 TS 数据文件）
│   │   ├── blog.ts
│   │   └── tutorials.ts
│   ├── content/               # 如果后续想用 Astro Content Collections
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       └── seo.ts             # SEO 工具函数
├── messages/                  # 翻译文件（直接复用现有 JSON）
│   ├── en.json
│   ├── zh.json
│   └── ja.json
└── docs/
```

### 3.3 关键依赖

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/cloudflare": "^12.x",
    "@astrojs/tailwind": "^6.x",
    "@astrojs/react": "^4.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "fuse.js": "^7.1.0",
    "lucide-react": "^0.555.0"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

> **说明**：
> - `@astrojs/react`：让 Astro 支持 React 组件（仅用于需要客户端交互的组件，如 Search 和 CookieBanner）
> - `@astrojs/cloudflare`：Cloudflare Pages 适配器（如果选择纯静态模式则不需要，用默认的 static 模式即可）
> - 大部分组件直接用 `.astro` 格式重写，无需 React 运行时

### 3.4 Astro 配置文件

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://zoxide.org',
  trailingSlash: 'always',           // 与现有配置保持一致
  
  // 国际化配置
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja'],
    routing: {
      prefixDefaultLocale: false,     // 英文不带前缀：/blog/xxx
                                       // 中文带前缀：/zh/blog/xxx
                                       // 日文带前缀：/ja/blog/xxx
    },
  },

  integrations: [
    tailwind(),
    react(),                          // 仅用于交互组件（Search, CookieBanner）
  ],

  // 构建配置
  build: {
    format: 'directory',              // 生成 /blog/index.html 格式
    assets: '_assets',                // 静态资源目录
  },

  // 图片优化
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',  // 构建时优化图片
    },
  },
});
```

---

## 4. 功能还原清单

### 4.1 必须还原的功能

| # | 功能 | 当前实现 | Astro 实现方案 | 优先级 |
|---|---|---|---|---|
| 1 | 多语言路由 | next-intl middleware | Astro 原生 i18n 路由 | P0 |
| 2 | 14 个页面 | App Router 页面 | Astro 文件路由 | P0 |
| 3 | 博客详情动态路由 | `[slug]` 动态路由 | `[slug].astro` + `getStaticPaths()` | P0 |
| 4 | 教程详情动态路由 | `[slug]` 动态路由 | `[slug].astro` + `getStaticPaths()` | P0 |
| 5 | 全站搜索 | API 路由 + fuse.js | 构建时生成 JSON 索引 + 客户端 fuse.js | P0 |
| 6 | SEO 元数据 | `generateMetadata` + hreflang | Astro `<head>` 标签 + hreflang | P0 |
| 7 | 结构化数据 | JSON-LD Schema.org | 直接复用现有 schema.ts | P0 |
| 8 | sitemap | Next.js `sitemap.ts` | `@astrojs/sitemap` 集成 | P0 |
| 9 | robots.txt | Next.js `robots.ts` | `public/robots.txt` 静态文件 | P0 |
| 10 | Google Analytics | `next/script` 动态加载 | `<script>` 标签 + Cookie 同意逻辑 | P1 |
| 11 | Cookie Banner | React 客户端组件 | Astro Island（保留 React） | P1 |
| 12 | 导航栏 | React 客户端组件 | Astro 组件 + 少量 JS | P1 |
| 13 | 代码块高亮 | 自定义 CodeBlock 组件 | Astro 原生 Shiki 代码高亮 | P1 |
| 14 | HTTP→HTTPS 重定向 | middleware | Cloudflare 自动处理 | P0 |
| 15 | www→非www 重定向 | middleware | Cloudflare Page Rules / `_redirects` | P0 |
| 16 | 代码示例路径拦截 404 | middleware 正则 | Cloudflare `_redirects` 或忽略 | P2 |
| 17 | 图片优化 | `next/image` + AVIF/WebP | Astro `<Image>` 组件（构建时优化） | P1 |
| 18 | Google Fonts | `next/font/google` (Geist) | 直接 `<link>` 引入或本地字体 | P1 |

### 4.2 可以删除/简化的功能

| 功能 | 原因 |
|---|---|
| middleware.ts | Cloudflare 自动处理 HTTPS，`_redirects` 处理 www 重定向 |
| `/api/search` 路由 | 改为构建时生成 JSON，客户端搜索 |
| `/api/alternate-slug` 路由 | 构建时直接在页面中处理语言映射 |
| `next-intl` 依赖 | Astro 原生 i18n 替代 |
| React hydration 开销 | 大部分组件改为 Astro 原生组件，零 JS |

---

## 5. 代码迁移详细步骤

### 5.1 第一步：国际化系统迁移

**5.1.1 创建 i18n 工具函数**

```typescript
// src/i18n/utils.ts
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';
import ja from '../../messages/ja.json';

export const languages = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

export const defaultLang = 'en';

const translations = { en, zh, ja } as const;

// 通过路径获取当前语言
export function getLangFromUrl(url: URL): keyof typeof translations {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as keyof typeof translations;
  return defaultLang;
}

// 获取翻译函数（支持嵌套 key，如 'home.title'）
export function useTranslations(lang: keyof typeof translations) {
  return function t(key: string): string {
    const keys = key.split('.');
    let result: unknown = translations[lang];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // 降级到默认语言
        result = translations[defaultLang];
        for (const fallbackKey of keys) {
          if (result && typeof result === 'object' && fallbackKey in result) {
            result = (result as Record<string, unknown>)[fallbackKey];
          } else {
            return key; // 找不到翻译，返回 key 本身
          }
        }
        break;
      }
    }
    return typeof result === 'string' ? result : key;
  };
}

// 生成当前页面的其他语言链接
export function getLocalizedPath(pathname: string, targetLang: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  // 移除现有语言前缀
  if (segments[0] && segments[0] in translations) {
    segments.shift();
  }

  // 默认语言不加前缀
  if (targetLang === defaultLang) {
    return '/' + segments.join('/') + '/';
  }

  return '/' + targetLang + '/' + segments.join('/') + '/';
}
```

**5.1.2 翻译文件**

直接复用现有的翻译 JSON 文件：`messages/en.json`、`messages/zh.json`、`messages/ja.json`

无需任何修改，Astro 可以直接 import JSON 文件。

### 5.2 第二步：布局迁移

**5.2.1 基础布局**

```astro
---
// src/layouts/BaseLayout.astro
// 替代 Next.js 的 app/[locale]/layout.tsx

import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import CookieBanner from '../components/CookieBanner.tsx';
import GoogleAnalytics from '../components/GoogleAnalytics.astro';
import { generateOrganizationSchema } from '../lib/seo';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  keywords?: string;
  lang?: string;
  canonicalUrl?: string;
  alternateUrls?: Record<string, string>;
}

const {
  title,
  description = '',
  keywords = '',
  lang = 'en',
  canonicalUrl,
  alternateUrls = {},
} = Astro.props;

const orgSchema = generateOrganizationSchema();
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    
    <!-- Canonical URL -->
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    
    <!-- Hreflang 标签 -->
    {Object.entries(alternateUrls).map(([hreflang, url]) => (
      <link rel="alternate" hreflang={hreflang} href={url} />
    ))}
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    
    <!-- Google Fonts (Geist) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    
    <!-- 结构化数据 -->
    <script type="application/ld+json" set:html={JSON.stringify(orgSchema)} />
    
    <slot name="head" />
  </head>
  <body class="antialiased">
    <Navigation lang={lang} />
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer lang={lang} />
    <CookieBanner client:idle lang={lang} />
    <GoogleAnalytics />
  </body>
</html>
```

**关键变化**：
- `next/font/google` → 标准 `<link>` 标签引入 Google Fonts
- `NextIntlClientProvider` → 每个页面直接传入 `lang` prop
- `next/image` → Astro `<Image>` 组件或原生 `<img>`
- React `'use client'` → Astro Island（`client:idle`）

### 5.3 第三步：页面迁移

**5.3.1 页面迁移模式**（以首页为例）

```astro
---
// src/pages/index.astro (英文首页)
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import { useTranslations } from '../i18n/utils';
import { generateMultilingualUrls } from '../lib/seo';

const lang = 'en';
const t = useTranslations(lang);
const { canonicalUrl, alternateUrls } = generateMultilingualUrls('');
---

<BaseLayout
  title={t('seo.titles.home')}
  description="zoxide is a smarter cd command..."
  lang={lang}
  canonicalUrl={canonicalUrl}
  alternateUrls={alternateUrls}
>
  <Hero lang={lang} />
  
  <!-- 功能亮点等内容区域 -->
  <div class="container mx-auto max-w-6xl px-4 py-12">
    <!-- 直接写 HTML，无需 React 运行时 -->
    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-8">
        {t('home.features.title')}
      </h2>
      <!-- ... -->
    </section>
  </div>
</BaseLayout>
```

```astro
---
// src/pages/zh/index.astro (中文首页)
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import { useTranslations } from '../../i18n/utils';
import { generateMultilingualUrls } from '../../lib/seo';

const lang = 'zh';
const t = useTranslations(lang);
const { canonicalUrl, alternateUrls } = generateMultilingualUrls('');
---

<BaseLayout
  title={t('seo.titles.home')}
  description="zoxide 是一个智能的目录跳转工具..."
  lang={lang}
  canonicalUrl={canonicalUrl}
  alternateUrls={alternateUrls}
>
  <!-- 与英文页面结构完全相同，仅翻译文本不同 -->
  <Hero lang={lang} />
  <!-- ... -->
</BaseLayout>
```

**5.3.2 动态路由页面**（博客详情）

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getAllPosts } from '../../data/blog';
import { useTranslations } from '../../i18n/utils';

export async function getStaticPaths() {
  const posts = getAllPosts();
  return posts
    .filter(post => !post.locales || post.locales.includes('en'))
    .map(post => ({
      params: { slug: post.slug },
      props: { post },
    }));
}

const { post } = Astro.props;
const lang = 'en';
const t = useTranslations(lang);
---

<BaseLayout title={post.title} description={post.excerpt} lang={lang}>
  <article class="container mx-auto max-w-4xl px-4 py-12">
    <h1 class="text-4xl font-bold">{post.title}</h1>
    <!-- 文章内容 -->
  </article>
</BaseLayout>
```

**5.3.3 减少重复：使用共享页面模板**

为了避免为每种语言重复编写相同的页面结构，可使用共享组件：

```astro
---
// src/components/pages/HomePage.astro（共享模板）

interface Props {
  lang: string;
}

import Hero from '../Hero.astro';
import { useTranslations } from '../../i18n/utils';

const { lang } = Astro.props;
const t = useTranslations(lang as 'en' | 'zh' | 'ja');
---

<Hero lang={lang} />
<div class="container mx-auto max-w-6xl px-4 py-12">
  <section>
    <h2 class="text-3xl font-bold text-gray-900 mb-8">{t('home.features.title')}</h2>
    <!-- 共享的页面结构 -->
  </section>
</div>
```

然后：

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import HomePage from '../components/pages/HomePage.astro';
---
<BaseLayout title="..." lang="en">
  <HomePage lang="en" />
</BaseLayout>
```

```astro
---
// src/pages/zh/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import HomePage from '../../components/pages/HomePage.astro';
---
<BaseLayout title="..." lang="zh">
  <HomePage lang="zh" />
</BaseLayout>
```

### 5.4 第四步：组件迁移

**5.4.1 纯展示组件 → Astro 组件**

以下组件没有客户端交互，直接用 `.astro` 重写（零 JS 开销）：

- `Hero.astro` ← Hero.tsx
- `Footer.astro` ← Footer.tsx
- `Navigation.astro` ← Navigation.tsx（移动端菜单的展开/收起用原生 JS）
- `Logo.astro` ← Logo.tsx
- `CodeBlock.astro` ← 使用 Astro 内置的 Shiki 代码高亮
- `DisclaimerBanner.astro`
- `RelatedPosts.astro`
- `ShareButtons.astro`

**5.4.2 交互组件 → Astro Island（保留 React）**

以下组件需要客户端交互，使用 Astro Island 模式保留 React：

```astro
<!-- 使用 client:idle 延迟加载，不影响首次渲染性能 -->
<Search client:idle lang={lang} />
<CookieBanner client:idle lang={lang} />
```

这些组件需要小幅修改：
- 移除 `'use client'` 指令（Astro 不需要）
- 移除 `next-intl` 的 `useTranslations`，改为直接接收翻译文本作为 props
- 移除 `@/i18n/routing` 的 `Link`，使用标准 `<a>` 标签

**5.4.3 Navigation 组件特殊处理**

Navigation 的移动端汉堡菜单和语言切换下拉需要 JS 交互，但逻辑简单，建议用原生 JS 实现（避免加载 React）：

```astro
---
// src/components/Navigation.astro
import Logo from './Logo.astro';
import { useTranslations, getLocalizedPath, languages } from '../i18n/utils';

const { lang } = Astro.props;
const t = useTranslations(lang);
const currentPath = Astro.url.pathname;
---

<nav class="border-b bg-white sticky top-0 z-50">
  <!-- 导航内容 -->
  <button id="mobile-menu-btn" aria-label="Menu">
    <!-- 汉堡图标 -->
  </button>
  
  <!-- 语言切换 -->
  <div class="relative" id="locale-switcher">
    {Object.entries(languages).map(([code, name]) => (
      <a href={getLocalizedPath(currentPath, code)} class:list={[code === lang && 'font-bold']}>
        {name}
      </a>
    ))}
  </div>
</nav>

<script>
  // 原生 JS 处理交互，体积极小
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });
</script>
```

### 5.5 第五步：搜索功能迁移

**核心思路**：从"API 路由 + 服务端搜索"变为"构建时生成索引 + 客户端搜索"

**5.5.1 构建时生成搜索索引**

```typescript
// src/data/search-index.ts
// 在构建时执行，生成搜索索引数据

import { getAllPosts } from './blog';
import { getAllTutorials } from './tutorials';
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';
import ja from '../../messages/ja.json';

const messages = { en, zh, ja };

export function generateSearchIndex(locale: string) {
  const msg = messages[locale as keyof typeof messages];
  const results = [];

  // 博客
  const posts = getAllPosts();
  for (const post of posts) {
    if (post.locales && !post.locales.includes(locale as 'zh' | 'en' | 'ja')) continue;
    results.push({
      type: 'blog',
      title: msg?.blog?.data?.[post.slug]?.title || post.title,
      description: msg?.blog?.data?.[post.slug]?.excerpt || post.excerpt,
      url: locale === 'en' ? `/blog/${post.slug}/` : `/${locale}/blog/${post.slug}/`,
    });
  }

  // 教程
  const tutorials = getAllTutorials();
  for (const tutorial of tutorials) {
    results.push({
      type: 'tutorial',
      title: msg?.tutorials?.data?.[tutorial.slug]?.title || tutorial.title,
      description: msg?.tutorials?.data?.[tutorial.slug]?.excerpt || tutorial.excerpt,
      url: locale === 'en' ? `/tutorials/${tutorial.slug}/` : `/${locale}/tutorials/${tutorial.slug}/`,
    });
  }

  return results;
}
```

**5.5.2 搜索组件**

修改现有的 `Search.tsx`，移除 API 调用，改为导入预生成的索引：

```tsx
// src/components/Search.tsx
// 保留 React（Astro Island），但改为纯客户端搜索

import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Props {
  lang: string;
  searchData: Array<{type: string; title: string; description: string; url: string}>;
}

export default function Search({ lang, searchData }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const fuse = new Fuse(searchData, {
    keys: ['title', 'description'],
    threshold: 0.3,
  });

  useEffect(() => {
    if (query.length > 1) {
      setResults(fuse.search(query).map(r => r.item));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    // UI 基本保持不变，去掉 next-intl 和 next/router 依赖
    // ...
  );
}
```

### 5.6 第六步：SEO 迁移

**5.6.1 SEO 工具函数**

```typescript
// src/lib/seo.ts
// 复用现有的 schema.ts 逻辑，适配 Astro

const baseUrl = 'https://zoxide.org';
const locales = ['en', 'zh', 'ja'];
const defaultLocale = 'en';

export function generateMultilingualUrls(path: string) {
  const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);
  
  // Canonical URL
  // 当前页面的 canonical 已在调用时由 lang 确定
  const urls: Record<string, string> = {};
  
  for (const locale of locales) {
    const isDefault = locale === defaultLocale;
    urls[locale] = normalizedPath === ''
      ? (isDefault ? `${baseUrl}/` : `${baseUrl}/${locale}/`)
      : (isDefault ? `${baseUrl}${normalizedPath}/` : `${baseUrl}/${locale}${normalizedPath}/`);
  }
  
  urls['x-default'] = normalizedPath === '' ? `${baseUrl}/` : `${baseUrl}${normalizedPath}/`;

  return {
    alternateUrls: urls,
    getCanonical: (lang: string) => urls[lang] || urls[defaultLocale],
  };
}

// 直接复用现有的 schema.ts 中的函数：
// - generateOrganizationSchema()
// - generateArticleSchema()
// - generateFAQPageSchema()
// - generateHowToSchema()
```

**5.6.2 sitemap**

使用 `@astrojs/sitemap` 集成自动生成：

```javascript
// astro.config.mjs 中添加
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zoxide.org',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh',
          ja: 'ja',
        },
      },
    }),
    // 其他集成...
  ],
});
```

**5.6.3 robots.txt**

直接创建静态文件（替代 Next.js 的 `robots.ts`）：

```
# public/robots.txt
User-agent: *
Allow: /
Disallow: /api/

# 代码示例路径
Disallow: /home/
Disallow: /tmp:
Disallow: /var:
Disallow: /persist
Disallow: /shared/
Disallow: /node_modules
Disallow: /.git
Disallow: /favicon.ico

# AI 爬虫
User-agent: Bytespider
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: https://zoxide.org/sitemap-index.xml
```

### 5.7 第七步：Google Analytics 迁移

```astro
---
// src/components/GoogleAnalytics.astro
// 替代 Next.js 的 GoogleAnalytics.tsx
// 使用原生 <script> 标签，无需 React
const GA_ID = 'G-417HF3TV3L';
---

<script define:vars={{ GA_ID }}>
  // 检查 Cookie 同意
  function checkConsent() {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) return false;
      const prefs = JSON.parse(localStorage.getItem('cookie-preferences') || '{}');
      return prefs.analytics === true;
    } catch {
      return false;
    }
  }

  function loadGA() {
    if (!checkConsent()) return;
    
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // 初始加载
  loadGA();

  // 监听同意变化
  window.addEventListener('cookieConsentChanged', loadGA);
</script>
```

---

## 6. 域名迁移到 Cloudflare

### 6.1 迁移路径概览

```
当前状态：域名注册商 → Vercel DNS/部署
目标状态：域名注册商 → Cloudflare DNS → Cloudflare Pages 部署
```

有两种方式，推荐方式 A（更简单）：

### 6.2 方式 A：仅迁移 DNS 到 Cloudflare（推荐）

保持域名在原注册商，仅将 DNS 解析改为 Cloudflare。

**步骤**：

**① 在 Cloudflare 添加域名**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 **"Add a site"**
3. 输入 `zoxide.org`
4. 选择 **Free** 计划
5. Cloudflare 会自动扫描你现有的 DNS 记录并导入

**② 核查 DNS 记录**

Cloudflare 扫描完成后，检查以下 DNS 记录是否完整：

| 类型 | 名称 | 内容 | 代理状态 |
|---|---|---|---|
| CNAME | `@` (或 `zoxide.org`) | `<你的项目名>.pages.dev` | 已代理（橙色云） |
| CNAME | `www` | `zoxide.org` | 已代理（橙色云） |
| 其他 | MX/TXT 等 | 保持原有配置 | 仅 DNS |

> ⚠️ **重要**：先记录但**暂时不要删除** Vercel 的 DNS 记录。等新站点完全就绪后再切换。

**③ 在域名注册商修改 Nameserver**

1. 登录你的域名注册商（如 Namecheap、GoDaddy、阿里云等）
2. 找到 `zoxide.org` 的 Nameserver 设置
3. 将 Nameserver 改为 Cloudflare 分配的值（通常类似）：
   ```
   ns1.cloudflare.com    （具体值以 Cloudflare Dashboard 显示为准）
   ns2.cloudflare.com
   ```
4. 保存修改
5. DNS 传播需要 **几分钟 ~ 24 小时**

**④ 在 Cloudflare 验证**

回到 Cloudflare Dashboard，点击 **"Check nameservers"**，等待状态变为 **Active**。

### 6.3 方式 B：将域名注册转移到 Cloudflare Registrar

如果想把域名注册也转到 Cloudflare（Cloudflare 只收取批发价，无加价）：

**前提条件**：
- 域名注册超过 60 天
- 近 60 天内未转移过
- 域名未被锁定

**步骤**：

1. 在原注册商**解锁域名**
2. 在原注册商**关闭 WHOIS 隐私保护**（如有）
3. 在原注册商**获取授权码（Auth Code / EPP Code）**
4. 在 Cloudflare Dashboard → **Domain Registration** → **Transfer Domains**
5. 输入 `zoxide.org`，粘贴授权码
6. 支付转移费用（通常 = 续费一年的批发价，约 $9-10）
7. 确认邮件，等待转移完成（通常 5-7 天）

### 6.4 SSL/TLS 配置

Cloudflare 会自动为你的域名提供免费的 SSL 证书：

1. 在 Cloudflare Dashboard → **SSL/TLS** → **Overview**
2. 选择加密模式为 **"Full (strict)"**
3. 在 **Edge Certificates** 中确认证书已签发
4. 开启 **"Always Use HTTPS"**（替代 middleware 中的 HTTP→HTTPS 重定向）

---

## 7. Cloudflare Pages 部署配置

### 7.1 连接 Git 仓库

**① 创建 Pages 项目**

1. 登录 Cloudflare Dashboard → **Workers & Pages** → **Create**
2. 选择 **Pages** → **Connect to Git**
3. 授权 GitHub/GitLab 并选择 `zoxide` 仓库
4. 配置构建：

| 设置项 | 值 |
|---|---|
| 项目名称 | `zoxide` |
| 生产分支 | `main`（或你指定的分支） |
| 框架预设 | **Astro** |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| Node.js 版本 | `20`（在环境变量中设置 `NODE_VERSION=20`） |

**② 环境变量**

| 变量名 | 值 | 说明 |
|---|---|---|
| `NODE_VERSION` | `20` | 确保使用正确的 Node.js 版本 |
| `SITE_URL` | `https://zoxide.org` | 站点 URL |

### 7.2 绑定自定义域名

1. 在 Pages 项目中 → **Custom domains** → **Set up a custom domain**
2. 输入 `zoxide.org`
3. Cloudflare 会自动创建 DNS 记录（如果域名已在 Cloudflare DNS 上）
4. 等待 SSL 证书签发（通常几分钟）

### 7.3 重定向配置

创建 `public/_redirects` 文件（Cloudflare Pages 原生支持）：

```
# www 到非 www 重定向
https://www.zoxide.org/* https://zoxide.org/:splat 301

# 代码示例路径 404（如需要的话）
/home/* /404.html 404
/tmp:* /404.html 404
/var:* /404.html 404
/persist /404.html 404
/persist/* /404.html 404
/shared/* /404.html 404
/node_modules /404.html 404
/node_modules/* /404.html 404
/.git /404.html 404
/.git/* /404.html 404
```

### 7.4 自定义 Headers

创建 `public/_headers` 文件：

```
# 全站缓存策略
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# 静态资源长缓存
/_assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## 8. SEO 保全方案

### 8.1 URL 结构保持一致

**必须确保 URL 结构完全不变**：

| 当前 URL | Astro URL | 状态 |
|---|---|---|
| `https://zoxide.org/` | `https://zoxide.org/` | ✅ 一致 |
| `https://zoxide.org/blog/` | `https://zoxide.org/blog/` | ✅ 一致 |
| `https://zoxide.org/blog/zoxide-commands/` | `https://zoxide.org/blog/zoxide-commands/` | ✅ 一致 |
| `https://zoxide.org/zh/` | `https://zoxide.org/zh/` | ✅ 一致 |
| `https://zoxide.org/zh/blog/` | `https://zoxide.org/zh/blog/` | ✅ 一致 |
| `https://zoxide.org/ja/tutorials/quick-start/` | `https://zoxide.org/ja/tutorials/quick-start/` | ✅ 一致 |

> **关键**：`trailingSlash: 'always'` 保持与 Next.js 配置一致，所有 URL 以 `/` 结尾。

### 8.2 Hreflang 标签保持一致

每个页面必须包含与现有完全相同的 hreflang 标签：

```html
<link rel="alternate" hreflang="en" href="https://zoxide.org/blog/xxx/" />
<link rel="alternate" hreflang="zh" href="https://zoxide.org/zh/blog/xxx/" />
<link rel="alternate" hreflang="ja" href="https://zoxide.org/ja/blog/xxx/" />
<link rel="alternate" hreflang="x-default" href="https://zoxide.org/blog/xxx/" />
```

### 8.3 结构化数据保持一致

- Organization schema → 直接复用 `schema.ts`
- Article schema → 博客详情页保持 JSON-LD
- FAQ schema → FAQ 页面保持 JSON-LD
- HowTo schema → 教程页面保持 JSON-LD

### 8.4 Google Search Console 操作

迁移后：

1. 在 Google Search Console 中**验证**你的域名所有权（Cloudflare DNS 验证方式）
2. **提交新的 sitemap**：`https://zoxide.org/sitemap-index.xml`
3. **请求重新索引**首页和关键页面
4. 监控 1-2 周，观察索引状态是否正常

---

## 9. 上线切换流程

### 9.1 切换前（T-7天）

- [ ] Astro 项目开发完成并通过本地测试
- [ ] 使用 `npm run build` 确认所有页面构建成功
- [ ] 本地 `npm run preview` 测试所有页面功能
- [ ] 对比新旧站点的所有 URL，确保无遗漏
- [ ] 确认所有 SEO 元素（title、description、canonical、hreflang）正确

### 9.2 切换前（T-1天）

- [ ] 在 Cloudflare Pages 上部署预览版（使用 `xxx.pages.dev` 域名测试）
- [ ] 测试搜索功能、语言切换、代码高亮等交互功能
- [ ] 确认 Google Analytics 能正常加载
- [ ] 确认 Cookie Banner 正常工作
- [ ] 快照当前 Vercel 站点的关键页面截图（用于对比）

### 9.3 执行切换（T-0）

1. **修改 Nameserver**（如果还没改）或**修改 DNS 记录**
   - 将 `zoxide.org` 的 CNAME 从 Vercel 指向 Cloudflare Pages
2. **在 Cloudflare Pages 绑定自定义域名** `zoxide.org`
3. **等待 DNS 传播**（通常 5-30 分钟）
4. **验证**：
   - 访问 `https://zoxide.org` 确认指向新站点
   - 检查 HTTPS 证书是否正确
   - 测试几个关键页面
   - 测试语言切换
   - 测试搜索功能
5. **在 Vercel 上移除自定义域名绑定**（避免冲突）

### 9.4 切换后（T+1~7天）

- [ ] 在 Google Search Console 提交新 sitemap
- [ ] 监控 Cloudflare Analytics 的流量数据
- [ ] 监控 Google Search Console 的索引状态和覆盖率
- [ ] 确认无 404 错误
- [ ] 确认搜索排名没有明显下降
- [ ] 确认所有语言版本正常访问
- [ ] 可以在 Vercel 上删除旧项目（或保留一段时间作备份）

---

## 10. Cloudflare 免费版限制清单

### 10.1 Cloudflare Pages Free 限制

| 资源 | 免费版限额 | 对本项目的影响 |
|---|---|---|
| **带宽** | **无限制** | ✅ 完全无担忧 |
| **请求数** | **无限制** | ✅ 完全无担忧 |
| **构建次数** | 500 次/月 | ✅ 足够（正常更新 10-20 次/月） |
| **并发构建** | 1 个 | ✅ 个人项目无影响 |
| **构建超时** | 20 分钟 | ✅ Astro 构建通常 1-2 分钟 |
| **文件数量** | 20,000 个/项目 | ✅ 当前项目远低于此 |
| **单文件大小** | 25 MiB | ✅ 网站不含大文件 |
| **项目数量** | 100 个/账户 | ✅ 不是问题 |
| **自定义域名** | 100 个/项目 | ✅ 只需 1-2 个 |
| **CPU 时间** | **不适用（纯静态）** | ✅ **核心优势** |

### 10.2 与 Vercel Free 对比

| 维度 | Vercel Hobby（当前） | Cloudflare Pages Free（目标） |
|---|---|---|
| 带宽 | 100 GB/月 | **无限制** |
| 请求数 | 100 万/月 | **无限制** |
| CPU 时间 | **4 小时/月**（限制） | **不适用** |
| 构建次数 | ~100 次/月 | 500 次/月 |
| 构建时间 | 45 分钟/构建 | 20 分钟/构建 |
| Serverless 函数 | 有（受 CPU 限制） | 不需要（纯静态） |
| CDN | 全球 | 全球（280+节点） |
| HTTPS | 自动 | 自动 |
| DDoS 防护 | 基础 | **企业级（Cloudflare 核心优势）** |

### 10.3 潜在的注意事项

| 注意事项 | 说明 |
|---|---|
| 纯静态限制 | 不能使用服务端逻辑（但本项目不需要） |
| 构建触发频率 | git push 自动触发构建，500 次/月通常足够 |
| Preview 部署 | 每个 PR 会自动创建 preview 部署，会消耗构建次数 |
| 文件大小限制 | 单个上传文件最大 25MiB，注意图片压缩 |

---

## 11. 回滚预案

如果迁移后出现严重问题，可以快速回滚：

### 11.1 快速回滚（< 5 分钟）

1. 将 DNS 记录中 `zoxide.org` 的 CNAME 改回指向 Vercel
2. 或者在域名注册商将 Nameserver 改回原来的值
3. Vercel 上的旧项目**不要删除**，至少保留 30 天

### 11.2 安全措施

- 在 Vercel 上保留旧部署至少 30 天
- 保留 `v1.0-nextjs-final` git tag，随时可以重新部署
- Nameserver 变更记录保存好，方便回切

---

## 附录

### A. 迁移工作量估算

| 阶段 | 工作量 | 说明 |
|---|---|---|
| Astro 项目初始化 | 0.5 天 | 配置、依赖安装 |
| i18n 系统搭建 | 1 天 | 翻译函数、路由配置 |
| 布局和公共组件迁移 | 1 天 | Navigation、Footer、Layout |
| 14 个页面迁移 | 2-3 天 | 含 3 种语言 |
| 搜索功能迁移 | 0.5 天 | 构建时索引 + 客户端搜索 |
| SEO 迁移验证 | 0.5 天 | sitemap、robots、结构化数据 |
| 域名迁移 | 0.5 天 | DNS、SSL、`_redirects` |
| 测试和修复 | 1-2 天 | 全站测试、SEO 验证 |
| **总计** | **约 7-9 天** | - |

### B. 需要确认的信息

在开始迁移前，请确认以下信息：

1. **域名注册商**：`zoxide.org` 在哪个注册商购买的？（影响 Nameserver 修改方式）
2. **是否要转移注册商**：是否要把域名注册也转到 Cloudflare？
3. **git 仓库**：是 GitHub 还是其他平台？（影响 Cloudflare Pages 连接方式）
4. **是否有邮件服务**：`zoxide.org` 是否有配置 MX 记录用于邮件？（迁移 DNS 时需要保留）
5. **Vercel 上其他项目**：截图中看到还有 `removexif` 项目，是否也要迁移？

### C. 关键命令速查

```bash
# Astro 本地开发
npm run dev

# Astro 构建
npm run build

# Astro 预览构建产物
npm run preview

# Cloudflare Pages 本地预览（模拟 CF 环境）
npx wrangler pages dev dist

# Cloudflare Pages 手动部署
npx wrangler pages deploy dist

# 检查 DNS 传播状态
nslookup zoxide.org
dig zoxide.org
```
