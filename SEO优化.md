# SEO 与 UX 优化方案（zoxide.org）

本文档为非侵入式可执行方案，目标在于在不立即改动代码的前提下，给出一套兼顾搜索引擎优化（SEO）与用户体验（UX）的落地建议与执行清单，便于按优先级实施与验证。

---

## 目标
- 保持良好用户体验：首次访问自动建议或临时跳转至用户语言页面，同时提供显著的语言切换入口并记住偏好。  
- 优化搜索引擎索引与展示：确保各语言页面被正确抓取、索引并向搜索引擎明确语言关系（hreflang + x-default），避免语言版本相互冲突或权重被意外分散。  
- 最小化风险：采用临时跳转 / 建议跳转 + cookie 的方式替代强制永久重定向，便于 A/B 与回滚。

---

## 当前问题（摘要）
- 根域 `/` 基于浏览器语言做了自动重定向，导致 Search Console 中 `/en/`（或其他语言子目录）显示量增多，裸域 `zoxide.org` 的展示被稀释。  
- 需要确认和完善 `hreflang`、`x-default`、`canonical`、`Vary` header 与 sitemap，以保证搜索引擎清楚每个 URL 的语言/区域目标。

---

## 总体建议（通用最佳实践）
1. URL 结构：继续使用子目录（`/en/` `/ja/` `/zh/`）作为每种语言的独立 URL；保持一致性。  
2. hreflang：每个语言页面必须输出完整的 hreflang 集合，并包含 `x-default`（指向语言选择页或裸域）。  
3. 根域策略：不要把根域永久 301 重定向到某个语言。建议：
   - 将根域作为“语言选择页”或轻量默认页（可用于 `x-default`）；或
   - 使用临时跳转（302/307）+ 设置首选语言 cookie（或 localStorage），以便两次及以后请求直接跳转。  
4. 用户体验：在页面顶部提供明确的语言切换器，用户选择应持久化（cookie / account setting）。  
5. HTTP头：对基于 `Accept-Language` 返回不同内容的路径，务必返回 `Vary: Accept-Language`。  
6. Sitemap：为每种语言生成独立 sitemap（或在 sitemap 中包含所有语言版本），并提交给 Google Search Console。  
7. 测试与监控：建立抓取测试脚本，模拟不同 Accept-Language 与 UA；在 GSC 中监控 hreflang 错误、覆盖率与展示变化。

---

## 具体执行步骤（按优先级）

### 第一组 — 最低风险、即时可做（建议优先）
1. 审计 hreflang / x-default / canonical（读取模板或页面渲染输出）  
   - 输出清单：哪些页面缺失 hreflang、哪些 hreflang 指向不完整、x-default 指向是否合适。  
2. 生成并提交 sitemap（per-language）  
   - 为 `/en/` `/ja/` `/zh/` 各生成 sitemap 文件，或生成 sitemap index 指向多个 language-sitemap。  
   - 在 GSC 中提交 sitemap URL。  
3. 设置并验证 `Vary: Accept-Language` 响应头（静态/SSR/edge 中配置）。  
4. 检查 Search Console 中现有的 hreflang 报错并记录（便于回归验证）。

### 第二组 — 中等风险（短期内可部署，需回滚方案）
5. 根域策略调整（可选两种实现）  
   - A. 推荐（折中）：根域显示语言选择页（或轻量默认页），同时保留基于 Accept-Language 的“建议”弹窗和一次性临时重定向（302/307）+ cookie（记录用户偏好）。  
   - B. 保守：保留当前行为（永久或服务端跳转），但确保 `x-default` 指向合适的页面并在 GSC 中提交完整 hreflang。  
6. 实现临时跳转逻辑：首访检测后 302 跳转至对应语言并设置 cookie，之后按 cookie 跳转或直接进入对应语言页。  
7. 在页面顶部加入明显的语言切换器并持久化用户选择（cookie/localStorage）。  

### 第三组 — 高级 & 验证（上线后监控与优化）
8. 运行抓取测试：模拟 Googlebot、Bingbot 与真实浏览器的 Accept-Language 头，记录重定向路径与返回状态。  
9. 监控与指标：在 Google Search Console、Google Analytics（或你使用的分析工具）中追踪：语言落地页的展示/点击、跳出率、平均位置变化、爬取频率。  
10. 持续验证 hreflang：若发现 hreflang 冲突或循环引用，立即修复并重新提交 sitemap。  

---

## 具体输出与交付品（交付清单）
- `SEO优化.md`（本文件）  
- hreflang 审计报告（表格：页面、hreflang 当前、建议修复）  
- per-language sitemap 文件（`sitemap-en.xml`, `sitemap-ja.xml`, `sitemap-zh.xml`）与 sitemap-index（如需）  
- 根域语言选择页草案（HTML / copy / UX 文案）与 cookie 行为定义  
- 抓取测试脚本与测试结果日志（示例：Accept-Language 变体）  
- GSC 提交记录与监控面板（关键 metric 截图/说明）  

---

## 验证检测（部署后必须做）
1. 在 GSC 中确认 sitemap 已被抓取，无 hreflang 错误。  
2. 使用抓取脚本验证不同 Accept-Language 是否得到预期的临时跳转或页面返回（并检查 `Vary` 头）。  
3. 观察 2–4 周内 Search Console 的展示量/平均位置变化，确保无负面影响。  

---

## 回滚策略
- 若某项改动导致收录或展示显著下降（>20% 下滑或重要警告），按下列顺序回滚：  
  1. 还原根域重定向逻辑（恢复到改动前状态）。  
  2. 还原临时跳转逻辑/cookie 设置。  
  3. 在 GSC 中重新提交修复后的 sitemap 与请求抓取。  
  4. 与团队沟通并分析抓取日志后再逐步恢复变更。

---

## 时间建议（示例）
- 第 0 周（准备）：hreflang 审计 + 生成 sitemap（1–3 天）  
- 第 1 周（短期部署）：提交 sitemap、设置 Vary、在根域放置语言选择页或实施临时跳转（2–5 天）  
- 第 2–4 周（监控与调整）：搜集 GSC 数据并修复问题（持续监控）  

---

如果你同意此方案，我可以（不改代码）：
- 生成 hreflang 审计清单（读取当前页面 metadata 并输出表格），或  
- 生成示例 `sitemap-en.xml` / `sitemap-index.xml` 的模板，供你直接上传到服务器 / Vercel。  

请告诉我你希望先得到哪一份交付物（hreflang 审计 或 sitemap 模板），我将继续准备。  


