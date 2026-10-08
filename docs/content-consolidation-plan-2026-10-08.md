# zoxide.org 内容合并方案（2026-10-08）

- 数据：GSC 网页搜索，2026-07-07 至 2026-10-05（91 天），导出在 `C:\Users\jiank\Downloads\gsc-api\exports\zoxide-2026-10-08\`
- 全站：5,128 次点击、138,315 次展示、CTR 3.71%、日均 56 次点击
- 按语言：英文 4,651 次点击，中文 417 次，日文 189 次
- 背景：AdSense 以“低价值内容”拒审，见 `docs/adsense-rejection-diagnosis-2026-10-08.md`
- 原则：一个搜索意图只保留一个页面；被合并页面用 308 跳转到保留页面（沿用 `data/search-intents.ts` 已有机制），合并前把被合并页面里独有、正确的内容移入保留页面

## 趋势

每周点击稳定在 350～450 次。9 月中旬起展示量从每周 14,738 次降到 5,287 次，加权平均排名从 3.8 变为 3.2，说明流失的主要是排名靠后、几乎没有点击的曝光。

## 已存在的合并（无需处理）

| 旧网址 | 现跳转到 | 91 天点击 |
|---|---|---:|
| /blog/zoxide-fzf-interactive-guide-en/ | /tutorials/fzf-integration/ | 83 |
| /blog/install-zoxide-mac-shell-integration-completion/ | /tutorials/install-macos/ | 8 |
| /blog/advanced-config/ | /tutorials/advanced-config/ | 7 |
| /blog/zoxide-download-guide/ | /download/ | 4 |
| /tutorials/shell-setup/ | /blog/zoxide-init-guide/ | 4 |
| /blog/quick-start/ | /tutorials/quick-start/ | 1 |
| /comparisons/autojump/ | /blog/zoxide-vs-autojump/ | 0 |
| /tutorials/troubleshooting/ | /blog/zoxide-not-working/ | 0 |

## 互相争词的证据

| 搜索词 | 参与排名的页面（排名） | 应由谁承接 |
|---|---|---|
| zoxide no match found | troubleshooting-zoxide-no-match-found（1.3）、zoxide-command-not-found（5.1）、zoxide-not-working（7.4） | troubleshooting-zoxide-no-match-found |
| zoxide commands | blog/zoxide-commands（2.9）、tutorials/basic-commands（6.8） | blog/zoxide-commands |
| what is zoxide | stop-using-cd（3.4）、features（4.8）、what-is-zoxide-smarter-cd（5.5）、how-zoxide-works-en（13.6），合计 0 次点击 | 一个页面 |
| zoxide autocomplete | zoxide-alias-autocomplete（1.1）、advanced-zoxide-techniques（5.7） | zoxide-alias-autocomplete |
| how to use zoxide | tutorials/quick-start（4.2）；mastering-terminal-navigation-zoxide-guide 的标题同为 “How to use zoxide” | tutorials/quick-start |
| zoxide alternatives / zoxide vs z | blog/zoxide-alternatives-comparison-open-source（1.3）、comparisons/z（3.9）、comparisons（5.7）、comparisons/fasd（16.0） | 替代品对比文章 |

## 合并清单（2026-10-08 已执行）

英文 91 天点击合计 4,651 次，以下 13 个页面合计 239 次（约 5%），且 308 跳转会把大部分信号传给保留页面。

| # | 合并的页面 | 91 天点击 / 展示 | 跳转到 | 合并前需移入的内容 |
|---|---|---|---|---|
| 1 | /tutorials/basic-commands/ | 32 / 1,073 | /blog/zoxide-commands/ | 无独有内容 |
| 2 | /blog/mastering-terminal-navigation-zoxide-guide/ | 63 / 7,745 | /tutorials/quick-start/ | oh-my-zsh 初始化顺序说明 |
| 3 | /blog/zoxide-linux-en/ | 47 / 3,930 | /tutorials/install-arch-nixos/ | Fedora 等发行版安装命令、卸载步骤 |
| 4 | /blog/advanced-zoxide-techniques/ | 7 / 868 | /blog/zoxide-alias-autocomplete/ | 无独有内容 |
| 5 | /tutorials/performance/ | 7 / 807 | /tutorials/advanced-config/ | _ZO_EXCLUDE_DIRS、_ZO_MAXAGE 的正确说明 |
| 6 | /blog/zoxide-performance-en/ | 1 / 76 | /blog/how-zoxide-works-en/ | frecency 说明 |
| 7 | /blog/stop-using-cd/ | 24 / 5,027 | /blog/what-is-zoxide-smarter-cd/ | “zoxide vs cd” 对比段落 |
| 8 | /features/ | 3 / 3,254 | / | 无（首页已覆盖）；导航移除 Features |
| 9 | /comparisons/ | 21 / 1,451 | /blog/zoxide-alternatives-comparison-open-source/ | 导航 Comparisons 指向保留页 |
| 10 | /comparisons/z/ | 16 / 350 | /blog/zoxide-alternatives-comparison-open-source/ | “zoxide vs z” 小节 |
| 11 | /comparisons/fasd/ | 6 / 120 | /blog/zoxide-alternatives-comparison-open-source/ | “zoxide vs fasd” 小节 |
| 12 | /changelog/ | 9 / 4,249 | /download/ | 下载页注明当前版本并链接官方 Releases；导航和页脚移除 Changelog |
| 13 | /tutorials/videos/ | 3 / 201 | /tutorials/ | 无 |

中文、日文对应页面按同样规则一起合并（两种语言合计 606 次点击，以上页面在中日文的点击都在个位数）。

## 合并后保留的英文内容页（约 22 个）

首页、/download、/tools/zoxide-doctor、/faq；教程：quick-start、install-macos、install-ubuntu、install-windows、install-arch-nixos、fzf-integration、advanced-config；博客：zoxide-init-guide、zoxide-commands、zoxide-alias-autocomplete、zoxide-command-not-found、zoxide-not-working、troubleshooting-zoxide-no-match-found、how-zoxide-works-en、what-is-zoxide-smarter-cd、zoxide-alternatives-comparison-open-source、zoxide-vs-autojump；以及教程和博客两个列表页。About、Contact、Privacy、Terms 不变。

## 执行记录（2026-10-08）

- `data/search-intents.ts` 新增 25 条 308 跳转规则（13 组页面，按语言对应各自网址）
- 补充内容：Linux 安装教程新增“其他发行版”（命令取自官方 README 安装表）与“卸载”；下载页新增指向官方全部 Releases 的版本历史入口
- 导航移除 Features、Changelog，Comparisons 指向各语言替代品对比文章；页脚移除功能页、更新日志、vs z、vs fasd，新增 zoxide-doctor 与替代品对比
- 修复死链 `/blog/mastering-zoxide-smarter-cd-command/`（“完整指南”入口改为快速入门）；中文命令参考入口改为 `/blog/zoxide-commands`
- 首页、FAQ、搜索接口中指向已合并页面的链接全部改为目标页面
- sitemap 从 128 个 URL 减为 89 个；构建产物内链检查 0 个死链

## 风险

- 被合并页面的排名会在 1～4 周内转移到保留页面，期间个别词可能短暂下降。
- 首页、About 的 title 冻结到 2026-10-30，本方案不改 title。
- 导航移除 Features、Changelog，Comparisons 改为指向替代品对比文章。
