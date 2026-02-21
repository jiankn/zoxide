# Next.js 从 Vercel 迁移到 Cloudflare Pages 方案

## 一、项目现状

| 项目 | 详情 |
|------|------|
| 框架 | Next.js 16.1 + React 19 + Tailwind 4 |
| 国际化 | next-intl（zh/en/ja，默认 en，localePrefix: as-needed） |
| 渲染模式 | SSG（generateStaticParams）+ middleware（Edge Function） |
| 域名 | zoxide.org |
| 当前部署 | Vercel 免费版 |
| 暗黑模式 | 无（已移除） |
| Vercel 特有功能 | 无（未使用 @vercel/analytics、@vercel/speed-insights 等） |
| 图片优化 | next/image（Logo SVG + Hero WebP，共 2 处） |
| API 路由 | /api/search（搜索）、/api/alternate-slug（语言切换 slug 查询） |
| Google Analytics | G-417HF3TV3L，通过 @next/third-parties Script 加载 |

## 二、迁移目标

- 将 Next.js 项目原样部署到 Cloudflare Pages
- 前端代码零修改，用户体验不变
- URL 结构不变，SEO 零影响
- 消除 Vercel 免费版 CPU 限制问题

## 三、改造清单

### 3.1 必须做（P0）

#### ① 安装 @opennextjs/cloudflare 适配器

```bash
npm install --save-dev @opennextjs/cloudflare
```

在项目根目录创建 `open-next.config.ts`：

```ts
import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";
const config: OpenNextConfig = {
  default: {},
};
export default config;
```

#### ② 创建 wrangler.jsonc 配置

