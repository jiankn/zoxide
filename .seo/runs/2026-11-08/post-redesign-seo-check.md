# 改版上线当天 SEO 检查（2026-11-08）

数据：`post-redesign-check.json`（脚本 `.seo/scripts/gsc_post_redesign_check.py`，只读）。

## 结论

- **还看不到改版影响。** GSC 数据最新到 2026-11-07 16:00（太平洋时间）= 11-08 00:00 UTC；改版 11-08 04:34 UTC 上线。主要承接页最近一次被抓取都在上线前（首页 11-06），Google 仍在用旧版本。
- **上线前走势平稳**：近三周每天 17–69 次点击、平均排名 2.95–3.93；11-07 只有 21 次是因为当天数据只到下午 4 点，不是下滑。
- **技术要素没变**：20 个主要承接页都是 1 个 H1、自指 canonical、有 hreflang、可索引；标题和描述代码这次没改。模拟器页 Google 还不知道（未抓取）。

## 页面 ↔ 关键词（28 天：2026-10-09 至 11-05）

| 页面 | 主关键词 / 意图 | 排名 | 状态 |
|---|---|---|---|
| `/` | zoxide、zoxide install、zoxide setup、what is zoxide、各 shell 词 | 1.1–2.7 | 主落地页，正常 |
| `/tutorials/install-macos/` | zoxide mac、install zoxide mac | 1.0 | 正常 |
| `/tutorials/install-ubuntu/` | zoxide ubuntu、install zoxide ubuntu | 1.2–1.7 | 正常 |
| `/tutorials/install-windows/` | zoxide powershell、install zoxide windows | 1.0–1.8 | 正常；meta 描述写成 Scoop/Cargo，与正文（winget）不符 |
| `/tutorials/install-arch-nixos/` | zoxide arch | 1.7–1.8 | 正常 |
| `/tutorials/fzf-integration/` | zoxide fzf、fzf zoxide | 1.0–1.1 | 另有 “fzf vs zoxide” 171 展示、2 点击 |
| `/tutorials/quick-start/` | how to use zoxide | 1.3–2.0 | 正常 |
| `/blog/zoxide-init-guide/` | zoxide init、zoxide nushell | 1.3–2.2 | 正常 |
| `/blog/zoxide-alias-autocomplete/` | zoxide autocomplete、zoxide alias | 1.0 | 正常 |
| `/blog/zoxide-commands/` | zoxide remove path、zoxide commands | 1.1–2.0 | 正常 |
| `/blog/zoxide-command-not-found/` | zoxide z command not found | 1.3 | 也被拿去排 “no match found”（意图不对） |
| `/blog/troubleshooting-zoxide-no-match-found/` | zoxide: no match found | 1.0 | 展示少，被另两篇分走 |
| `/blog/zoxide-vs-autojump/` | zoxide vs autojump | 1.2 | 与 alternatives 页共享展示 |
| `/blog/zoxide-alternatives-comparison-open-source/` | zoxide alternatives | 1.5 | 正常 |
| `/download/` | 无专属词 | 2.4–7 | 1390 展示、5 点击，和首页抢 “zoxide install” |

多数“同一关键词出现两个页面”是首页和专页同时出现在结果里（展示数相同、专页拿点击），属于正常的站点双结果，不算内耗。

## 真正的意图冲突

1. **no match found**：`zoxide-not-working`（正文提到 9 次）和 `zoxide-command-not-found` 在排名 3 左右拿走大部分展示、0 点击；专页只在少数变体里出现。
2. **/download/**：标题 “download and install for Linux, macOS and Windows” 和首页、各系统安装教程意图重叠，现在又嵌了生成器，重叠更多。
3. **fzf vs zoxide**：比较类意图，落在“集成教程”上，标题不回答 “vs”，点击率 1%。
4. **what is zoxide / how does zoxide work**：首页赢 what is；博客 what-is 页排 5.5 无点击，它更适合专做 “how does zoxide work”。

## 建议节奏

观察期（至 2026-11-29）内不改标题和 URL，否则分不清排名变化是改版还是改标题造成的。可以先做的低风险项：修正 Windows 教程的错误 meta 描述。其余意图调整放到观察期结束后，按 ROLLBACK.md 的判断结果再动。
