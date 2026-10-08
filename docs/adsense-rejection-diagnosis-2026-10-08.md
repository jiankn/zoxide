# zoxide.org AdSense 拒审诊断（2026-10-08）

- 阶段：被拒后诊断
- 拒审原因（AdSense 后台原文）：**低价值内容**。要求“提供实质性的独特价值，在网络上建立稳定的影响力，并展现出足以支撑商业广告合作的用户热度”；重新提交前需“提供真实、高质量的信息、工具或服务；持续精选优质内容和维护网站页面结构；能够切实引起并持续吸引用户关注”。
- 证据来源：线上抓取全部 40 个英文页面（sitemap 共 128 个 URL，其中 88 个为中文/日文版本）、本地仓库、官方 zoxide 仓库 README 与 `src/cmd/cmd.rs`。
- 结论：**Not ready**。技术、隐私、身份类问题已基本解决；阻断项集中在内容价值（ADS-CONTENT-01/02/03/08、ADS-PUB-11）与“影响力/用户热度”（站外信号，代码无法直接解决）。

## 一、主要发现（按严重度）

### Blocker 1：存在可证伪的错误内容，且页面声称“已核验”（ADS-CONTENT-01、ADS-PUB-05）

| 页面 | 错误 | 官方依据 |
|---|---|---|
| /blog/zoxide-performance-en/ | 建议 “Use strict mode if you want exact matches” | zoxide 没有 strict mode；`src/cmd/cmd.rs` 无此参数 |
| /tutorials/advanced-config/ | 使用 `_ZO_EXCLUDE_PATHS` | 官方只有 6 个变量：_ZO_DATA_DIR、_ZO_ECHO、_ZO_EXCLUDE_DIRS、_ZO_FZF_OPTS、_ZO_MAXAGE、_ZO_RESOLVE_SYMLINKS |
| /features/ | 把 “Team Collaboration” 列为功能卡片 | zoxide 没有团队协作功能 |

同时，24 个页面末尾都有 “Independent verification note: commands and version references were checked against the official zoxide repository on July 16, 2026”。带错误的页面也挂着这句话，审核员一旦发现错误，会把整站的“核验”声明都视为不可信。

### Blocker 2：单一小工具的主题被拆成大量重叠页面（ADS-CONTENT-08、ADS-CONTENT-01）

zoxide 只有 z、zi、add、remove、query、import 几个命令，但英文站有约 36 个内容页围绕它展开，同一意图被多页重复覆盖：

| 意图 | 覆盖该意图的英文页面 |
|---|---|
| 安装 | 首页、/download、5 篇 install-* 教程、/blog/zoxide-linux-en |
| 命令用法 | /tutorials/quick-start、/tutorials/basic-commands、/blog/zoxide-commands、/blog/mastering-terminal-navigation-zoxide-guide、/blog/zoxide-alias-autocomplete |
| 原理/排名算法 | /blog/how-zoxide-works-en、/blog/zoxide-performance-en、/tutorials/performance、/blog/advanced-zoxide-techniques |
| 排错 | /blog/zoxide-not-working、/blog/zoxide-command-not-found、/blog/troubleshooting-zoxide-no-match-found、/faq |
| 介绍/说服 | /blog/what-is-zoxide-smarter-cd、/blog/stop-using-cd、/features |
| 替代品对比 | /blog/zoxide-alternatives-comparison-open-source、/blog/zoxide-vs-autojump、/comparisons、/comparisons/z、/comparisons/fasd |

页面之间没有大段照抄（8 词片段最高重合 0.18），但这种“一个意图多篇、按关键词变体拆页”的结构，正是“主要为搜索引擎制作的页面”的典型形态。中文、日文再各复制一遍，使 128 个 URL 中只有约 15 个真正独立的主题。

### High 1：大量薄页面与标题党（ADS-CONTENT-03）

正文字数（含导航外的全部 main 文本）：/tutorials/videos 126、/features 184、/changelog 202、/faq 203、/tools/zoxide-doctor 214、/tutorials/advanced-config 264、/tutorials/basic-commands 303、/blog/zoxide-performance-en 368。

/blog/zoxide-performance-en 的标题是 “A Deep Dive into the Rank Algorithm”，实际有效正文约 150 词、4 个要点，其中 1 个是错误。

营销/AI 套话统计：deep dive 21 次、magic 17 次、mastering 14 次、boost 6 次、blazing 5 次、revolutionize 4 次、“Navigate Like a Wizard” 1 次。集中在博客：/blog、zoxide-performance-en、zoxide-alias-autocomplete、stop-using-cd、advanced-zoxide-techniques、how-zoxide-works-en。

标题模板化：17 篇博客统一后缀 “- zoxide Blog | Tips and Best Practices”，10 篇教程统一为 “zoxide Tutorial - X | Complete Usage Guide”。

### High 2：嵌入视频页几乎没有原创内容（ADS-CONTENT-02）

/tutorials/videos 只有 3 个第三方 YouTube 视频，每个配一句话说明，正文 126 词。

