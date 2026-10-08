# Query × Page 搜索意图与 URL 竞争复核

复核日期：2026-08-15  
对比窗口：

- Previous：2026-06-18 至 2026-07-15，2,169 个 Query×Page 行
- Recent：2026-07-16 至 2026-08-12，1,895 个 Query×Page 行

本报告是对 `2026-08-14/internal-intent-link-audit.md` 的交叉验证，并修正其中缺少 Query×Page 数据时的推断。

## 数据质量与口径

- 两个文件均没有空 Query、空 Page、重复 Query×Page 组合、非正展示或错误 CTR。
- 所有行的日期窗口一致；CTR 均能由 clicks / impressions 精确复算。
- 分析时统一了有无尾斜杠的 URL，但没有把不同语言 URL 合并。
- “同一 Query 多 URL”指同一个 28 天窗口中，同一查询至少出现在两个候选 URL 上；它不代表同一次搜索一定同时展示两页。
- “窗口切换”指候选页面中展示量最高的 URL 在两个窗口间改变。只有两个窗口各至少 5 展示，才计为冲突簇内的有意义切换。

数据仍受 GSC 查询隐私阈值影响。Query×Page 文件只覆盖：

| 窗口 | 已披露展示 / 全站展示 | 展示覆盖 | 已披露点击 / 全站点击 | 点击覆盖 |
|---|---:|---:|---:|---:|
| Previous | 26,426 / 66,525 | 39.7% | 910 / 1,652 | 55.1% |
| Recent | 19,959 / 40,774 | 49.0% | 731 / 1,373 | 53.2% |

因此，下述结论能证明已披露查询的 URL 分布，但不能把未披露长尾当作零。

## 总结结论

### 被数据确认的合并方向

- Download：`/download/` 明确压倒 download blog。
- Quick-start 双页：tutorial 明确压倒 `/blog/quick-start/`。
- Init：英文 init blog 明确压倒 shell-setup。
- Advanced config：英文 tutorial 明确压倒同名 blog，虽然数据量较低。
- General troubleshooting：英文 not-working 有数据，tutorial 完全没有披露 Query×Page 数据。
- Autojump：现有 blog 明确压倒新 `/comparisons/autojump/`。
- macOS 安装：tutorial 有稳定数据，mac install blog 在两个窗口都没有披露行。

### 需要修正上次建议的簇

1. **fzf 应由 tutorial 做主页面。** 上次因 blog 展示较多，暂定 blog 为主并建议先分工；Query×Page 证明核心查询由两页持续竞争，而 tutorial 在核心词上的排名和点击显著更好。应把 blog 独有内容并入 tutorial，再把 blog 永久重定向到 tutorial。
2. **“how to use”存在第三组真实冲突。** `/blog/mastering-terminal-navigation-zoxide-guide/` 与 `/tutorials/quick-start/` 几乎平分 exact query。当前一个赢展示/排名，另一个赢点击，尚不足以安全选定 301 目标。先明确分工，再用下一窗口决定是否合并。
3. **不能把英文主页面机械复制到中文/日文。** 中文 commands 和 troubleshooting 的胜者与英文不同；主页面映射必须按 locale 维护。

## 英文冲突簇数据

“主页面份额”只在表中列出的两个候选页面之间计算，指标为已披露展示。

| 簇 | 候选主页面 | Previous 主份额 / 同查双页数 | Recent 主份额 / 同查双页数 | 有意义切换 | 结论 |
|---|---|---:|---:|---:|---|
| commands | `/blog/zoxide-commands/` | 76.4% / 5 | 92.1% / 10 | 1（品牌词） | blog 主；basic tutorial 改教学支持页，不急着删 |
| init | `/blog/zoxide-init-guide/` | 97.9% / 8 | 93.2% / 13 | 0 | 英文 shell-setup 合并并 301 |
| fzf | 两页待比较 | blog 61.7% / 17 | blog 65.9% / 16 | 3 | 总展示偏 blog，但核心词质量显著偏 tutorial；tutorial 做主并合并 blog |
| download | `/download/` | 99.9% / 1 | 98.5% / 9 | 0 | download blog 301 到 download |
| quick-start | `/tutorials/quick-start/` | 89.4% / 9 | 80.7% / 9 | 0 | `/blog/quick-start/` 301 到 tutorial |
| advanced-config | `/tutorials/advanced-config/` | 90.0% / 1 | 66.2% / 4 | 0 | 英文 blog 合并到 tutorial；低量，分批处理 |
| general troubleshooting | `/blog/zoxide-not-working/` | 100% / 0 | 100% / 0 | 0 | 英文 tutorial 合并到 blog |
| autojump | `/blog/zoxide-vs-autojump/` | 100% / 0 | 91.4% / 2 | 0 | `/comparisons/autojump/` 301 到既有 blog |
| macOS install | `/tutorials/install-macos/` | 100% / 0 | 100% / 0 | 0 | mac install blog 合并到 tutorial |
| how-to-use | `/blog/mastering-terminal-navigation-zoxide-guide/` | 83.4% / 26 | 77.0% / 18 | 0 | 有冲突但胜者信号矛盾；先分工测试，不立即 301 |

