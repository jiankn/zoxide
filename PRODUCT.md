# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- 主要用户：在终端里工作的开发者，从 Google 搜 “zoxide install / zoxide fzf / zoxide not working / zoxide powershell” 进来。92% 用电脑访问（GSC 2026-10 数据），多数来自美国、德国、英国、法国、日本。
- 进站时的状态：手边开着一个终端，要么正准备装 zoxide，要么已经装了但 `z` 不工作，要么想把它和 fzf、别名、补全接起来。目标是几分钟内拿到适合自己系统和 shell 的正确命令，并确认它真的生效。
- 次要用户：在比较 zoxide、autojump、z、fasd 等目录跳转工具，想看真实数据再决定的人。

## Product Purpose

zoxide.org 是一个独立的、非官方的 zoxide 实测指南站，靠 Google 搜索流量和 AdSense 广告变现。成功的标准：访客拿到可直接粘贴、经过实测的命令并解决问题；AdSense 审核认可站点有“别处拿不到的实质价值”。

2026-11-08 起，主题边界可从 zoxide 扩到“终端导航 / Shell 效率”（fzf、shell 配置等相关工具的实测），zoxide 仍是核心。

## Positioning

官方 README 只给通用说明；本站给的是按“系统 × shell × 安装方式”实测过的命令、真实终端输出、可复现的测试环境记录，以及站长自己开发的开源诊断工具 zoxide-doctor（`npx zoxide-doctor`）。

## Operating Context

- 访客边看网页边在自己终端里复制命令，常见环境：macOS + zsh、Ubuntu/WSL + bash、Windows + PowerShell 7、Arch/NixOS、fish。
- 实测证据来自 GitHub Actions 临时分支（macos-latest、ubuntu:24.04 容器、tmux 驱动交互界面）和站长 Windows 本机，证据归档在站内 /evidence/ 路径（robots 禁止抓取）。

## Capabilities and Constraints

- 技术栈：Next.js 16 + next-intl（英文、中文、日文三语）+ Tailwind 4，部署在 Cloudflare（OpenNext）。
- 现有页面：首页、安装教程（Windows、macOS、Ubuntu、Arch/NixOS）、quick-start、advanced-config、fzf-integration、命令/init/别名补全/排错等博客、zoxide-doctor 工具页、FAQ、关于、联系、隐私政策、服务条款。
- AdSense：两次因“低价值内容”被拒（2026-10-08、2026-11 初）。审核要求：真实高质量的信息、工具或服务；持续维护内容和结构；能持续吸引用户。
- 2026-11-08 用户确认：改版范围是“UI/UX + 新增站内互动工具”，不是只换皮。
- 未决：新增工具的具体清单、是否保留三语全量、改版后的 URL 结构。

## Brand Commitments

- 域名 zoxide.org 不变；必须持续标明“非官方独立指南”，并链接官方 GitHub 项目（ajeetdsouza/zoxide）。
- 站长署名：Jacky Jian，独立开发者，使用 zoxide 两年。
- 不得冒充官方，不得使用官方 logo 作为本站身份。

## Evidence on Hand

- 实测教程正文：data/blog-tested-content.ts 及各教程数据文件；测试日志归档在 /evidence/。
- zoxide-doctor：npm 包（账号 agoes 为站长本人），有 Windows 与 Ubuntu 真实输出。
- GSC 数据：近 28 天约 1,500 点击 / 3.9 万展示（2026-10-28）。
- 没有：用户评价、合作方、下载量背书、性能基准之外的第三方证据。不得编造。

## Product Principles

1. 先给能跑的命令，再给解释：每个页面的第一屏要让访客拿到下一步该粘贴的东西。
2. 只写测过的：每条命令都能追溯到测试环境、版本和日期；没测过的明确标出。
3. 做官方 README 做不到的事：按访客自己的系统和 shell 定制、诊断、对比。
4. 少而强：一个意图一个页面，不为关键词拆页。