### High 3：唯一真正原创的资产被做薄了（ADS-CONTENT-01）

zoxide-doctor 是站长自己开发的开源工具，是全站最强的“独特价值”证据，但工具页只有 214 词，没有示例输出、没有它能发现哪些问题的实例。

### High 4：影响力与用户热度不足（ADS-PROG-04 相关，站外因素）

拒审原文明确提到“在网络上建立稳定的影响力”和“用户热度”。截至 2026-08-04 的 GSC 数据：近 3 个月 5,650 次点击（约 60 次/天），7 月起排名与展示下滑。外链主要来自站长自己在 DEV、Hashnode、AUR 等平台的发布。这一项无法通过改代码快速解决。

### Medium：域名与品牌（ADS-PUB-02、ADS-PUB-05）

`zoxide.org` 是他人开源项目的名称。9 月 30 日已加上非官方声明、运营者署名，本次拒审理由没有提到虚假陈述，所以目前判定为已缓解，但它会放大“这个站只是在转述官方文档”的印象。

## 二、整改方案

1. **立即修正错误**：删除 strict mode、`_ZO_EXCLUDE_PATHS`、Team Collaboration；在每篇真正复核过的页面上才保留核验说明，并写清核验日期和范围。
2. **收缩到少而强的页面集**：按上表每个意图只保留一个主页面，其余用 301 合并到主页面（项目已有 `data/search-intents.ts` 的重定向机制）。合并前用 GSC 近 3 个月的页面点击数据决定保留哪一篇。
3. **薄页面处理**：/tutorials/videos 要么为每个视频写实质点评（时间点、适合谁、哪里过时），要么下线；/features 并入首页；/changelog 改为“每个版本对用户的实际影响”而不是版本列表，或下线。
4. **把原创资产做厚**：zoxide-doctor 页补充真实运行输出、能诊断的问题清单、与手动排查的对比；继续按 Windows/macOS 的方式实测 Ubuntu、fzf、排错类页面。
5. **去掉 SEO 痕迹**：统一改掉模板化标题后缀和营销套话（注意：标题冻结到 2026-10-30，之后分批改）。
6. **重新申请的时机**：完成 1～4 后，等 Google 重新抓取并观察 GSC 至少 4～6 周再申请。不要在改完当天就点“申请审核”。

## 三、全量检查表

状态：Pass / Fail / Unknown / N/A。

