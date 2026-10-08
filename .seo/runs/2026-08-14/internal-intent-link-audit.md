# zoxide.org 搜索意图与内链投票审计

审计日期：2026-08-15  
数据窗口：GSC 2026-05-13 至 2026-08-12（92 天）  
范围：144 个 sitemap URL、最终构建 HTML、导航/页脚、正文链接、`GuideLinks`、博客 `RelatedPosts`、英文/中文/日文页面，以及 GSC Query、Page 两张汇总表。

> 2026-08-15 已用两个不重叠的 28 天 Query×Page API 导出完成交叉验证。涉及 fzf、how-to-use 和多语言主页面的原建议已据实修正；详细数据见 [`query-page-cannibalization-validation.md`](../2026-08-15/query-page-cannibalization-validation.md)。

## 结论

项目只做到了“每页都有内链”，没有系统做到“一个意图一个主页面，支持页统一投票”。

技术底座没有大问题：144 个 sitemap URL 都有构建产物；站内没有真正孤儿页；正文链接没有指向 sitemap 之外的内部 URL；链接是可抓取的普通 `<a href>`。主要问题是投票方向失真：几乎所有内容页都通过同一个固定模块，反复投给同四个页面，不管当前页面属于安装、命令、初始化、故障还是对比主题。

最明显的反证是：

| 候选页面 | 英文正文入链来源数 | GSC 展示 | 点击 | 平均排名 |
|---|---:|---:|---:|---:|
| `/blog/zoxide-commands/` | 5 | 12,764 | 218 | 4.25 |
| `/tutorials/basic-commands/` | 34（其中约 30 个来自固定模块） | 655 | 25 | 10.23 |
| `/blog/zoxide-init-guide/` | 13 | 15,116 | 181 | 4.67 |
| `/tutorials/shell-setup/` | 5 | 748 | 6 | 10.85 |
| `/blog/zoxide-fzf-interactive-guide-en/` | 8 | 9,623 | 166 | 4.94 |
| `/tutorials/fzf-integration/` | 33（其中约 30 个来自固定模块） | 4,356 | 300 | 5.48 |
| `/download/` | 11 | 11,747 | 34 | 5.66 |
| `/blog/zoxide-download-guide/` | 3 | 455 | 6 | 6.75 |

以上入链数按最终 HTML 的 `<main>` 区域、去重后的来源页面统计。它说明 Google 已经选出的强页面，与代码中被大量投票的页面并不一致。内链数量本身没有自动把弱页变成主页面；页面意图、内容质量、历史信号和链接语义共同决定结果。

## 已做对的地方

- 首页、博客、教程、下载、FAQ、对比页均有全站导航入口。
- 144 个 sitemap URL 全部至少有一条站内入链，没有真正孤儿 URL。
- 正文内部链接全部落到 sitemap 中的可索引 URL，没有发现正文链接指向错误或非规范路径。
- Markdown 链接与 Next.js 链接均可被 Google 抓取。
- OS 安装页、具体错误页、原理页已具备天然的子意图区分，不应该为追求“唯一页面”而全部合并。
- `RelatedPosts` 已考虑分类、标签、内容信号和人工映射，基础机制可复用。

## 核心问题

### 1. 固定 GuideLinks 把不同主题的票投给同一组 URL

`components/GuideLinks/GuideLinks.tsx` 在三种语言中硬编码了同五个候选：Ubuntu 安装、basic commands、command not found、fzf tutorial、autojump；过滤当前页后固定取前四个。该组件又出现在每个博客详情页和教程详情页。

结果是约 30 个英文内容页无差别地投给 basic commands、command-not-found、fzf tutorial。一个“性能算法”页面也在投 command-not-found，一个“autojump 对比”页也在投 basic commands。这些链接对用户并非完全无用，但不是清晰的主题投票，反而稀释了真正主页面。

### 2. 博客与教程存在同意图双页

最终 HTML 的正文相似度与页面任务同时显示，以下是高置信冲突：

