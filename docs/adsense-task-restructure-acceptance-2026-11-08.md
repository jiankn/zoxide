# zoxide.org 任务结构改造：发布与验收记录

> 本文件记录首次任务结构版本的发布。首页随后按 [首页恢复与调整调研](homepage-restoration-research-2026-11-08.md) 恢复实用指南，后续版本单独记录验收。

日期：2026-11-08（上海时区）。状态：**已发布，线上验收通过**。这表示改造与发布检查完成，不表示 Google 已批准 AdSense 或排名已经提高。

## 已上线的变化

- 首页首屏改为安装、排错、命令查询三条路径；提供原创工具与两条具体实测结论。完整安装教程由下载与平台页面承接。
- 主导航改为安装设置、故障排查、命令参考、工具对比、zoxide-doctor。教程按学习阶段组织，全部指南按任务分组；旧网址继续使用。
- 下载页增加系统/Shell 选择、安装、配置文件、函数验证和首次跳转，配有命令复制与失败提示。PowerShell 与 POSIX 命令分开，macOS Bash 区分 login/non-login 配置文件。
- 排错中心与 zoxide-doctor 增加无需 Node.js 的人工自查。六类症状分流；No match found 再分空库、关键词问题、当前目录、删除或排除四类。
- 保留既有 CLI、真实输出、环境和能力限制，不声称网页能够扫描用户电脑或自动完成配置。
- 三语同步；旧语言标签修正纳入本次发布；About 中不再宣传已合并的独立 Changelog。

## 对照验收标准

| 标准 | 结果与证据 |
| --- | --- |
| 首页立即区分安装、排错、命令查询 | 通过。390×844 手机视口中三个入口末端位置：英文约 668 px、中文 538 px、日文 604 px，均在首屏内 |
| 系统与 Shell 命令对应 | 通过浏览器组合检查：Windows/PowerShell；macOS/Zsh、Bash；Linux/Bash、Zsh、Fish。PowerShell 不出现 mkdir -p，POSIX 不出现 New-Item，macOS Bash 有 bash_profile 说明 |
| 安装与 No match found 两条路径 | 首页实际点击进入安装；六个安装组合、六类症状及四个 No match found 分支检查通过。线上另验证了安装选择器和当前目录分支确实更新 |
| 原创工具可发现、无需 Node 也能自查 | 主导航与首页都有工具入口；分步检查直接展示命令、结果解释和详细指南 |
| 核心结论可核对 | 首页关联 Windows/PowerShell hook 与目录匹配案例，链接现有测试说明；原始测试日期仍保留 2026 年 10 月，没有伪造新实测日期 |
| 重要 URL/canonical/广告配置保留 | sitemap URL 集合与历史 78 页一致；线上 78/78 HTTP 200，自引用 canonical、发布商 meta 和广告脚本检查通过；标题逐项对比无变化 |
| 核心实测内容与站内发现能力 | 文章、教程核心数据源没有修改；排错页面只在原正文前加自查组件。本地全站没有孤立页面 |
| 多语言与手机体验 | 三语首页、安装与排错组件都有对应文案；检查的手机页面宽度与 scrollWidth 同为 390 px，未见整体横向溢出 |
| 构建与线上状态明确区分 | Next.js 生产构建/TypeScript、相关文件 ESLint、git diff --check、Cloudflare 构建、部署 dry-run 均通过；实际发布后才进行了线上抓取和交互检查 |

### 验证的实际范围

浏览器检查验证的是导航、选择器、所展示的命令、分支内容与布局。此轮没有在用户的 Windows/macOS/Linux 环境重新执行全部安装命令或重新跑完历史实测；步骤复用已有测试与指南，仍以页面标明的环境、版本和边界为准。网页不会执行终端命令。

无 JavaScript 时，安装页提供显示全部路径的 noscript 样式，核心命令在服务端 HTML 内；诊断页提供 PowerShell 全部检查并链接其他 Shell 的指南。已核对静态 HTML，不把此结构检查写成一次真实无脚本浏览器端到端测试。

## 排名与审核的边界

- 未改变现有文章 URL、canonical、重定向规则与核心实测正文；78 个页面标题逐项保持一致。
- 首页 H1 与可见内容、导航和索引组织发生了实质变化，因此仍可能出现排名波动。保留技术信号并不能保证排名只升不降。
- Google 抓取新版本、搜索排名变化和 AdSense 审批是独立结果，均不能由部署成功推断。
- 没有操作 AdSense 后台，没有替用户勾选“已解决”或申请再次审核。应在站长确认内容与账户待办后，通过现有网站记录申请复审，无需删除重建网站记录。

## 发布记录与恢复

- 发布目标：Cloudflare Worker `zoxide`，正式域名 https://zoxide.org/。
- 当前版本：`e52fd88c-fe14-4c6f-9ba5-cbd985f1e912`。
- 发布前版本：`fb05dcb6-a462-41d1-a35f-1d949f0a9c76`。
- 如确需恢复旧版，可在核对 Cloudflare 当前部署后使用 `npx wrangler rollback fb05dcb6-a462-41d1-a35f-1d949f0a9c76`；本次没有执行回滚。
- 发布使用现有 Cloudflare 身份与绑定，未变更 DNS、robots、middleware、隐私配置或发布商 ID。
- 源码仍在当前工作区，未创建 Git 提交或推送；原有外链记录等无关修改保留。

## 证据文件

位于 `outputs/adsense-restructure-2026-11-08/`：

- `live-pages.json`：改造前五个代表页，能看到旧首页 15 个区块与 Neovim 文案。
- `local-acceptance.json`：最终构建的 78 页、canonical、H1、JSON-LD、广告配置与孤立页面检查。
- `browser-final.json`：三语手机首屏、六个安装组合、六类症状和分支检查。
- `home-desktop-final.png`、`home-mobile-final.png`、`setup-mobile-final.png`、`diagnosis-mobile-final.png`：最终构建截图。
- `live-acceptance.json`：发布后 Scrapling 读取的 78 页与新界面存在性检查。
- `live-browser.json`：正式域名上实际操作安装与排错选择器的结果。
- `live-redirects.json`：features、changelog、显式 en 路由仍返回单次 308 到规范目标。

本地临时预览服务与浏览器工作区在验收完成后关闭；临时证书没有写入系统信任库。
