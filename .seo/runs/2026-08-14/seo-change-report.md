# SEO 变更报告：下载页官方安装包

日期：2026-08-14  
目标页面：`/download/`、`/zh/download/`、`/ja/download/`  
Git SHA：`713ede04ca2a1503707aa6b70415a121699b507f`（下载页）、`44fa88c0a4f304b4b080649a60361403c6ee7ce1`（sitemap）  
部署：GitHub Actions → Cloudflare Workers，已成功

## 证据与判断

- GSC 对比显示 `/download/` 的平均排名从 5.55 后移到 6.01，展示下降 41.3%。
- 2026-07-04 发布的 zoxide 0.10.0 让官方 GitHub、发行版文档和新出现的 `zoxide.net/downloads/` 在下载意图上获得更新鲜、更完整的结果。
- 因此本轮把现有下载页归为 `IMPROVE`：保留 URL、canonical 和现有安装说明，只补足真实用户需要的当前官方安装包入口。

## 已实施

- 增加 zoxide 0.10.0 官方 GitHub Release 下载区。
- 覆盖官方发布的全部 17 个二进制/软件包资源：macOS、Windows、Linux musl、Debian/Ubuntu 和 Android。
- 增加官方 release notes 与源码 ZIP/TAR.GZ 链接。
- 英文、简体中文、日文使用同一数据结构和各自本地化说明。
- 明确提示优先使用包管理器；直接下载适合手动安装，且本站不托管、不转存二进制。
- 将二进制验证说明扩展到全部语言版本。
- 将三个下载页在 sitemap 中的真实内容更新时间统一更新为 `2026-08-14`。

## 安全边界

- 未新增页面，未改路由、canonical、hreflang 或 sitemap。
- 未复制第三方安装包，所有下载按钮直接指向 zoxide 官方 GitHub Release。
- 未修改其他已有的用户工作区变更。

## 验证结果

- 官方 GitHub API 对比：本地 17 个资源名与 v0.10.0 官方 17 个资源名完全一致。
- JSON：`messages/en.json`、`messages/zh.json`、`messages/ja.json` 解析通过。
- TypeScript：`npx tsc --noEmit` 通过。
- ESLint：下载页通过。
- Next.js production build：通过，共生成 195 个静态页面。
- 本地浏览器：三种语言均渲染 17 个官方直链；`lang`、canonical、4 个 hreflang alternate 正常；无横向溢出、无控制台错误。
- 线上 sitemap：三个下载 URL 均返回 `lastmod=2026-08-14`。

## 观察窗口

上线后不要按单日平均排名判断。用两个不重叠的 28 天窗口比较，并把下载/安装任务词与品牌词、无效长尾分开观察。核心指标是 `/download/` 的任务型 Query 点击、CTR 和 Query→Page 稳定性。