- `/blog/quick-start/` 与 `/tutorials/quick-start/`：相似度约 0.83，都是“五分钟安装、初始化、基本命令”。
- `/blog/advanced-config/` 与 `/tutorials/advanced-config/`：约 0.80，都是高级配置大全。
- `/blog/zoxide-not-working/` 与 `/tutorials/troubleshooting/`：约 0.76，都是通用故障排查。
- `/blog/zoxide-init-guide/` 与 `/tutorials/shell-setup/`：约 0.70，都是 Shell 初始化配置。
- `/blog/zoxide-download-guide/` 与增强后的 `/download/`：都是通用下载、安装、校验、初始化。
- `/blog/zoxide-vs-autojump/` 与 `/comparisons/autojump/`：同一个 exact comparison，后者内容薄、几乎没有搜索表现。

相似度只是辅助证据，最终判定还结合了标题/H1、用户任务、GSC 页面表现和入链结构。

### 3. 相关文章是“相似内容推荐”，不是“支持页投主页面”

`data/blog.ts` 的人工映射和评分能找出相似文章，但没有 `intentKey`、`primaryPath` 或页面角色。因此，同一意图下的两个页面常被当成平级相关文章互相推荐；这会继续强化“两个页面都像主页面”的信号。

### 4. 多语言有少量跨语言投票错误

最终 HTML 中发现 8 条跨语言正文链接：中文/日文 about、contact 页面指向英文首页或英文隐私/条款 URL。数量不大，不是当前排名问题主因，但应修正为当前 locale 的 URL，避免把本地语言信号投回英文页。

## 搜索意图主页面判定

| 搜索意图 | 指定主页面 | 其他页面如何处理 | 判定 |
|---|---|---|---|
| 品牌词 `zoxide` | `/` | features、changelog、about 作为产品支持页 | 保持；首页只负责品牌与总入口，不吞具体教程意图 |
| “what is zoxide” | `/blog/what-is-zoxide-smarter-cd/` | `/blog/stop-using-cd/` 做观点/迁移支持页 | 保留两页；定义与劝服是两个任务 |
| “how to use zoxide” | 暂保 `/blog/mastering-terminal-navigation-zoxide-guide/` 为完整指南 | tutorial quick-start 缩成安装后的 5 分钟验证清单 | Query×Page 显示两页近乎平分 exact query；mastering 赢展示/排名，tutorial 赢点击，先分工再用下一窗口决定是否合并 |
| 通用下载/安装 | `/download/` | OS 教程负责具体平台；下载博客合并后 301 | 需要改；下载页现在最适合承接交易型安装意图 |
| Linux 通用指南 | `/blog/zoxide-linux-en/`（各语言对应页） | Ubuntu、Arch/NixOS 教程承接发行版精确意图 | 不合并；Linux 总览与发行版步骤不同，但总览应减少重复命令、加强向下分流 |
| macOS 安装 | `/tutorials/install-macos/` | 将 mac shell integration 博客的独有补全内容并入后 301 | 需要改；博客正文主体仍是安装，且教程表现明显更强 |
| 快速开始 | `/tutorials/quick-start/` | `/blog/quick-start/` 合并并 301 | 需要改；任务和正文高度重复，教程是明显胜者 |
| 命令参考 | `/blog/zoxide-commands/` | basic commands 改成“10 分钟练习 z/zi”的学习页，并在首段投主参考页 | 需要重新分工，不建议立即删除 basic 页；前者是完整参考，后者可以保留教学任务 |
| `zoxide init` / Shell 集成 | `/blog/zoxide-init-guide/` | shell-setup 的独有清单并入后 301 | 需要改；当前两页任务接近，init 页是明确历史胜者 |
| 高级配置 | `/tutorials/advanced-config/` | `/blog/advanced-config/` 合并并 301 | 需要改；教程更完整且表现更强 |
| `zoxide fzf` / `zi` | `/tutorials/fzf-integration/` | 搬入 fzf blog 独有内容后，三语言对应 blog 301 到 tutorial | Query×Page 证实核心查询持续触发两页；tutorial 在 `zoxide fzf` 上约第 1 位且点击显著更强 |
| 通用“zoxide not working” | 英文：`/blog/zoxide-not-working/`；中文：优先 tutorial | 英文 tutorial 合并到 blog；中文暂不套用英文重定向 | Query×Page 与 92 天汇总显示 locale 胜者不同，必须分语言处理 |
| `command not found` | `/blog/zoxide-command-not-found/` | 从安装、init、平台页精准投票；不再全站通投 | 保留；这是独立的具体错误意图 |
| `no match found` | `/blog/troubleshooting-zoxide-no-match-found/` | 投通用 not-working 和 doctor | 保留；具体错误与通用排查不同 |
| 自助诊断 | `/tools/zoxide-doctor/` | 所有故障页把它作为执行下一步，不把它写成故障内容主页面 | 保留；工具意图与文章意图不同 |
| zoxide alternatives | `/blog/zoxide-alternatives-comparison-open-source/` | `/comparisons/` 只做导航目录 | 保留两页；榜单/选型与目录页不是同一任务 |
| zoxide vs autojump | `/blog/zoxide-vs-autojump/` | `/comparisons/autojump/` 301 到博客 | 需要改；不要为了目录整齐把已经排名的博客迁到弱 URL |
| zoxide vs z / fasd | `/comparisons/z/`、`/comparisons/fasd/` | alternatives 文章投给对应精确对比页 | 保留；属于独立 exact-comparison 意图，只是当前内容与信号偏弱 |
| 性能优化 | `/tutorials/performance/` | performance 博客只讲 rank/frecency 原理 | 保留两页；优化操作与算法解释不同，正文相似度仅约 0.22 |
| 工作原理 | `/blog/how-zoxide-works-en/` | init 页负责操作步骤 | 保留；进程隔离/为何需要 shell hook 是解释型意图 |
| alias / autocomplete | `/blog/zoxide-alias-autocomplete/` | 投 init 与 advanced-config 主页面 | 保留；已有 8,885 展示、202 点击，是独立任务页 |