“同查双页数”增加有时只是低量 Query 跨过披露阈值。例如 commands 的双页查询从 5 增至 10，但 basic page 的总披露展示从 105 降到 23；这不是 basic 变强。

## 逐簇判定

### 1. Commands / Basic commands

页面总量：

- Commands blog：340 → 268 展示，4 → 3 点击。
- Basic tutorial：105 → 23 展示，两个窗口均 0 个已披露点击。
- 主页面份额：76.4% → 92.1%。

核心查询 `zoxide commands`：

| 窗口 | Commands blog | Basic tutorial |
|---|---|---|
| Previous | 2/21，位置 3.57 | 0/11，位置 7.91 |
| Recent | 1/17，位置 2.53 | 0/8，位置 8.62 |

结论：英文 command reference 明确由 blog 承接。Basic tutorial 可以保留，但必须改成独立的“练习 z、zi 的初学者课程”，正文开头链接完整 command reference；首页和通用 `GuideLinks` 不应再把 command-reference 投票给 basic tutorial。

多语言例外：中文 `zoxide 使用` 在 previous 全部落到 `/zh/tutorials/basic-commands/`（1/19，位置 4.11），recent 仍是该页 10 展示；中文不应照搬英文主页面。

### 2. Init / Shell setup

- Init blog：694 → 547 展示，19 → 19 点击。
- Shell-setup：15 → 40 展示，两个窗口均 0 点击。
- Init 主份额仍为 97.9% → 93.2%；没有有意义的主 URL 切换。
- Exact `zoxide init` 的 recent 数据中，init blog 为 9/36、位置 1.39；shell-setup 没有该查询披露行。

结论：英文 shell-setup 增长的是无点击的次级展示，不是赢得主意图。将独有检查清单并入 init blog 后做 301。中文/日文数据过低，不能单凭英文结果自动迁移。

### 3. fzf：明确存在真实竞争，主页面改为 tutorial

页面总量显示 blog 展示略多，但核心查询的效率完全不同：

`zoxide fzf`：

| 窗口 | Fzf blog | Fzf tutorial |
|---|---|---|
| Previous | 6/88，位置 3.67 | 39/96，位置 1.02 |
| Recent | 8/61，位置 3.36 | 25/60，位置 1.02 |

`zoxide fzf integration`：

| 窗口 | Fzf blog | Fzf tutorial |
|---|---|---|
| Previous | 1/21，位置 4.19 | 3/20，位置 1.00 |
| Recent | 1/7，位置 4.14 | 3/7，位置 1.00 |

两个窗口分别有 17、16 个 Query 同时触发两页，并出现 3 个有意义的赢家切换：`zoxide fzf`、`zoxide fzf integration`、`could not find fzf`。但 tutorial 在核心词上始终接近第 1 位且点击显著更高，所以不能按总展示量把 blog 当主页面。

多语言同样支持 tutorial：

- 日文 exact `zoxide fzf`：tutorial 两窗分别 7/24@1.21、6/18@1.00；blog 为 2/29@4.28、1/21@3.90。
- 中文：previous 只有 tutorial 获得 fzf 相关展示；recent blog 仅 2 展示，tutorial 13。

修正建议：三种语言都把 `/tutorials/fzf-integration/` 作为核心 fzf/zi 主页面；搬入 blog 中有价值的独有案例，然后把 locale 对应的 fzf blog 301 到 tutorial。该簇流量较高，应单独一批部署和观察。

