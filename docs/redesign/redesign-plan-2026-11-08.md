# zoxide.org 改版：完整设计与改动清单（2026-11-08）

选定方案：**A 配置生成器做首页 + B 排名模拟器做第二个工具**。
设计方向契约：`.impeccable/surfaces/app-locale-page-tsx.md`（线路图世界，seed:99a674a66cb96355）。
产品背景：`PRODUCT.md`。效果样稿：`docs/redesign/zoxide-redesign-options-2026-11-08.html`。

---

## 一、改版要达成什么

| 访客看到的变化 | 对 AdSense“低价值内容”的回应 |
|---|---|
| 打开首页就能选系统和 shell，直接拿到按顺序排好的命令 | “提供真实、高质量的工具或服务” |
| 每套命令旁边有一张测试回执：在哪台机器、什么版本、哪天跑的，能点开原始记录 | “实质性的独特价值”，README 给不了 |
| 能在网页里模拟 zoxide 的打分，看懂“为什么 z 跳到了那个目录” | 全网独有的互动内容，提高停留和互动 |
| 没测过的组合明确写“还没测” | 可信度，避免再出现“虚构功能”类问题 |

**不变的**：所有现有 URL、三语、非官方声明、站长署名、隐私/条款/关于/联系页。

---

## 二、信息架构

### 导航（新）

| 位置 | 文案（英） | 指向 | 说明 |
|---|---|---|---|
| 1 | Setup builder | `/` | 原 “Install & set up” 指向 /download，改指首页 |
| 2 | Fix a problem | 现排错页 | 不变 |
| 3 | How z ranks | `/tools/ranking-simulator/` | **新页面** |
| 4 | Commands | 现命令页 | 不变 |
| 5 | Compare | 现对比页 | 不变 |
| 6 | zoxide-doctor | 现工具页 | 不变 |

### 页面去留

| 页面 | 处理 |
|---|---|
| 首页 `/` | **重做**：生成器放在首屏，原有 H1、title、全部指南段落和 6 个锚点原样保留在生成器下方（实施时改为不压缩，见文末“实施记录”） |
| `/download` | 保留 URL（承接 “zoxide download” 搜索）。去掉现有 SetupJourney 选择器，改为：版本文件表 + 校验说明 + “按环境生成命令”跳回首页（带参数预选） |
| 安装教程 4 篇（Windows / macOS / Ubuntu / Arch·NixOS） | 保留 URL 和正文。顶部加一个**预选好的精简生成器**（例如 macOS 页默认 macOS + zsh），正文的测试环境表改用统一的“回执”样式 |
| `/tools/ranking-simulator/` | **新增**，三语 |
| 排错相关 3 篇（not working / command not found / no match） | 正文保留；在“跳错目录 / no match”段落插入模拟器入口，预置对应场景 |
| 其余博客、FAQ、对比 | 内容不动，只换视觉系统 |

> 这里修正一下样稿对比表里“安装教程并入生成器”的说法：安装教程是第 2–4 名的流量页，合并会丢排名，所以改为“保留页面、顶部嵌生成器”。

---

## 三、首页设计

### 首屏（电脑 1440 宽）

```
┌ 海军蓝导航条 ─────────────────────────────────────────────────────┐
│ ◎ zoxide.org  Unofficial guide │ Setup builder* │ Fix │ How z ranks … │
├──────────────────────────────────────────┬────────────────────────┤
│ H1  A zoxide setup that works on your     │ Already installed?      │
│     machine                               │  z: command not found   │
│ 一句说明                                  │  no match found         │
│ System  [macOS][Ubuntu/WSL][Windows][Arch][NixOS]  z opens the wrong folder → 模拟器 │
│ Shell   [zsh][bash][fish][PowerShell]     │  npx zoxide-doctor      │
│ Options [ ] Replace cd  [ ] fzf picker    ├────────────────────────┤
│                                           │ Test receipt（随选择变）│
│ ●━ 1 Install the binary   [命令][Copy]    │  ● Tested · 4 steps     │
│ ┃                                         │  Where / zoxide / Shell │
│ ●━ 2 Hook it into zsh …                   │  Run on / Raw record →  │
└──────────────────────────────────────────┴────────────────────────┘
```

### 首屏以下（从上到下）

