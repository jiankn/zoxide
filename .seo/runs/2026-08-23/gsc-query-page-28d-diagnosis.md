# zoxide.org 28 天 Query × Page 流量诊断

诊断日期：2026-08-23  
模式：dry run，只生成报告，不修改站点  
目标属性：`sc-domain:zoxide.org`

## 数据状态

本机 Google 账号对 `zoxide.org` Search Console 属性有访问权限，但仓库与系统中没有可供脚本调用的 GSC OAuth/服务账号凭据；已登录 Chrome 中的 GSC 页面可以切到该属性，但页面读取持续超时。因此本轮没有把旧数据冒充为 2026-08-23 的实时 API 结果。

下面结论使用仓库内最近一组已经校验过的两个不重叠 28 天 Query × Page 窗口：

- Previous：2026-06-18 至 2026-07-15，2,169 行。
- Recent：2026-07-16 至 2026-08-12，1,895 行。
- Query × Page 已披露展示覆盖率：39.7% → 49.0%。
- Query × Page 已披露点击覆盖率：55.1% → 53.2%。

由于 GSC 会隐藏匿名低量查询，Query × Page 行数与合计不能等同于属性总量。

## 结论

流量确实有问题，排名也真实后移；但相邻两个 28 天窗口里，最大的直接变化是曝光/搜索可见度收缩，不能把全部流量损失都归因于排名。

| 指标 | Previous 28 天 | Recent 28 天 | 变化 |
|---|---:|---:|---:|
| 全站点击 | 1,652 | 1,373 | -279（-16.9%） |
| 全站展示 | 66,525 | 40,774 | -25,751（-38.7%） |
| 全站 CTR | 2.48% | 3.37% | +0.89 个百分点 |
| 展示加权平均排名 | 4.77 | 5.18 | 后移 0.42 位 |
| Query × Page 已披露点击 | 910 | 731 | -179（-19.7%） |
| Query × Page 已披露展示 | 26,426 | 19,959 | -6,467（-24.5%） |

CTR 上升而点击仍下降，说明结果获得展示后并没有整体变得更难点击；主要损失发生在“没有获得展示”这一层。与此同时，平均排名后移 0.42 位，证明排名走弱也在发生。若以更早的 28 天基线比较 Recent，平均排名从 3.80 后移到 5.18、后移 1.39 位，说明这不是只存在于单个窗口的小波动。展示与点击同时下降，因此也不是“新增很多低位长尾词把平均值拉差”。

## 下滑结构

1. **非品牌教程/任务页普遍后移。** `mastering`、`init`、`download`、`commands` 同时变弱；品牌词 `zoxide` 基本稳定（2.80 → 2.83），不是品牌需求整体崩塌。
2. **页面级信号分散会放大波动。** 已确认的冲突集中在 fzf、how-to-use、quick-start、download、init、commands 等意图簇。
3. **不是某个技术故障造成的全站掉量。** 之前抽查的重点页为 200、有自指 canonical、hreflang、robots 与 sitemap 正常；没有发现整站 noindex、错误 canonical 或大面积 404。
4. **时间上与 2026 年 6 月下旬后的 SERP 重排一致。** 这能支持“排名被重新评估”的判断，但不能仅凭相关性把全部损失归因于一次算法更新。

## 重点 Query × Page 证据

### 已明确的主页面

| 意图 | Recent 主页面 | 证据 | 判断 |
|---|---|---|---|
| `zoxide commands` | `/blog/zoxide-commands/` | 1/17，位置 2.53；basic tutorial 0/8，位置 8.62 | commands blog 为英文主页面 |
| `zoxide init` | `/blog/zoxide-init-guide/` | 9/36，位置 1.39；shell-setup 无该 query 披露行 | init blog 为英文主页面 |
| `zoxide fzf` | `/tutorials/fzf-integration/` | 25/60，位置 1.02；fzf blog 8/61，位置 3.36 | tutorial 点击与排名显著更强 |
| download | `/download/` | 候选页展示份额 98.5%；download blog 21 展示、0 点击 | download blog 是弱重复 |
| quick start | `/tutorials/quick-start/` | 候选页展示份额 80.7%，无有意义赢家切换 | blog quick-start 是弱重复 |
| autojump | `/blog/zoxide-vs-autojump/` | 149 展示、13 点击；comparison page 14 展示、0 点击 | 既有 blog 明确胜出 |

### 仍不应贸然合并的冲突

`how to use zoxide` 在 `/blog/mastering-terminal-navigation-zoxide-guide/` 与 `/tutorials/quick-start/` 之间仍接近分裂：Recent 分别为 0/73@3.38 与 3/70@4.03。前者赢展示和排名，后者赢点击；应先收紧内容职责，再用下一完整 28 天决定是否合并。

### Locale 不能照搬英文

中文 commands/usage 与 troubleshooting 的胜者和英文不同。中文 generic usage 更偏 `/zh/tutorials/basic-commands/`，中文通用故障页也更偏 tutorial；不能把英文 301 规则批量复制到中文、日文。

## 优先级

1. P0：继续固定每个意图的主 URL，并让站内链接统一投向主页面；优先 fzf、init、download、commands。
2. P1：只处理已有高置信弱重复；每次先搬独有内容、修内链和 hreflang，再做单跳重定向。
3. P2：`how to use zoxide` 保持观察，不立刻 301；2026-08-14 更新后的 download 页需要跑满一个新 28 天窗口再评价。

## 下一轮 API 验收口径

获取可复用的 Search Console OAuth/服务账号授权后，查询 `type=web`、`dataState=final`，分别拉取：

- Recent：最新完整数据日向前 28 天。
- Previous：紧邻的前 28 天。
- 维度：`query,page`，分页拉满 API 可返回行数。
- 同时按 `date`、`page`、`query` 单独拉属性总量，避免把 Query × Page 隐私隐藏行当成零。

核心验收：指定主 URL 的 query 展示份额是否稳定到 70% 以上、旧 URL 是否停止获得展示、主 URL 点击是否守住合并前合理总量，以及平均排名是否继续后移。

## 状态

- 项目审计：已完成，21 个路由。
- 代码修改：无。
- Git HEAD：`fc59b100667dc8cbaebf993c4e78c8d36b2d119e`。
- 提交/部署：无；本轮仅新增未提交诊断文件。