```jsonc
{
  "name": "zoxide",
  "compatibility_flags": ["nodejs_compat"],
  "compatibility_date": "2024-12-01",
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

#### ③ 修改 package.json 构建命令

```json
{
  "scripts": {
    "build": "next build",
    "build:cf": "npx cloudflare",
    "preview": "npx wrangler dev",
    "deploy": "npx wrangler deploy"
  }
}
```

构建流程变为：`npm run build:cf`（内部会先执行 next build，再用适配器转换）

#### ④ Cloudflare 账号配置

1. 注册/登录 Cloudflare Dashboard
2. 创建 Pages 项目，关联 GitHub 仓库
3. 构建命令设为 `npx cloudflare`
4. 输出目录设为 `.open-next`

#### ⑤ DNS 切换

1. 在 Cloudflare 添加 `zoxide.org` 域名
2. 将域名 NS 记录指向 Cloudflare 的 nameserver
3. 在 Cloudflare Pages 项目中绑定自定义域名 `zoxide.org`
4. 等待 DNS 生效（通常 5 分钟 - 48 小时）

### 3.2 需要验证（P1）

#### ⑥ next/image 图片优化兼容性

当前使用 next/image 的地方：
- `components/Logo/Logo.tsx`：SVG 图标（24x24），影响极小
- `components/Hero/Hero.tsx`：WebP 图片（fill 模式，quality=60）

**风险**：Cloudflare Pages 不支持 Vercel 的图片优化 API（`/_next/image`）。

**解决方案**：
- 方案 A（推荐）：使用 Cloudflare Images 转换服务（需付费，$5/月）
- 方案 B（零成本）：在 `next.config.ts` 中禁用图片优化，改用 `unoptimized: true`
  ```ts
  images: {
    unoptimized: true,
  }
  ```
  影响：Hero 图片不再自动生成多尺寸/格式，但 `tutorial.webp` 本身已经是优化过的格式，实际影响很小。Logo 是 SVG，完全不受影响。

#### ⑦ middleware 兼容性

当前 middleware 做了：
1. HTTP → HTTPS 重定向（Cloudflare 自动处理，可删除）
2. www → 非 www 重定向（Cloudflare Page Rules 可处理）
3. 代码示例路径拦截（返回 404）
4. next-intl 国际化路由

**风险**：@opennextjs/cloudflare 对 middleware 的支持程度。

**验证方法**：本地用 `npx wrangler dev` 预览，测试以下场景：
- 访问 `/` 是否正确重定向到英文首页
- 访问 `/zh/` 是否显示中文
- 访问 `/ja/blog/xxx/` 是否正常
- 语言切换是否工作

#### ⑧ API 路由兼容性

两个 API 路由：
- `GET /api/search?locale=en` — 搜索
- `GET /api/alternate-slug?slug=xxx&locale=zh` — 语言切换 slug 查询

**风险**：Cloudflare Workers 运行时与 Node.js 有差异。

**验证方法**：本地预览时测试搜索功能和博客语言切换。

### 3.3 建议做（P2）

#### ⑨ 简化 middleware（减少 Edge Function 开销）

迁移后可以精简 middleware：

```ts
// 删除 HTTP→HTTPS 重定向（Cloudflare 自动处理）
// 删除 www→非www 重定向（用 Cloudflare Page Rules）
// 只保留 next-intl 路由 + 代码示例路径拦截
```

#### ⑩ robots.txt 和 sitemap.xml 静态化

当前是动态路由（`app/robots.ts`、`app/sitemap.ts`），每次请求都执行函数。

改为静态文件放 `public/` 目录：
- 生成一次 `public/robots.txt`
- 生成一次 `public/sitemap.xml`
- 删除 `app/robots.ts` 和 `app/sitemap.ts`

好处：减少函数调用，内容通过 CDN 直接返回。

#### ⑪ Cloudflare 特有优化（可选）

- 开启 Cloudflare 的 Auto Minify（HTML/CSS/JS 压缩）
- 开启 Brotli 压缩
- 配置 Cache Rules（静态资源长缓存）
- 配置 Bot Management（免费版有基础防护）

## 四、SEO 风险评估

| 风险项 | 风险等级 | 说明 |
|--------|---------|------|
| URL 结构变化 | 🟢 无风险 | 代码不变，URL 完全一致 |
| 内容变化 | 🟢 无风险 | 前端代码零修改 |
| 域名变化 | 🟢 无风险 | 继续使用 zoxide.org |
| 服务器响应头 | 🟡 极低风险 | Cloudflare 和 Vercel 的默认响应头略有不同，但不影响 SEO |
| DNS 切换期间 | 🟡 低风险 | 切换期间可能有短暂的解析不稳定（几分钟到几小时） |
| robots.txt/sitemap | 🟢 无风险 | 内容不变 |
| HTTPS 证书 | 🟢 无风险 | Cloudflare 自动签发免费 SSL 证书 |
| 页面加载速度 | 🟢 可能更好 | Cloudflare CDN 节点更多，亚洲访问可能更快 |

**总结：SEO 风险几乎为零。** Google 不关心你用什么托管平台，只关心 URL、内容、响应状态码是否一致。

## 五、容易遗漏的点

### 5.1 DNS 切换的过渡期

- 切换 NS 记录后，全球 DNS 缓存更新需要时间（TTL）
- 建议：切换前将 Vercel 上的 TTL 调低（如 300 秒），减少过渡期
- 切换后保留 Vercel 项目 48 小时不删除，作为回退

### 5.2 Cloudflare 的 _redirects 和 _headers 文件

Vercel 的重定向逻辑在 middleware 中，Cloudflare Pages 支持 `public/_redirects` 和 `public/_headers` 文件。如果 middleware 兼容性有问题，可以用这些文件作为备选。

### 5.3 环境变量

当前项目没有使用环境变量（GA ID 硬编码在代码中），所以不需要迁移环境变量。

### 5.4 构建缓存

Vercel 有构建缓存加速，Cloudflare Pages 也有。首次构建可能稍慢，后续会正常。

### 5.5 Google Search Console

- 迁移后不需要重新验证（域名没变）
- 建议迁移后观察 1-2 周的抓取统计，确认 Googlebot 正常抓取
- 如果发现抓取异常，检查 Cloudflare 的防火墙规则是否误拦截了 Googlebot

### 5.6 Google Analytics

GA 代码在前端，与托管平台无关，迁移后自动继续工作。

### 5.7 @opennextjs/cloudflare 的成熟度

这个适配器目前是 0.x 版本，还在活跃开发中。已知限制：
- 部分 Next.js 高级特性可能不支持（ISR、On-demand Revalidation 等）
- 但你的项目只用了 SSG + middleware + API Routes，这些是基础特性，兼容性较好

如果遇到不兼容的问题，备选方案：
- 回退到 Vercel（代码没改，随时可以切回）
- 或者用 Cloudflare Workers + next-on-pages（另一个社区适配器）

## 六、执行步骤（建议顺序）

| 步骤 | 操作 | 预计耗时 | 可回退 |
|------|------|---------|--------|
| 1 | 安装适配器 + 创建配置文件 | 10 分钟 | ✅ |
| 2 | 本地构建测试（`npm run build:cf`） | 5 分钟 | ✅ |
| 3 | 本地预览测试（`npx wrangler dev`） | 15 分钟 | ✅ |
| 4 | 处理 next/image 兼容性 | 5 分钟 | ✅ |
| 5 | 验证 middleware + API 路由 | 10 分钟 | ✅ |
| 6 | Cloudflare 账号创建 Pages 项目 | 10 分钟 | ✅ |
| 7 | 部署到 Cloudflare（先用临时域名测试） | 5 分钟 | ✅ |
| 8 | 全面测试临时域名上的所有功能 | 20 分钟 | ✅ |
| 9 | DNS 切换（zoxide.org 指向 Cloudflare） | 5 分钟 | ✅（切回 Vercel NS） |
| 10 | 观察 24-48 小时，确认一切正常 | - | ✅ |
| 11 | 删除 Vercel 项目（可选） | 2 分钟 | ❌ |

**总预计改造时间：约 1-2 小时（不含 DNS 生效等待时间）**

## 七、Cloudflare Pages 免费版额度

| 资源 | 免费额度 | 你的项目预估用量 |
|------|---------|----------------|
| 构建次数 | 500 次/月 | 约 10-20 次/月 |
| 请求数 | 无限 | 无限 |
| 带宽 | 无限 | 无限 |
| Workers 调用 | 10 万次/天 | 约 1000-5000 次/天 |
| Workers CPU | 10ms/请求 | 足够 |

对比 Vercel 免费版的 100 小时 Serverless Function 执行时间限制，Cloudflare 的额度宽裕得多。