## 最佳实践改造方案

### A. 建立“意图注册表”，不要再硬编码统一推荐

给每个可索引内容页增加以下元数据：

```ts
type SearchIntent = {
  intentKey: string;
  role: 'primary' | 'support' | 'hub' | 'tool';
  primaryPath: string;
  parentIntent?: string;
  nextIntents: string[];
  anchorVariants: string[];
};
```

`GuideLinks` 改为按当前页的 `intentKey` 和 `role` 生成：

- 支持页：正文中一次、文末一次投给同意图主页面。
- 主页面：向具体子问题、下一步任务、工具页分流，不投给同意图重复页。
- Hub：只投每个主题的主页面，不把所有历史文章平铺成同等级。
- 每页通常推荐 3–5 个真正相关目标；不是越多越好。
- 锚文本用自然变体，描述目标页任务；不要所有页面机械重复 exact-match 关键词。

### B. 先纠正投票，再做 301 合并

第一批直接调整内链：

- 全站“commands”相关链接从 `/tutorials/basic-commands/` 改投 `/blog/zoxide-commands/`；仅学习路径保留 basic lesson。
- 安装/下载正文统一投 `/download/`；平台精确词投对应 OS 教程。
- Shell、init、config issue 统一投 `/blog/zoxide-init-guide/`。
- 通用故障投 `/blog/zoxide-not-working/`；具体错误只投自己的精确错误页。
- generic fzf、`zi`、fzf error 统一投 `/tutorials/fzf-integration/`。
- alternatives 文章投 autojump、z、fasd 三个精确对比；comparisons hub 投四个主页面。

第二批合并高置信重复页，并使用单跳永久重定向：

1. `/blog/quick-start/` → `/tutorials/quick-start/`
2. `/blog/advanced-config/` → `/tutorials/advanced-config/`
3. `/tutorials/shell-setup/` → `/blog/zoxide-init-guide/`
4. `/tutorials/troubleshooting/` → `/blog/zoxide-not-working/`
5. `/blog/zoxide-download-guide/` → `/download/`
6. `/comparisons/autojump/` → `/blog/zoxide-vs-autojump/`
7. `/blog/install-zoxide-mac-shell-integration-completion/` → `/tutorials/install-macos/`（先搬独有内容）
8. 三语言对应的 fzf blog → 对应 `/tutorials/fzf-integration/`（高流量簇，单独一批）

