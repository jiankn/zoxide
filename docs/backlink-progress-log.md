# 外链建设进度日志

本文件按轮次追加，不覆盖历史记录。每轮记录筛选、制作、测试、提交准备、平台状态、用户动作和下一次接力入口。

主台账：[`backlink-anchor-ledger.md`](backlink-anchor-ledger.md)  
关键词计划：[`gsc-keyword-backlink-plan-2026-08-08.md`](gsc-keyword-backlink-plan-2026-08-08.md)  
活动台账：[`backlink-campaign-2026-08-06.md`](backlink-campaign-2026-08-06.md)

## 2026-08-08 / 第 1 轮：建立台账并准备平台提交

### 本轮状态

**进行中**。已完成筛选、资产准备、测试和提交材料整理；没有把待审核 PR、预览页或包元数据误计为完成外链。

### 已完成

- 建立关键词到目标页的路由：commands、install、definition、diagnostics、comparison。
- 创建主记录文件 [`backlink-anchor-ledger.md`](backlink-anchor-ledger.md)，记录锚文本、目标 URL、外链地址、日期、`rel`、索引状态、证据和下一步。
- 准备并验证 `zoxide-doctor` CLI 资产：MIT、跨平台、无运行时依赖，Arch CI 和安装 smoke test 已通过。
- 准备 Devhints PR #2229，目标锚文本为 `zoxide commands reference`，目标页为 `https://zoxide.org/blog/zoxide-commands/`。
- 准备 OpenCLI PR #3，目标为 `https://zoxide.org/tools/zoxide-doctor/`；当前 Vercel 预览等待维护者授权。
- 按维护者要求将 Tiny Tool Town 从 PR #726 改为 Issue #725；五个标签的自动检查已通过并标记为 `ready-to-approve`。
- 创建 OSSDrop PR #5，仅新增一条 `data/tools.json` 记录；代表性详情页审计为 HTTP 200、`index, follow`，目标链接无阻塞性 `rel`。
- DEV.to 和 Hashnode 的已发布页面已记录真实的 noindex/nofollow 与 nofollow/UGC 状态。
- AUR 注册失败，按用户决定跳过；测试产物保留但已冻结，不再重试。

### 当前统计

| 项目 | 数量 |
|---|---:|
| 源仓库/配置资产 | 2 |
| 公开 listing | 2 |
| 已发布引用根域 | 3 |
| Follow + indexable 已完成 | 0 |
| 待审核外部贡献 | 4 |
| 用户侧可提交平台 | 0 |
| 已阻塞平台 | 2 |
| 已拒绝/跳过平台 | 7 |

### 用户动作

- 本轮没有需要用户继续提交的已准备平台。
- AUR 已明确跳过，不要重新注册或提交。
- npm 后续若要重启，需要用户自行完成 npm 登录或配置 token；聊天中不要发送 token。

### 下次接力入口

1. 先读取本文件最新一轮和主台账的 `Pending` 行。
2. 复核 Devhints #2229、OpenCLI #3、Tiny Tool Town #725、OSSDrop #5 的实时状态。
3. 任何平台合并/批准后，审计最终公开详情页：HTTP 2xx、无 `noindex`、目标 URL、精确锚文本和 `rel`。
4. 只有最终公开页审计通过，才把对应行从 `Pending` 改为 `Completed`，并增加唯一引用根域统计。
5. 新一轮完成后，在本文件追加新的日期小节，不修改本轮历史。

### 本轮项目文件

- `docs/backlink-anchor-ledger.md`
- `docs/backlink-progress-log.md`
- `docs/backlink-campaign-2026-08-06.md`
- `docs/gsc-keyword-backlink-plan-2026-08-08.md`
- `docs/backlink-assets/aur-zoxide-doctor-submission-2026-08-08.md`

## 2026-08-08 / 第 2 轮：复核公开页并更新完成状态

### 本轮状态

**进行中**。本轮重新审计了已发布页面和四个外部贡献的实时状态；只有 DEV.to 达到完成条件，其余贡献仍等待维护者合并或部署。

### 新证据