1. 线路剩余两站：3 Check it loaded、4 Make your first jump（含预期输出样例，取自实测记录）。
2. **“What just happened”**：用 3 小段解释四步各自做了什么（来自现有 home-guide 内容精简，不是新写）。
3. **测试矩阵**：一张表列出所有组合的测过/未测状态，点任意一格 = 切换生成器。这张表就是“持续维护”的证据，每次重测更新日期。
4. 进一步阅读：fzf、配置、命令参考三条链接。
5. 页脚（非官方声明 + 官方 GitHub 链接）。

### 手机（375 宽）

导航只留 logo + 当前项 + 菜单按钮；分段按钮自动换行；回执卡移到四步命令**上方**的一行摘要（“Tested on macOS 26.6.2 · zsh 5.9 · 2026-09-30 ›”），点开展开；症状列表移到线路下方。

---

## 四、配置生成器规格

### 输入

| 控件 | 选项 | 默认 |
|---|---|---|
| System | macOS / Ubuntu·Debian·WSL / Windows / Arch / NixOS | 按 URL 参数；无参数时 macOS |
| Shell | zsh / bash / fish / PowerShell（按系统过滤可选项） | 随系统：macOS→zsh，Ubuntu/Arch/NixOS→bash，Windows→PowerShell |
| Replace cd | 勾选后 init 加 `--cmd cd`，后续命令里的 z/zi 换成 cd/cdi | 关 |
| fzf picker | 勾选后安装步骤加装 fzf，第一跳加 zi 示例，并显示版本提醒 | 关 |
| Install method（第二期） | 例如 Ubuntu 的 install script / apt；NixOS 的系统模块 / Home Manager | 推荐项 |

- URL 同步：`/?os=ubuntu&shell=zsh&cd=1&fzf=1`，可分享、可被安装教程和 /download 链入。canonical 永远是 `/`，参数不进 sitemap。
- 无 JS：服务端先渲染默认组合的完整四步命令（爬虫和审核员看到的是真命令，不是空壳），其它组合靠 JS 切换。

### 输出（四站）

| 站 | 内容 | 来源 |
|---|---|---|
| 1 Install | 安装命令（+ fzf） | `data/task-guides.ts` 现有 setupPlatforms 扩展 |
| 2 Hook | 写到哪个文件 + init 行；zsh 提示放在 compinit 之后；macOS bash 提示 login/non-login 区别；NixOS 给 `programs.zoxide.enable = true;` 配置片段 | 现有 shellSetup、profileFor、arch-nixos 证据 |
| 3 Check | `zoxide --version` + `type z` / `functions z`（fish）/ `Get-Command z` | 现有 shellSetup.check |
| 4 First jump | add → z → pwd；勾 fzf 时加 zi | 现有 firstJump |

### 测试回执（全部来自已有实测，不新编）

| 组合 | 环境 | zoxide | Shell | 日期 | 原始记录 |
|---|---|---|---|---|---|
| macOS · zsh | macOS 26.6.2 arm64，Homebrew 6.0.22 | 0.10.0 | zsh 5.9 | 2026-09-30 | 无归档（教程内有输出摘录） |
| macOS · bash | 同上 | 0.10.0 | bash 3.2.57（系统自带，已检查） | 2026-09-30 | 同上 |
| Windows · PowerShell | Windows 11 Pro 23H2（22631），winget | 0.10.0 | PowerShell 7.6.6 | 2026-09-30 | 无归档 |
| Ubuntu · bash / zsh | ubuntu:24.04 容器，官方安装脚本 | 0.10.0 | bash 5.2.21 / zsh 5.9 | 2026-10-08 | /evidence/2026-10-08/ |
| Ubuntu · fish | 同上 | 0.10.0 | fish 3.7.0 | 2026-10-08 | /evidence/2026-10-08/command-init.json |
| Arch · bash / zsh / bash --cmd cd | archlinux:base 容器 | 0.10.0-1 | bash 5.3.20 / zsh 5.9.2 | 2026-10-09 | /evidence/2026-10-09/arch-nixos.json |
| NixOS · 系统模块（bash、zsh） | NixOS 26.05 虚拟机 | 0.9.9 | bash 5.3.9 / zsh 5.9.1 | 2026-10-09 | 同上 |
| NixOS · Home Manager（bash，--cmd cd） | 同上 | 0.9.9 | bash 5.3.9 | 2026-10-09 | 同上 |
| 其余组合（如 macOS · fish、Windows · bash） | — | — | — | — | 显示 “Not tested yet” |

