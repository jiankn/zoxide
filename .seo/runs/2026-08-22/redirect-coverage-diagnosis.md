# GSC“网页会自动重定向”诊断

日期：2026-08-22

数据源：`zoxide.org-Coverage-Drilldown-2026-08-22.zip`

模式：首次 dry run，仅诊断，不修改站点

## 结论

GSC 中的 99 个 URL 不是 99 个需要被索引的页面，而是 Google 已发现的非规范 URL。它们当前会重定向到可返回 200 的规范页面，因此“网页会自动重定向”多数是正常状态，不应通过删除重定向、添加 `noindex` 或请求索引原 URL 来“消除”。

需要做的是：确保 sitemap、canonical、hreflang 和站内链接只暴露最终规范 URL；保留旧 URL 的永久重定向；尽量把两跳链压缩为一跳。

## GSC 数据摘要

- 受影响 URL：99
- 2026-08-08：57
- 2026-08-11：97
- 2026-08-15：99
- 最近抓取日期主要集中在 2026-08-08 至 2026-08-18

URL 特征（各项有重叠）：

- HTTP 版本：2
- `www` 主机版本：9
- 默认英文仍带 `/en`：39
- 缺少尾斜杠：71
- 已合并内容的旧路径：14
- 同时包含两个或以上非规范因素：33
- 仅因缺少尾斜杠而跳转：43

## 当前站点核验

线上 `https://zoxide.org/sitemap.xml`：

- URL 总数：128
- 非 HTTPS：0
- `www` 主机：0
- 默认英文 `/en` 前缀：0
- 缺少尾斜杠：0
- 与 GSC 这 99 个 URL 精确重合：0

仓库配置与 sitemap 一致：

- `next.config.ts` 使用 `trailingSlash: true`
- `i18n/routing.ts` 使用 `localePrefix: 'as-needed'`，英文规范地址不带 `/en`
- `app/sitemap.ts` 生成 `https://zoxide.org`、带尾斜杠的 URL，并排除会重定向的内容路径
- `lib/seo/metadata.ts` 生成相同 URL 形态的 canonical 与 hreflang

线上抽查结果：

- `http://zoxide.org/` → `https://zoxide.org/` → 200（1 跳）
- `http://www.zoxide.org/` → `https://zoxide.org/` → 200（2 跳）
- `https://www.zoxide.org/` → `https://zoxide.org/` → 200（1 跳）
- `https://zoxide.org/en/` → `https://zoxide.org/` → 200（1 跳）
- `https://zoxide.org/en` → `https://zoxide.org/` → 200（2 跳）
- `https://zoxide.org/tutorials/fzf-integration` → 带尾斜杠版本 → 200（1 跳）
- `https://zoxide.org/tutorials/shell-setup` → `https://zoxide.org/blog/zoxide-init-guide/` → 200（2 跳）
- `https://zoxide.org/zh/comparisons/autojump/` → `https://zoxide.org/zh/blog/zoxide-vs-autojump/` → 200（1 跳）

## 原因判断

### 1. 正常的域名规范化

HTTP 和 `www` URL 本来就不应被单独索引。它们永久跳转到 `https://zoxide.org` 是正确行为。报告中保留这些历史 URL 是正常的。

### 2. 默认语言 URL 规范化

当前策略是英文无前缀，因此 `/en/...` 应跳到 `/...`。GSC 的 39 个 `/en` URL 是旧格式或替代格式，不应恢复成可索引页面。

`app/page.tsx` 仍包含 `redirect('/en/')`，它与当前 `localePrefix: 'as-needed'` 的规范策略相冲突。虽然线上根地址目前直接返回 200，但应移除这项矛盾的兜底逻辑，避免未来中间件/部署顺序变化后重新产生 `/en/`。

### 3. 尾斜杠规范化

站点当前选择带尾斜杠。71 个无尾斜杠 URL 被重定向是预期行为。当前 sitemap 和抽查页面的 HTML 已输出带斜杠 URL，说明主要是历史发现记录；仍应继续扫描数据源、搜索 API、Markdown 原文和外部资料中的无斜杠地址。

### 4. 内容合并后的永久重定向

14 个 URL 命中内容合并规则，例如：

- `/blog/zoxide-download-guide` → `/download/`
- `/blog/quick-start` → `/tutorials/quick-start/`
- `/comparisons/autojump` → `/blog/zoxide-vs-autojump/`
- `/blog/zoxide-fzf-interactive-guide-en` → `/tutorials/fzf-integration/`
- 英文 `/tutorials/shell-setup` → `/blog/zoxide-init-guide/`
- 英文 `/blog/advanced-config` → `/tutorials/advanced-config/`

这些旧 URL 应继续永久重定向。不要为了让 GSC 报告归零而恢复重复页面。

## 建议处理顺序

1. 保留现有 301/308；确认每个旧内容 URL 都跳到语义最接近的最终页面，而不是统一跳首页。
2. 移除或重构 `app/page.tsx` 中的 `/en/` 重定向兜底，使根路由和 `localePrefix: 'as-needed'` 只有一个规范策略。
3. 把 Markdown/翻译数据里的旧内容链接直接改成最终目标。当前渲染组件会在输出时修正它们，但源数据仍包含旧路径，其他消费者可能绕过该组件。
4. 对站内所有可抓取 HTML、结构化数据、canonical、hreflang、导航、搜索结果和 sitemap 做一次“重定向目标扫描”，要求内部 URL 直接返回 200。
5. 如需优化抓取效率，再合并两跳链：让 `http://www` 一步到 `https://zoxide.org`；让“无尾斜杠 + 内容旧路径”一步到最终内容 URL。该项是优化，不是索引故障修复。
6. 在 GSC 重新提交当前 sitemap；用 URL 检查工具检查最终规范 URL，而不是重定向源 URL。完成站内引用清理后再点“验证修复”。

## 不建议的操作

- 不要取消 HTTP、`www`、`/en` 或旧内容 URL 的永久重定向。
- 不要给重定向 URL 加 `noindex`；重定向响应本身也没有可用的 HTML `noindex`。
- 不要在 robots.txt 中屏蔽这些 URL，否则 Google 无法重新抓取并确认跳转。
- 不要使用 GSC 临时移除工具来清理这种正常的历史 URL。
- 不要请求索引重定向源 URL；只请求检查/索引最终 200 URL。

## 验收标准

- sitemap 中所有 URL 直接返回 200。
- 页面 canonical 和 hreflang 指向直接返回 200 的 URL。
- 站内可抓取链接不指向 3xx。
- 所有旧 URL 最多一跳到相关的最终 200 页面（两跳可接受，但应逐步压缩）。
- GSC 中最终页面可索引；“网页会自动重定向”的历史数量可能在数周或更久后才下降，也可能长期保留少量正常记录。