- DEV.to 页面 `https://dev.to/jiankn/zoxide-setup-that-actually-works-install-initialize-and-verify-2dng` 返回 HTTP 200，当前没有页面级 `noindex`/`nofollow`；`what zoxide is`、`install zoxide`、`zoxide commands reference` 三条链接均为 `noopener noreferrer` 且可跟随，已从 noindex listing 改为 follow + indexable completed。
- Devhints PR #2229、OpenCLI PR #3、Tiny Tool Town Issue #725、OSSDrop PR #5 均仍为 open；Tiny Tool Town 仍带 `ready-to-approve`。
- Tiny Tool Town 预期页和 Devhints 预期页仍返回 404，不能提前计入完成。
- OSSDrop 预期页当前返回 404，并渲染 `noindex` fallback，没有 `https://zoxide.org/tools/zoxide-doctor/` 目标链接；PR #5 继续保持 pending。
- `zoxide-doctor` v0.1.0 发行包重新完成本地 lint、7 项测试、`npm pack --dry-run`、tarball 安装和 `--help` smoke test；GitHub main 分支最新 CI/AUR 验证均为 success。npm 发布仍只差账号认证。

### 更新后统计

| 项目 | 数量 |
|---|---:|
| 源仓库/配置资产 | 2 |
| 公开 listing | 2 |
| 已发布引用根域 | 3 |
| Follow + indexable 已完成 | 1 |
| 待审核外部贡献 | 4 |
| 用户侧可提交平台 | 0 |
| 已阻塞平台 | 2 |
| 已拒绝/跳过平台 | 7 |

### 下一步

1. 继续等待四个维护者贡献；下一次接力先复核最终公开页，不以 PR 状态代替发布证据。
2. 若要增加新的可验证根域，完成 npm 登录或配置仓库 `NPM_TOKEN` 后，从已验证的 v0.1.0 tag 触发 `Publish to npm` workflow。
3. npm 页面公开后，再提交 Terminal Trove；此前不提交缺少安装命令的目录条目。

## 2026-08-08 / 第 3 轮：npm 发布验收完成

### 本轮状态

**已完成 npm listing，整体活动继续进行中**。Owner 已确认 npm 页面人工验收通过。

### 新证据

- npm 包页面：`https://www.npmjs.com/package/zoxide-doctor`
- Registry API 返回 `zoxide-doctor@0.1.0`，Homepage 为 `https://zoxide.org/tools/zoxide-doctor/`。
- Tarball：`https://registry.npmjs.org/zoxide-doctor/-/zoxide-doctor-0.1.0.tgz`
- GitHub Actions 发布运行 `31260656835` 为 success，并生成 provenance。
- npm listing 已从 blocked 移至 completed；Terminal Trove 解除“缺少 registry install command”的阻塞条件，进入下一步提交准备。

### 更新后统计

| 项目 | 数量 |
|---|---:|
| 源仓库/配置资产 | 2 |
| 公开 listing | 3 |
| 已发布引用根域 | 4 |
| Follow + indexable 已完成 | 2 |
| 待审核外部贡献 | 4 |
| 用户侧可提交平台 | 0 |
| 已阻塞平台 | 1 |
| 已拒绝/跳过平台 | 7 |

### 下一步

1. 准备 Terminal Trove 条目：使用 npm 安装命令 `npm install -g zoxide-doctor`，并补充真实预览图后再提交。
2. 继续轮询 Devhints #2229、OpenCLI #3、Tiny Tool Town #725、OSSDrop #5；只有最终公开详情页通过审计才改为 completed。
3. npm 后续如启用 Trusted Publishing，应在包页面 Settings 中配置 GitHub Actions，之后再撤销长期 `NPM_TOKEN`。

## 2026-08-08 / 第 4 轮：完成 Terminal Trove 预览资产

### 本轮状态

**预览资产已完成，Terminal Trove 等待 owner 在登录浏览器中提交。** 由于提交页触发 Cloudflare challenge，未代替 owner 绕过验证或提交账号信息。

### 新证据

- 在 `jiankn/zoxide-doctor` 主仓库新增真实终端预览图：
  `https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/docs/assets/zoxide-doctor-terminal-preview.png`
- 图片由已发布的 `zoxide-doctor@0.1.0` tarball 实际运行 `zoxide-doctor --shell bash --json` 的输出制作，Git commit 为 `8cae26b`。
- GitHub raw PNG、GitHub 文件页和 README 均返回 HTTP 200；README 已引用该图片。
- Terminal Trove 提交字段、安装命令、目标网站和预览图地址已整理到：
  `docs/backlink-assets/terminaltrove-zoxide-doctor-submission-2026-08-08.md`

### Owner action

1. 在登录浏览器打开 `https://terminaltrove.com/submit/`，通过 Cloudflare challenge。
2. 按提交包填写 `zoxide-doctor`、`npm install -g zoxide-doctor`、工具指南 URL、仓库 URL 和预览图。
3. 提交后不要把 Terminal Trove 计入完成；等待 `https://terminaltrove.com/zoxide-doctor/` 公开，再进行 HTTP、noindex、目标链接和 rel 审计。