### 4. Download / Download guide

- Download 主份额：99.9% → 98.5%。
- Download blog：2 → 21 展示，仍为 0 点击；没有任何有意义切换。
- Recent exact `zoxide download` 中，download 为 1/3@2.67，首页 0/3@2.33，download blog 没有披露行。

结论：download blog 是稳定弱重复，合并到 `/download/`。中文 download 对 pair 的份额为 69% → 72%，日文为 100% → 98%，三种语言方向一致。

需要注意：本数据截止 8 月 12 日，早于 8 月 14 日 download 页面新增安装包链接的部署，因此不能用本窗口评价新版 download 页效果。Generic `install zoxide` 当前仍由首页和 Windows 教程获得大量展示；先让新版 download 跑满一个 28 天窗口，不要立即大改首页。

### 5. Quick-start 与 How-to-use

明确的弱重复：

- Tutorial quick-start：210 → 159 展示、9 → 7 点击。
- Blog quick-start：25 → 38 展示、1 → 0 点击。
- Tutorial pair 份额：89.4% → 80.7%；没有有意义切换。

因此 `/blog/quick-start/` 应合并到 `/tutorials/quick-start/`。

但 tutorial quick-start 还与 mastering page 竞争 `how to use zoxide`：

| 窗口 | Mastering page | Tutorial quick-start |
|---|---|---|
| Previous | 0/90@3.53 | 3/72@4.57 |
| Recent | 0/73@3.38 | 3/70@4.03 |

Mastering page 赢展示和少量排名，tutorial 赢点击。当前不能只凭一个指标删除其中一页。最佳做法是：

- Mastering page：完整 `how to use zoxide` 主指南，覆盖匹配、查询、排错和下一步分流。
- Tutorial quick-start：缩成“安装后的 5 分钟验证清单”，只解决初始化、第一次跳转和 `zi` 验证；开头链接完整 how-to guide。
- 下一 28 天再次看 exact `how to use zoxide`。若仍接近 50/50，再根据点击份额与用户行为选择最终合并目标。

### 6. Advanced config

- Tutorial：45 → 43 展示；blog：5 → 22；两页均无 recent 点击。
- Pair 主份额由 90% 降到 66%，但总量很低、没有有意义切换。
- Exact `zoxide config` 的 recent 数据是首页 1/17@2.06、tutorial 0/17@4.94；blog 没有进入主要结果。

结合约 0.80 的正文相似度，英文 blog 仍建议并入 tutorial。优先级低于 fzf/download/init。中文、日文几乎没有 Query×Page 数据，暂不做 locale 级 URL 删除。

### 7. Troubleshooting 与具体错误页

英文通用 troubleshooting：not-working 为 143 → 77 展示；tutorial 两窗均无披露行。因此英文 tutorial 合并到 not-working 的判断成立。

但“通用故障页”和“具体错误页”不应该合并：

- Exact `zoxide: no match found` 的 recent 主页面是 no-match 专页：7/35@1.31。
- 同一查询还触发 command-not-found：1/32@4.72，以及 not-working：0/16@8.38。
- No-match 专页在与通用页的 pair 中，份额从 77.8% 升至 86.7%。
- `zoxide z command not found` 则由 command-not-found 专页稳定赢得点击和第 1 位附近排名。

结论：保留 command-not-found、no-match、general not-working 三层结构，但收紧职责：

- no-match 页独占数据库匹配错误；command-not-found 页删除或缩短 no-match 解决内容，改为早期链接专页。
- command-not-found 独占 PATH、二进制、`z`/`zi` 未定义。
- not-working 改成诊断 hub，摘要后分流，不复制两个具体错误页的完整解法。
- “detected a possible configuration issue” 当前在 command-not-found 与 not-working 间切换，最合适的落点是 init guide；两页应以描述性锚文本投向 init 的对应错误章节。

中文是明显例外：92 天汇总中 `/zh/tutorials/troubleshooting/` 为 81 展示、9 点击，`/zh/blog/zoxide-not-working/` 为 45 展示、3 点击。不要把英文重定向规则全局套到中文；中文应优先保留 tutorial 作为通用故障主页面。

### 8. Autojump