| ID | 状态 | 证据 | 下一步 |
|---|---|---|---|
| ADS-ELIG-01 | Unknown | 无法从站点确认申请人年龄 | 站长自行确认 |
| ADS-ELIG-02 | Pass | 后台截图显示 4 个网站在同一账户下 | 无 |
| ADS-ELIG-03 | Fail | 低价值内容拒审，见 Blocker 1、2 | 按整改方案处理 |
| ADS-ELIG-04 | N/A | 独立 Next.js 网站，非 Blogger/YouTube | 无 |
| ADS-OWN-01 | Pass | 仓库可控制 layout 与 head | 无 |
| ADS-OWN-02 | Pass | 后台“验证网站所有权”为绿色对勾 | 无 |
| ADS-OWN-03 | Pass | 页面正常渲染，正文为服务端输出 | 无 |
| ADS-SITE-01 | Fail | 后台状态“需要注意” | 整改后再申请审核 |
| ADS-SITE-02 | Pass | head 中有原生 adsbygoogle 脚本与 google-adsense-account meta | 无 |
| ADS-TXT-01 | Pass | ads.txt 含 pub-3562784107542460，后台显示“已授权” | 无 |
| ADS-TXT-02 | Pass | 根路径已发布 ads.txt | 无 |
| ADS-CONTENT-01 | Fail | 3 处可证伪错误；原创内容占比低 | 修错、做厚原创资产 |
| ADS-CONTENT-02 | Fail | /tutorials/videos 为嵌入视频加一句话 | 写实质点评或下线 |
| ADS-CONTENT-03 | Fail | 8 个页面正文不足 400 词，含 “Deep Dive” 薄文 | 合并或扩写 |
| ADS-CONTENT-04 | Pass | 无施工中、空页或占位内容 | 无 |
| ADS-CONTENT-05 | Pass | 当前无广告、联盟或付费推广块 | 无 |
| ADS-CONTENT-06 | Pass | 英文、中文、日文均为 AdSense 支持语言 | 无 |
| ADS-CONTENT-07 | N/A | 无评论或用户生成内容 | 无 |
| ADS-CONTENT-08 | Fail | 同一意图多页拆分；标题模板化后缀 | 按意图合并，分批改标题 |
| ADS-UX-01 | Pass | 桌面与移动导航清晰可用 | 无 |
| ADS-UX-02 | Pass | 首页、教程、博客、About 结构可理解 | 无 |
| ADS-UX-03 | Pass | 无假下载按钮或误导跳转 | 无 |
| ADS-UX-04 | Pass | 无强制跳转、自动下载；同意弹窗为 Google CMP | 无 |
| ADS-UX-05 | Pass | About（含运营者）、Contact、Privacy、Terms 均可访问 | 无 |
| ADS-UX-06 | Pass | 未放置广告位 | 无 |
| ADS-CRAWL-01 | Pass | 代表页面均返回 200 | 无 |
| ADS-CRAWL-02 | Pass | robots.txt 未封 Google；Cloudflare 72 小时内未拦截 Mediapartners-Google | 无 |
| ADS-CRAWL-03 | Pass | 内容页均为 GET 访问 | 无 |
| ADS-CRAWL-04 | Pass | http、www 一次 301 到 https://zoxide.org/ | 合并页面时保持单跳 301 |
| ADS-CRAWL-05 | Pass | URL 稳定，无会话参数 | 无 |
| ADS-CRAWL-06 | Pass | Cloudflare 正常响应 | 无 |
| ADS-CRAWL-07 | Pass | sitemap 128 条 URL，lastmod 如实更新 | 合并页面后同步移除 |
| ADS-PROG-01 | Unknown | 无法从代码确认无自点或刷量 | 站长自行确认 |
| ADS-PROG-02 | Pass | 无诱导点击广告文案 | 无 |
| ADS-PROG-03 | N/A | 尚未投放广告 | 投放时使用中性标签 |
| ADS-PROG-04 | Unknown | 流量来自自然搜索与站长自发外链；用户热度偏低 | 积累真实外部引用与回访用户 |
| ADS-PROG-05 | N/A | 未修改广告代码行为 | 无 |
| ADS-PROG-06 | N/A | 尚未投放广告 | 无 |
| ADS-PROG-07 | N/A | 普通网站，非 WebView | 无 |
| ADS-PUB-01 | Pass | 无违法内容 | 无 |
| ADS-PUB-02 | Unknown | 域名使用他人项目名；未见侵权素材 | 维持非官方声明 |
| ADS-PUB-03 | Pass | 无危险或贬损内容 | 无 |
| ADS-PUB-04 | Pass | 无相关内容 | 无 |
| ADS-PUB-05 | Fail | 带错误的页面仍挂“已核验”声明 | 仅在真实复核页保留核验说明 |
| ADS-PUB-06 | Pass | 无欺骗性服务 | 无 |
| ADS-PUB-07 | Pass | 无作弊、破解类内容 | 无 |
| ADS-PUB-08 | Pass | 无相关内容 | 无 |
| ADS-PUB-09 | Pass | ads.txt、meta、脚本发布商 ID 一致 | 无 |
| ADS-PUB-10 | N/A | 尚未投放广告 | 无 |
| ADS-PUB-11 | Fail | 薄页面与视频页属于低价值屏幕 | 合并或扩写后再投放 |
| ADS-PUB-12 | N/A | 尚未投放广告 | 无 |
| ADS-PUB-13 | N/A | 主题不涉及选举、健康、气候 | 无 |
| ADS-PUB-14 | N/A | 无相关合成媒体 | 无 |
| ADS-PUB-15 | N/A | 无儿童相关内容 | 无 |
| ADS-PUB-16 | N/A | 无敏感事件内容 | 无 |
| ADS-REST-01 | N/A | 无性相关内容 | 无 |
| ADS-REST-02 | N/A | 无血腥或粗俗内容 | 无 |
| ADS-REST-03 | N/A | 无武器内容 | 无 |
| ADS-REST-04 | N/A | 无烟草或毒品内容 | 无 |
| ADS-REST-05 | N/A | 无酒类内容 | 无 |
| ADS-REST-06 | N/A | 无赌博内容 | 无 |
| ADS-REST-07 | N/A | 无药品内容 | 无 |
| ADS-REST-08 | N/A | 尚未投放广告；嵌入视频不遮挡正文 | 无 |
| ADS-PRIV-01 | Pass | 隐私政策披露 Google 广告与分析的数据使用 | 无 |
| ADS-PRIV-02 | Pass | 已披露第三方 Cookie 与标识符 | 无 |
| ADS-PRIV-03 | Pass | 未向 Google 传递个人身份信息 | 无 |
| ADS-PRIV-04 | Pass | 已使用 Google CMP，默认同意状态为 denied | 在后台确认 EEA/英国/瑞士消息已发布 |
| ADS-PRIV-05 | N/A | 不收集精确位置 | 无 |
| ADS-PRIV-06 | N/A | 非面向儿童的网站 | 无 |
| ADS-PRIV-07 | Pass | 无操作 Google 域 Cookie 的代码 | 无 |
| ADS-PRIV-08 | N/A | 无儿童定向或受众列表 | 无 |
| ADS-PRIV-09 | N/A | 不涉及住房、就业、信贷广告 | 无 |
| ADS-PRIV-10 | N/A | 尚未启用个性化广告 | 启用时复核 |

检查项计数：73 / 73。

## 参考

- [AdSense Program policies](https://support.google.com/adsense/answer/48182)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [AdSense 内容和用户体验](https://support.google.com/adsense/answer/10015918)
- [Google 网页搜索垃圾内容政策（含规模化内容滥用）](https://developers.google.com/search/docs/essentials/spam-policies)