回执三种状态：**Tested**（绿点）、**Tested with a caveat**（琥珀点，例如 Ubuntu apt 的 fzf 0.44.1 低于官方要求 0.51.0 但实测可用）、**Not tested yet**（灰点，命令来自官方 README，不声称可用）。

- 待补：macOS、Windows 的测试没有归档原始记录。建议重跑一次 macOS（GitHub Actions，与之前相同的方法）并归档到 /evidence/，Windows 本机重跑后同样归档，这样每张回执都能点开原始记录。
- /evidence/ 目前在 robots.txt 里禁止抓取。回执链接对访客和审核员可用即可，不需要放开抓取。

---

## 五、排名模拟器（/tools/ranking-simulator/）

### 页面作用

回答“z 为什么跳到了那个目录 / 为什么 no match found”。访客点目录记访问、拨时间、输入关键词，看到每个目录的得分和最终赢家。

### 算法（按 zoxide v0.10.0 源码，2026-11-08 已核对）

- 每次访问：该目录 rank +1，last_accessed 更新为当前时间（`src/db/mod.rs` add_update）。
- 得分 = rank × 时间系数：1 小时内 ×4、1 天内 ×2、1 周内 ×0.5、更早 ×0.25（`src/db/dir.rs` score）。
- 匹配（`src/db/stream.rs` filter_by_keywords）：路径和关键词都转小写；最后一个关键词在路径里从右往左找，找到的位置之后不能再有 `/`（即必须落在最后一段）；其余关键词按从右到左的顺序依次出现在前面。
- `z` 会排除当前所在目录（所以“就在这个目录里再 z 一次”会跳到第二名）。
- 老化：所有 rank 之和超过 _ZO_MAXAGE（默认 10000）时，全部乘以 0.9 × 10000 ÷ 总和，低于 1 的删除。模拟器提供一个“快进到老化”按钮演示。
- hook 模式差异（第二期）：prompt 模式每次出现提示符都记一次，pwd 模式只在换目录时记。实测数据已有：同一操作后 prompt 模式得分 8.0，pwd 模式 4.0（/evidence/2026-10-08/command-init.json）。

### 交互

| 区域 | 内容 |
|---|---|
| 左栏 | 目录列表（可点 “cd 这个目录”）、时间按钮（+1 小时 / +1 天 / +1 周 / 重置）、预置场景下拉（“两个相似目录”、“新装的空数据库”、“很久没去的老目录”） |
| 主区 | `z ___` 输入框、结果一行（跳到哪 / no match found）、目录卡片按得分排序：路径、访问记录（日期章）、rank × 系数 = 得分 |
| 底部 | “在你自己的终端里看真实得分”：`zoxide query --list --score`，以及症状对应的修复链接 |

- 访问记录用“日期章”表现（借阅卡的盖章动作，0.35 秒落章），这是这一页的标志动作；整页其余部分沿用线路图世界的颜色和字体。
- 页面明确写“Simplified demo of zoxide 0.10.0's ranking; demo data”。
- 无 JS：服务端渲染一个固定场景的结果表和文字解释，保证页面本身有完整内容。

---

## 六、视觉系统（全站）

| 项 | 规定 |
|---|---|
| 场景 | 白天在办公室或家里对着显示器，旁边开着终端 → 浅色页面，命令块深色 |
| 颜色 | 地面 #f7f8fa；正文墨色 #14213d；导航条 #14213d；分隔线 #dfe3ea；次要文字 #55607a。线路色按 shell：zsh #00985f、bash #d6402b、fish #e8a317（文字用深一级 #8a5a00 保证对比度）、PowerShell #2f6fd6。状态：已测 = 当前线路色，注意 = #c98a12，未测 = #8a94a6 |
| 字体 | 界面与标题 Overpass（自托管，next/font），命令与数据 JetBrains Mono（关闭连字，避免 `--` 被显示成破折号）。替换现有 Geist |
| 组件 | 分段按钮、线路站点（8px 线 + 28px 圆环）、命令块（深色 + Copy）、回执卡（定义列表 + 状态点）、症状列表、测试矩阵表 |
| 圆角 | 按钮 8px，卡片 14px；不用阴影卡片堆叠，层级靠线条和留白 |
| 动效 | 只有两处：换 shell 时线路颜色 0.35 秒过渡；模拟器落章。尊重“减少动态效果”设置 |
| 文章页 | 正文宽度 65–75 字符；文内命令块、表格统一换成新样式；侧边目录保留 |