每个旧 URL 都应：从 sitemap 和 hreflang 集群移除；所有站内链接改到新 URL；返回 301/308 到最终 URL；避免重定向链；目标页保留自引用 canonical。

### C. 对灰区只分工，不贸然合并

以下页面即使补了 Query×Page，也仍应先分工而不是立即删除：

- mastering how-to 与 tutorial quick-start：exact `how to use zoxide` 近乎平分，展示/排名与点击信号相反；先把 tutorial 缩成 post-install checklist，再观察 28 天。
- basic commands：有 25 点击且 CTR 3.82%，可转成真正的初学者练习页，而完整参考由 commands 博客承担。
- Linux 总览与 Ubuntu/Arch/NixOS：平台层级不同，应形成父子结构。
- what-is、stop-using-cd、how-to-use：分别是定义、劝服、实操总览，不是同一意图。
- performance tutorial、rank algorithm、how-zoxide-works：分别是优化、算法、Shell 机制。

### D. 修正多语言结构

- 意图注册表使用共享 `intentKey`，但 `primaryPath` 必须按 locale 映射，不能默认跳回英文。
- 修复 about/contact 中 8 条跨语言正文链接。
- 合并页面时三种语言分别判断历史胜者；英文数据不能自动替代中文/日文判断。
- Query×Page 已确认：英文 commands 主页面是 commands blog，中文 generic usage 当前主页面是 basic tutorial；英文通用 troubleshooting 主页面是 not-working blog，中文当前更偏 tutorial。
- 如果某语言没有对应支持页，直接链接该语言的主页面，不跨语言制造“假配对”。

## 实施顺序与验收

### P0：一周内

1. 新增意图注册表，替换固定 `GuideLinks`。
2. 保护 GSC 已验证的主页面：commands、init、download、英文 not-working、autojump 博客，以及三语言 fzf tutorial。
3. 修复 8 条跨语言正文链接。
4. 博客/教程 hub 按主题簇展示主页面，而不是只按内容类型平铺。

### P1：随后分批

1. 先搬独有内容，再部署上述 8 组永久重定向；低量中文/日文簇按 locale 单独判断。
2. 每批只处理 2–3 个意图簇，便于定位波动原因。
3. fzf 合并应单独一批，避免与其他高流量簇混发。

### 数据验收

两个不重叠的 28 天 Query×Page API 窗口已经完成验证。它确认了 fzf 的真实竞争、download/quick-start/init/autojump 的稳定强弱关系，以及英文和中文不能共用同一套主页面映射。原始查询仍受隐私阈值影响：两个窗口只覆盖全站约 39.7% 和 49.0% 的展示，因此低量 locale 仍只做保守处理。完整复核见 [`query-page-cannibalization-validation.md`](../2026-08-15/query-page-cannibalization-validation.md)。

上线后按 7 天观察抓取/索引异常，按 28 天评价：主页面展示占比、点击、非品牌 CTR、目标 Query 的 URL 稳定性。不要用全站平均排名作为唯一验收指标。

## 不建议做的事

- 不要因为 URL 在 `/tutorials/` 下，就把已有强势博客迁过去；保留赢家比目录整齐重要。
- 不要把所有相近词都合成一页；“父主题—子任务—具体错误—工具”可以是合理的多页结构。
- 不要给每个页面塞相同四个关键词锚文本；这不是精准投票。
- 不要只改 canonical 而保留重复页和旧内链；真正废弃重复页时，永久重定向是更明确的信号。
- 不要对重复页使用 `noindex` 来代替合并。
- 不要一次性重定向全部内容簇；分批才能识别收益或损失来自哪里。

## 官方依据

- Google 明确说明，链接用于发现页面并帮助判断相关性；内部链接应放在语境中，锚文本应简洁、描述性强、与来源页和目标页都相关：[SEO Link Best Practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- 对重复或高度相似页面，永久重定向是强 canonical 信号，sitemap 只是弱信号；站内应始终链接到规范 URL：[Consolidate Duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- Google 也强调链接只是多个信号之一，PageRank 并非全部；没有“多塞几条内链就一定排名”的公式：[SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
