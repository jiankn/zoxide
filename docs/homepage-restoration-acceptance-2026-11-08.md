# 首页恢复：发布与验收记录

日期：2026-11-08。状态：**已提交 GitHub，已部署生产，线上验收通过**。

代码提交：[32212a4 — Restore complete homepage guide and task-based setup](https://github.com/jiankn/zoxide/commit/32212a4598dc7e30da7aeb0b8f7d8d4a396e8319)，分支 `main`。

Cloudflare Worker：`zoxide`。本次生产版本：`0ad8f928-2434-46a8-85bf-5eaee4070f69`。上线地址：[英文首页](https://zoxide.org/)、[中文首页](https://zoxide.org/zh/)、[日文首页](https://zoxide.org/ja/)。

## 实际变化

- 恢复原有标题风格与终端示意，直接说明目录学习和关键词跳转的用途。副标题从 H1 中独立为段落。
- 三个任务入口改为紧凑导航；安装、排错可定位本页，命令参考直达当前语言专题页。
- 恢复定义与 cd 的区别、三平台安装、四 Shell 初始化、首次使用、日常命令、五类常见故障、六条 FAQ 和相关教程链接。
- 恢复六个旧锚点；首页正文重新提供 macOS、Ubuntu、Windows、初始化、命令、fzf 和诊断工具的相关入口。
- 增加分别适用于 Bash/Zsh/Fish 与 PowerShell 的首次跳转示例，说明创建目录、加入数据库和核对结果的前提。
- 修正旧初始化验证文案：用 `type z` 或 `Get-Command z` 检查 Shell 函数，避免以 `z --help` 作为验证。
- 将工具选择说明并入首次使用，保留新版两条实测案例并放在基础路径之后，沿用已有 2026 年 10 月测试记录。
- 继续去除重复宣传区块与笼统的 Neovim 宣传。

本次新增产品修改集中在首页、Hero 和三语首页文案。Git 提交同时同步上一轮已获授权并已上线的安装选择器、分步排错、指南索引、导航和语言标签修正，以保留这些改进及其依赖。无关的外链草稿、原始 GSC 导出和本地截图未加入提交。

## 验收结果

| 检查 | 结果 |
| --- | --- |
| 相关页面、组件、数据的 ESLint | 通过 |
| TypeScript 与 `npm run build:cf` | 通过 |
| Cloudflare 生产包 dry-run | 通过 |
| 本地 Worker 78 个已有网址 | 全部 200；title、canonical 与入口版发布基线一致；无意外 noindex |
| 生产 78 个已有网址 | 同上；sitemap 仍为同一组 78 个网址 |
| 三语首页初始 HTML | 三平台命令、四 Shell 初始化、两种首次跳转示例、六条 FAQ 答案均存在 |
| 三语首页结构 | 单个 H1、单个 main；六个旧锚点、目录目标与相关教程链接通过 |
| 三语首页 hreflang | 与既有三语地址及 x-default 一致 |
| AdSense 网站账户 meta | 所有 78 页均存在；相关全局配置未改动 |
| 本地桌面与手机 | 三语共六种组合通过；1440px 与 390px 宽度下无整页横向溢出，快捷任务首屏可见 |
| 线上浏览器 | 英文桌面、中文手机、日文手机检查通过；安装锚点和 FAQ 键盘展开正常 |
| GitHub | 代码提交已推送 origin/main，并核对远端提交号 |
| 无关文件 | 三个已有外链文档的内容哈希与本轮开始时一致 |

FAQ 的键盘交互使用真实焦点和 Enter 验证；详细命令与问答的抓取检查直接读取初始 HTML，不以浏览器完成 hydration 后的结果替代。

本地视觉对照包含首页首屏、手机 Shell 配置及展开的 FAQ。机械样式扫描对沿用的浅蓝提示背景与灰色正文给出一条配色建议，本次保留该既有样式；这不属于抓取或任务完成失败。

## 证据与回退

本地证据位于 `outputs/homepage-restoration-2026-11-08/`：

- `local-acceptance.json`、`live-acceptance.json`：78 页与首页初始 HTML 检查。
- `local-browser.json`、`live-browser.json`：视口、首屏入口和交互结果。
- 三语桌面/手机截图，以及 `zh-mobile-shells.png`、`zh-mobile-faq.png`。
- `homepage-original.tsx`、`homepage-entry-version.tsx`：恢复前两种首页的对照。

上一生产版本为 `e52fd88c-fe14-4c6f-9ba5-cbd985f1e912`，保留作发布故障时的回退依据；该版本的首页为入口版。

这些检查证明页面恢复和上线生效，不证明 Google 已重新评估排名或 AdSense 已批准。搜索影响需要最新发布前后 GSC 数据；本轮没有提交 AdSense 复审。
