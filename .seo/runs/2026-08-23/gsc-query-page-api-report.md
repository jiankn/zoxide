# zoxide.org GSC API：28 天 Query × Page 诊断

生成日期：2026-08-23  
数据源：Google Search Console Search Analytics API  
属性：`sc-domain:zoxide.org`（`siteOwner`）  
搜索类型：Web  
数据状态：Final  
模式：dry run，仅拉取与诊断，不修改站点

## 时间窗口

- Recent：2026-07-24 至 2026-08-20，2,294 个 Query × Page 行。
- Previous：2026-06-26 至 2026-07-23，2,077 个 Query × Page 行。
- 2026-08-20 是 API 当前返回的最新完整日。

## 全站结果

| 指标 | Previous | Recent | 变化 |
|---|---:|---:|---:|
| 点击 | 1,549 | 1,439 | -110（-7.1%） |
| 展示 | 59,435 | 44,865 | -14,570（-24.5%） |
| CTR | 2.61% | 3.21% | +0.60 个百分点 |
| 平均排名 | 4.81 | 6.28 | 后移 1.46 位 |
| Query × Page 行数 | 2,077 | 2,294 | +217（+10.4%） |

结论：流量仍在走弱，排名也真实下降；但点击下降幅度远小于展示下降，CTR 反而改善。说明一部分损失来自低点击曝光和异常/低价值长尾减少，而不是每一类有效搜索都同比例恶化。

## 是否只是查询结构把平均排名拉差

不是。

| 固定样本 | Previous 排名 | 用 Previous 曝光权重计算 Recent 排名 | 同组合排名变化 | Recent 实际组合变化影响 |
|---|---:|---:|---:|---:|
| 两窗共有的 1,127 个 Query × Page | 4.19 | 5.18 | 后移 0.99 位 | 组合变化改善 0.27 位 |
| 两窗均至少 3 展示的 600 个组合 | 3.95 | 4.50 | 后移 0.55 位 | 组合变化改善 0.21 位 |

固定 Query × Page 和旧曝光权重后仍然后移，因此存在真实的同词同页排名下降。与此同时，完整 Query × Page 表的平均排名由 4.48 变为 6.69，说明新出现或仅单窗披露的低位长尾又进一步拉差了表格均值。

## 最大页面损失

页面指标是该页全部已披露 Query 的汇总，平均排名会受到该页查询结构变化影响。

| 页面 | 点击 | 展示 | 平均排名 | 判断 |
|---|---:|---:|---:|---|
| `/tutorials/install-ubuntu/` | 44 → 21 | 300 → 273 | 4.95 → 9.64 | 最大点击损失，安装词需要优先复核 |
| `/zh/` | 73 → 54 | 338 → 278 | 3.23 → 1.88 | 排名改善，主要是需求/曝光与 CTR 变化 |
| `/tutorials/install-macos/` | 59 → 46 | 337 → 324 | 4.80 → 7.25 | 点击与排名同时变弱 |
| `/blog/zoxide-alternatives-comparison-open-source/` | 18 → 9 | 538 → 261 | 7.25 → 8.90 | 曝光减半并后移 |
| `/tutorials/fzf-integration/` | 60 → 53 | 202 → 187 | 3.53 → 9.16 | 核心词仍强，长尾结构明显变弱 |
| `/blog/mastering-terminal-navigation-zoxide-guide/` | 6 → 0 | 829 → 477 | 5.44 → 10.16 | how-to 内容簇继续走弱 |
| `/blog/zoxide-init-guide/` | 23 → 17 | 610 → 651 | 4.27 → 6.70 | 展示增长但点击减少、排名后移 |
| `/blog/troubleshooting-zoxide-no-match-found/` | 13 → 7 | 448 → 577 | 6.86 → 8.90 | 展示增长但效率下降 |

## 重点 Query × Page 组合