---

## 七、三语

- 生成器和模拟器的界面文案放进 `messages/{en,zh,ja}.json` 新命名空间 `builder`、`simulator`，并加入 layout 的 `pickClientMessages`（只传这两个命名空间，避免把全文塞进 HTML）。
- 命令本身三语相同；说明文字三语各写。中日文 Markdown 里的“、~”继续转义为“、\~”。

---

## 八、广告位规划（为通过后准备，现在不放）

- **不放**：生成器控件区、四步命令区、回执卡旁边、模拟器交互区。AdSense 禁止广告被误认为下载按钮或页面控件，也禁止紧挨可点击的工具控件放广告。
- **可放**：首页“What just happened”与测试矩阵之间；文章正文第 2–3 个小节之后；模拟器页底部说明区之后。
- 现在 head 里的 AdSense 代码保留，不开自动广告，等审核通过后手动放置上述位置。

---

## 九、改动清单

### 新增

| 文件 | 内容 | 工作量 |
|---|---|---|
| `data/setup-matrix.ts` | 组合数据：安装命令、profile、init、check、首跳、回执（上表）、状态 | 中 |
| `components/SetupBuilder/SetupBuilder.tsx` | 客户端生成器：分段按钮、选项、URL 同步、线路站点渲染 | 中 |
| `components/SetupBuilder/TestReceipt.tsx` | 回执卡三种状态 | 小 |
| `components/SetupBuilder/TestMatrix.tsx` | 组合矩阵表，点格子切换 | 小 |
| `components/SetupBuilder/RouteStops.tsx` | 线路站点 + 命令块（复用 CommandBlock） | 小 |
| `lib/zoxide-rank.ts` | 打分、匹配、老化的纯函数（按 v0.10.0 源码），带单元测试 | 小 |
| `components/RankingSimulator/*` | 模拟器界面：目录栏、时钟、查询、卡片、场景 | 中 |
| `app/[locale]/tools/ranking-simulator/page.tsx` | 新页面 + metadata + 结构化数据 | 小 |
| `messages/*.json` 的 `builder`、`simulator` 命名空间 | 三语文案 | 中 |

### 修改

| 文件 | 改动 | 工作量 |
|---|---|---|
| `app/globals.css` | 换成线路图世界的颜色变量、字体变量、选中色、焦点环、滚动条 | 小 |
| `app/[locale]/layout.tsx` | Geist → Overpass + JetBrains Mono；pickClientMessages 加两个命名空间 | 小 |
| `app/[locale]/page.tsx` | 重写为：生成器 + 症状栏 + 说明 + 测试矩阵；删掉 Hero 和长文区块 | 中 |
| `components/Navigation/Navigation.tsx` | 新导航项、海军蓝样式、当前项线路色下划线 | 小 |
| `components/Footer/Footer.tsx` | 换视觉；保留非官方声明 | 小 |
| `components/CodeBlock/*`、`components/Markdown/markdownComponents.tsx` | 命令块、表格、引用块换新样式；关连字 | 小 |
| `app/[locale]/download/page.tsx` | 去掉 SetupJourney，改为版本文件表 + 跳首页预选链接 | 小 |
| `app/[locale]/tutorials/[slug]/page.tsx` | 安装教程顶部嵌入预选生成器（精简版） | 小 |
| `app/[locale]/blog/[slug]/page.tsx` | 排错三篇插入模拟器入口（按 slug 判断） | 小 |
| `data/task-guides.ts` | setupPlatforms 等迁入 setup-matrix，保留导出以免别处报错 | 小 |
| `app/sitemap.ts` | 加 `/tools/ranking-simulator`（三语），首页 lastModified 更新 | 小 |
| `data/home-guide.ts` | 精简为“What just happened”三段 | 小 |