## 2026-08-09 / 第 5 轮：镜像发现、公开验收与待合并条目修正

### 本轮状态

**活动继续进行中。** 新发现一个普通 follow、可索引的自动镜像根域，并将两个 nofollow 镜像单独记录；四个维护者贡献仍未合并，Terminal Trove 已由 owner 提交但尚未生成公开页。

### 新证据

- `https://npm.io/package/zoxide-doctor` 返回 HTTP 200，页面自 canonical、`index, follow`，并以 `homepage` 文本普通链接到 `https://zoxide.org/tools/zoxide-doctor/`；仅含 `noopener noreferrer`，没有 `nofollow`、`ugc` 或 `sponsored`。该根域计入新增 follow + indexable RD。
- `https://libraries.io/npm/zoxide-doctor` 与 `https://www.jsdelivr.com/package/npm/zoxide-doctor` 均返回 HTTP 200、没有页面级 `noindex`，但目标链接含 `nofollow`；两者计入公开 nofollow 镜像，不计入 follow RD。
- `npms.io`、Snyk 与 unpkg 当前没有可审计的工具指南目标 HTML 链接；Packagephobia 返回 HTTP 429，均未计入。
- Devhints PR #2229、OpenCLI PR #3、Tiny Tool Town Issue #725、OSSDrop PR #5 仍为 open；Tiny Tool Town 继续带 `ready-to-approve`。Devhints 与 Tiny Tool Town 最终页仍为 HTTP 404；OSSDrop 预期页为 HTTP 200 fallback，但页面有 `noindex` 且没有目标链接。
- Terminal Trove 已由 owner 报告提交；`https://terminaltrove.com/zoxide-doctor/` 仍为 HTTP 404，因此状态改为待平台审核，不能计为外链完成。
- OpenCLI PR #3 更新为 commit `3d34b84`：安装和示例工作流统一使用已发布的 `npm install -g zoxide-doctor`。`npm run validate:data` 通过（185 CLI、162 makers、129 metrics）；Vercel 仍需维护者团队授权。

### 更新后统计

| 项目 | 数量 |
|---|---:|
| 源仓库/配置资产 | 2 |
| 已完成公开 listing | 6 |
| 已发布引用根域 | 7 |
| Follow + indexable 已完成 | 3 |
| 公开 nofollow/UGC listing | 6 |
| 待审核外部贡献 | 5 |
| 用户侧可提交平台 | 0 |
| 已阻塞平台 | 0 |
| 已拒绝/跳过平台 | 7 |

### 下一步

1. 仅轮询 Devhints #2229、OpenCLI #3、Tiny Tool Town #725、OSSDrop #5 与 Terminal Trove 预期公开页；任何 2xx 页面仍须复核 `noindex`、准确目标 URL 和 `rel`。
2. 保持 `zoxide-doctor` npm 元数据、README 和工具指南地址稳定，等待自动索引继续发现可审计镜像。
3. 不为同一个 npm 包制作无独立用途的 Docker、IDE 扩展或重复目录提交。

## 2026-08-09 / 第 6 轮：构建 zoxide-doctor MCP 集成

### 本轮状态

**新增资产已准备完毕，等待一次 npm 首次发布授权。** 该 MCP server 让 AI agent 在本地执行已有的只读 zoxide 诊断，而不是复制 README 或新增空壳目录条目。它具备官方 MCP Registry 所需的 `mcpName`、`server.json` 与 GitHub OIDC 发布路径。

### 新证据

- 建立公开源仓库：https://github.com/jiankn/zoxide-doctor-mcp
- `@jiankn/zoxide-doctor-mcp@0.1.0` 的包名在 npm 可用；仓库和 tag `v0.1.0` 已建立。
- MCP server 暴露 `diagnose_zoxide`，复用 `zoxide-doctor` 的 `runDiagnostics()`；默认不读取 profile，只有 `scan_config: true` 才会进行只读 profile 扫描，且不会写文件。
- `server.json` 的 MCP Registry name 为 `io.github.jiankn/zoxide-doctor`，`websiteUrl` 精确指向 `https://zoxide.org/tools/zoxide-doctor/`；本地元数据校验保证包版本、Registry 名称和 canonical URL 一致。
- 本地完成语法检查、5 项测试、metadata 校验、`npm pack --dry-run` 和 tarball 安装 smoke test；GitHub Actions `31297586502` 在 Linux、macOS、Windows 均成功。
- 官方 MCP Registry 当前接受 npm stdio server，GitHub OIDC 可用于 Registry 认证；最终 MCP Registry API 与下游聚合页面都必须在发布后逐页验收。