| Query × Page | 点击 | 展示 | 排名 | 诊断 |
|---|---:|---:|---:|---|
| `zoxide` → `/` | 186 → 190 | 4,690 → 4,059 | 2.72 → 2.68 | 首页品牌结果稳定，属于 PROTECT |
| `zoxide` → `/zh/` | 70 → 51 | 277 → 240 | 1.74 → 1.62 | 排名未降，损失不应归因于 ranking |
| `zoxide init` → init guide | 15 → 3 | 44 → 37 | 1.55 → 1.30 | 排名改善但 CTR 明显下降 |
| `install zoxide ubuntu` → Ubuntu tutorial | 14 → 3 | 37 → 30 | 1.41 → 1.97 | 排名小幅后移，点击降幅更大 |
| `zoxide fzf` → fzf tutorial | 35 → 26 | 81 → 71 | 1.02 → 1.03 | 核心排名稳定，主要是曝光/CTR 下降 |
| `zoxide macos` → macOS tutorial | 17 → 9 | 34 → 30 | 1.06 → 1.33 | 小幅排名与点击走弱 |
| `zoxide alias` → alias page | 9 → 2 | 38 → 23 | 1.29 → 1.35 | 主页面排名稳定，需求/CTR 下降 |
| `zoxide no match found` → no-match page | 5 → 0 | 35 → 25 | 1.37 → 1.60 | 仍在前列，但点击丢失 |

这组精确组合说明：全站平均排名下降是真实的，但最大点击损失中也有不少核心 Query × Page 仍位于第 1～2 名。不能把每个页面的点击减少都解释为排名下降，还需要区分搜索需求、SERP 点击分流和多 URL 展示。

## URL 竞争仍然明显

- `zoxide install`：Recent 至少四个主要 URL 分流；第一页面展示份额仅 30.1%。
- `install zoxide`：第一页面展示份额仅 32.7%。
- `what is zoxide`：首页、what-is blog、tutorial hub、download 同时出现；第一页面份额仅 26.4%。
- `how to use zoxide`：mastering、quick-start、首页和 blog hub 同时出现；第一页面份额仅 25.8%。
- `zoxide fzf`：英文 tutorial 与英文 blog 都是 71 展示；tutorial 为 26 点击、位置 1.03，blog 为 10 点击、位置 3.39。核心主页面仍应是 tutorial。

有意义的主 URL 切换包括：

- `zoxide windows`：Windows tutorial → 首页。
- `zoxide usage`：首页 → quick-start。
- `zoxide alternatives`：alternatives roundup → autojump blog。
- `zoxide brew` 与 `brew zoxide`：download 和 macOS tutorial 互相切换。
- `could not find fzf`：fzf blog → fzf tutorial。

## 正向信号

- 首页总点击 355 → 357，核心品牌落地页稳定。
- Windows tutorial 点击 16 → 26，是本轮最大页面级增长。
- `/zh/tutorials/quick-start/` 点击 13 → 16、展示 110 → 150、排名 4.15 → 3.62。
- `zoxide install` → 首页点击 12 → 23，排名维持约 2.1。
- `install zoxide windows` → Windows tutorial 新增 7 点击，位置 1.88。

## 优先级

1. **P0：Ubuntu/macOS 安装簇。** 先逐 Query 检查标题、首屏答案、版本与平台安装路径；保护 Windows tutorial 的增长，不做全站统一模板式改写。
2. **P0：how-to/usage 内容簇。** mastering 与 quick-start 继续分流；先明确“完整使用指南”和“5 分钟验证教程”的职责，再观察一个窗口，暂不直接 301。
3. **P1：fzf 合并方向不变。** tutorial 核心词位置约 1，blog 约 3.4；先搬独有内容和内链，再单独处理重定向。
4. **P1：install/what-is 的入口收敛。** 首页可保留品牌与泛意图，download/平台教程应承接明确任务词，hub 页面只做导航。
5. **PROTECT：首页与 Windows tutorial。** 避免大改 title、H1、URL 或 canonical。

## 数据质量

- Query × Page 披露展示覆盖率：40.5% → 46.7%。
- Query × Page 披露点击覆盖率：53.8% → 51.6%。
- GSC 会隐藏匿名低量查询，因此不能把未披露行当成零。
- 页面汇总平均排名会受到 Query 组合变化影响；具体行动优先使用精确 Query × Page 组合，而不是只看页面平均排名。

## 产物与状态

- Recent CSV：`.seo/runs/2026-08-23/source/api/recent_28d-query-page.csv`
- Previous CSV：`.seo/runs/2026-08-23/source/api/previous_28d-query-page.csv`
- API manifest：`.seo/runs/2026-08-23/source/api/manifest.json`
- 可复用拉取脚本：`.seo/scripts/gsc_query_page_fetch.py`
- 分析脚本：`.seo/scripts/analyze_gsc_query_page.py`
- OAuth token：保存在仓库外，未写入报告或 Git。
- 站点代码修改：无。
- 提交/部署：无。