- 既有 autojump blog：186 → 149 展示、13 → 13 点击。
- 新 comparison page：0 → 14 展示、始终 0 点击。
- Recent 仅两个 exact 查询同时触发两页：`zoxide vs autojump` 和 `autojump vs zoxide`；blog 位置约 1.2–1.3，comparison page 约 4.3–4.9。

结论：`/comparisons/autojump/` 应 301 到既有 blog，不能为了目录整齐迁移赢家。

另有两类正常但需要收敛的父子重叠：alternatives roundup 获得约 26%–30% autojump 意图展示，comparisons hub 获得约 18%–20%。两者可以保留，但只做摘要和导航，使用明确锚文本投给 autojump exact comparison；不要在标题/H1中把 autojump exact query 写成自身主目标。

## 窗口间切换的整体判断

仅看英文 URL：

- Previous：516 个已披露 Query，312 个在多个英文 URL 上出现；其中 224 个 Query 的全站展示至少 10。
- Recent：475 个已披露 Query，259 个在多个英文 URL 上出现；其中 185 个展示至少 10。
- 两窗共有 Query 中，44 个展示量最高的英文 URL 改变；要求两个窗口各至少 10 展示后，剩 20 个。

这个比例不能直接叫“全站严重内耗”。品牌词会产生 sitelink，多语言/平台页可对应不同子意图，GSC 也会对同站多个搜索元素分别记录展示。20 个有意义切换中，很多是合理的目标变化，例如 `brew zoxide` 在 download 与 macOS tutorial 间、`ubuntu zoxide` 转到 Ubuntu tutorial。

真正需要优先处理的切换是：

- `zoxide fzf`：tutorial → blog（展示仅差 1，但 tutorial 点击和排名持续更好）。
- `zoxide fzf integration`：blog → tutorial。
- `could not find fzf`：blog → tutorial。
- `zoxide usage`：首页 → quick-start，提示 how-to 内容簇仍需重新分工。
- `zoxide alternatives`：alternatives roundup → autojump blog，说明 exact comparison 内容正在侵入 generic alternatives。
- `detected a possible configuration issue`：command-not-found ↔ not-working，应该统一投向 init guide 的错误章节。

## 修订后的实施顺序

### P0：先改内链角色，不动灰区 URL

1. 用 locale-aware `intentKey` / `primaryPath` 替换固定 `GuideLinks`。
2. 英文 commands 投 `/blog/zoxide-commands/`；中文 generic usage 投 `/zh/tutorials/basic-commands/`。
3. Init、具体错误、autojump、download 全部链接到各自已验证主页面。
4. General troubleshooting 只做 hub，具体错误页互不复制完整解法。

### P1：高置信合并

1. 三语言 fzf blog → 对应 `/tutorials/fzf-integration/`（单独一批）。
2. Download blog → `/download/`。
3. Blog quick-start → tutorial quick-start。
4. `/comparisons/autojump/` →既有 autojump blog。
5. mac install blog → `/tutorials/install-macos/`。
6. 英文 shell-setup → init blog；英文 troubleshooting tutorial → not-working blog。
7. 英文 advanced-config blog → tutorial（低优先级）。

每次先搬独有内容、改完所有站内链接和 hreflang，再做单跳 301/308，并从 sitemap 移除旧 URL。

### P2：一个窗口后再决策

- Mastering vs tutorial quick-start：先做分工与标题/正文边界，再比较 exact `how to use zoxide`。
- Basic commands：英文保留教学角色；中文保留主页面角色；日文数据不足。
- 新版 download：从 2026-08-14 部署日起跑满 28 天再评价 install/download 主页面份额。
- 中文/日文低量簇：没有足够 Query×Page 数据时不做批量 URL 删除。

## 验收指标

下一轮继续导出同样的 Query×Page 维度，重点看：

- 核心 query 的指定主 URL 展示份额是否达到并稳定在 70% 以上。
- 旧 URL 是否停止获得展示，301 是否直接落到最终主 URL。
- 主 URL 的点击是否至少守住合并前两页点击总和的合理区间。
- fzf exact queries 的 tutorial 位置是否保持约第 1 位。
- `how to use zoxide` 是否从近 50/50 分裂变成明确分工。
- 不用全站平均排名判断这轮改造成败。