### 唯一 owner gate

在 `jiankn/zoxide-doctor-mcp` 的 Actions secrets 添加名称为 `NPM_TOKEN` 的 npm 发布 token，然后从 tag `v0.1.0` 手动运行 **Publish MCP server**。该工作流的 MCP Registry 发布使用 GitHub OIDC，没有第二个 MCP token。

操作包：`docs/backlink-assets/zoxide-doctor-mcp-publish-2026-08-09.md`

### 下一步

1. npm 与 MCP Registry 同一 workflow 成功后，验收 npm 页面、Registry API 的 `websiteUrl`，并搜索/审计 Smithery、Glama、PulseMCP、MCP.so 等实际下游页面。
2. 只将 HTTP 2xx、没有 `noindex`、含准确 canonical URL 且记录了 `rel` 的最终页面计入新增 RD；Registry API 元数据或 CI 成功本身不计为完成外链。

## 2026-08-09 / 第 7 轮：MCP 包与官方 Registry 发布验收

### 失败原因与修复

- 第一次从 `v0.1.0` 发布失败：npm 返回 `E404 Scope not found`，因为 `@jiankn` 不是该 npm 发布账号的有效 scope。根据现有 `zoxide-doctor` 的 npm maintainer，包名调整为 `@agoes/zoxide-doctor-mcp`。
- `v0.1.1` 的 npm 步骤已成功，但 Official MCP Registry 拒绝了 140 字符的 `server.json.description`，其限制为最多 100 字符。
- 修复提交 `e9429c4` 将描述压缩为 52 字符，把版本统一升为 `0.1.2`，并新增对该长度上限的 CI 校验。工作流 `31298580818` 在 Linux、macOS、Windows 全部成功。

### 发布与公开验收

- tag `v0.1.2` 的发布工作流成功：https://github.com/jiankn/zoxide-doctor-mcp/actions/runs/31298620506
- npm registry 已公开返回 `@agoes/zoxide-doctor-mcp@0.1.2`，包含 `https://zoxide.org/tools/zoxide-doctor/` homepage、tarball integrity 与 GitHub Actions provenance。
- npm package 页面：https://www.npmjs.com/package/@agoes/zoxide-doctor-mcp 。通过 reader 渲染可见 README 中两处准确工具指南链接；直接自动 HTTP 请求被 npm 的 bot 防护返回 403，因此未臆测 `rel`，也未把它计入新的 ordinary-follow HTML listing。
- Official MCP Registry API 返回 HTTP 200：https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jiankn%2Fzoxide-doctor/versions/latest 。记录为 `active`，版本 `0.1.2`，npm identifier 为 `@agoes/zoxide-doctor-mcp`，且 `websiteUrl` 精确为 `https://zoxide.org/tools/zoxide-doctor/`。
- Registry 是公开 JSON metadata，非 HTML anchor，因此没有 `rel`/ordinary-follow 语义。它作为新增 `modelcontextprotocol.io` 公开元数据根域记录，但不与已验证的 follow + indexable HTML RD 混算。

### 同步检查

- 使用 Agent Reach 的 Exa 技术搜索检查了精确 npm 包名和 MCP server name；发布后立即尚未发现可单独验收的 Smithery、Glama、PulseMCP 或 MCP.so 详情页。
- 这些聚合页属于自动同步，当前标注为 `pending_indexing`，不重复提交，也不提前计数。

### 更新后统计

| 项目 | 数量 |
|---|---:|
| 源仓库/配置资产 | 3 |
| 已完成公开 HTML listing | 6 |
| 已接受公开 metadata record | 1 |
| 已发布引用根域 | 8 |
| Follow + indexable 已完成 | 3 |
| 公开 nofollow/UGC listing | 7 |
| 待审核外部贡献 | 5 |
| 用户侧可提交平台 | 0 |
| 已阻塞平台 | 0 |
| 已拒绝/跳过平台 | 7 |

### 下一步

1. 等待并验收实际出现的 MCP 聚合详情页：HTTP 2xx、无 `noindex`、精确 canonical URL、并记录 `rel`；只有这种页面才可升级为普通外链。
2. 继续仅轮询 Devhints #2229、OpenCLI #3、Tiny Tool Town #725、OSSDrop #5 和 Terminal Trove 的最终公开页。