### 删除

| 文件 | 原因 |
|---|---|
| `components/Hero/Hero.tsx`、`components/Hero/TerminalDemo.tsx` | 首页首屏被生成器取代；确认无其他引用后删除 |
| `components/TaskGuides/SetupJourney.tsx` | 被 SetupBuilder 取代 |

---

## 十、分期与验收

| 阶段 | 内容 | 验收 |
|---|---|---|
| 1 | 视觉系统（颜色、字体、导航、页脚、命令块）+ setup-matrix 数据 + 首页生成器 | 三语首页可用；无 JS 时能看到默认组合完整命令；手机 375 宽无横向滚动；Lighthouse 可访问性 ≥ 95 |
| 2 | 排名模拟器页 + lib/zoxide-rank.ts 单元测试 | 用实测数据对拍：同样的访问序列，模拟器得分与 /evidence/ 里 `zoxide query --list --score` 输出一致 |
| 3 | 安装教程嵌生成器、/download 改版、排错页接入模拟器、文章页换样式 | 全站 26 个英文页面 + 中日文逐页过一遍；GSC 无新增 404 / 重定向错误 |
| 4 | 补 macOS、Windows 原始记录归档；上线后观察 | 每张 Tested 回执都能点开原始记录 |

**重新申请 AdSense 的时机**：阶段 1–3 上线后，等 Google 重新抓取首页和安装页（GSC 网址检查确认抓到新版本），再观察 3–4 周，然后只点一次“申请审核”。

---

## 十一、风险与未决

- **域名问题仍在**：改版把独特价值做足，但“用别人项目名做域名”的印象改不掉，不能保证通过。
- **首页排名波动**：首页文字大幅减少，“zoxide” 主词（28 天 179 次点击）可能短期波动。对策：服务端渲染完整命令和“What just happened”说明，首页 title 不改。
- **未决 1**：模拟器要不要支持分享链接（把访问序列放进 URL）。
- **未决 2**：Install method 下拉（apt / 安装脚本，系统模块 / Home Manager）放第一期还是第二期。
- **未决 3**：macOS、Windows 是否重跑并归档原始记录（建议做，成本低）。

---

## 十二、实施记录（2026-11-08）

- **回撤点**：git 标签 `rollback-2026-11-07`（提交 7f6a209）+ Cloudflare 版本 fb05dcb6，操作步骤见 [ROLLBACK.md](ROLLBACK.md)。
- **与原计划的偏差：首页不压缩文字。** `docs/homepage-restoration-research-2026-11-08.md` 显示首页是“zoxide”主词的落地页（28 天 625 次点击、平均排名 2.69）。为不动排名信号，H1 语义、title、全部指南段落和 6 个锚点（`#what-zoxide-does`、`#install-zoxide`、`#activate-zoxide`、`#first-zoxide-session`、`#zoxide-troubleshooting`、`#zoxide-faq`）都保留，生成器和测试矩阵是加在上面的。
- **阶段 1–2**：完成。模拟器规则对照 zoxide 0.10.0 源码；单元测试 `node --experimental-strip-types lib/zoxide-rank.test.ts`。
- **阶段 3**：安装教程（macOS / Windows / Ubuntu / Arch·NixOS）顶部嵌入预选好的生成器；`zoxide-not-working` 和 `troubleshooting-zoxide-no-match-found` 加模拟器入口（command-not-found 是没初始化的问题，跟排名无关，不放）；文章代码块和正文换成新视觉；删除不再使用的 Hero、TerminalDemo、SetupJourney。
- **阶段 4**：macOS（GitHub macos-latest，macOS 26.7.2）、Ubuntu 24.04（官方容器 + 安装脚本）、Windows 11 本机三处重测，原始记录在 `public/evidence/2026-11-08/`，脚本在 `.ci/evidence/`、`.ci/windows/`。所有 Tested 回执都能点开原始记录。
- **重测发现**：三个目录同为 4.0 分时，z api 去了后加入数据库的 api-docs（macOS zsh/bash、Ubuntu bash/zsh 四次一致）。模拟器同分规则已按此修正并写进测试。Windows 新版 winget（1.29）把 zoxide 路径放在 `WinGet\Packages\…` 而不是 `Links`，Windows 教程已补充说明。

