# 回撤点：2026-11-07 的网站状态

如果改版后效果不好、排名下降，按下面的步骤可以随时回到 **2026-11-07（改版前、也在 11-08 上午 AI 改动之前）** 的状态。

## 回撤点是什么

| 项 | 值 |
|---|---|
| Git 标签 | `rollback-2026-11-07`（已推送到 GitHub） |
| 对应提交 | `7f6a209` Rewrite Arch and NixOS guide from booted-system tests（2026-10-09 01:11） |
| 对应线上版本（Cloudflare Worker `zoxide`） | `fb05dcb6-a462-41d1-a35f-1d949f0a9c76`（2026-10-09 01:13 上线，一直用到 2026-11-08 上午） |
| 不包含 | 2026-11-08 上午的两次 AI 改动（`32212a4`、`68b5db4`，线上版本 `e52fd88c`、`0ad8f928` 等）以及之后的改版 |
| 改版前的流量基线 | `.seo/runs/2026-11-08/gsc-baseline-pre-redesign.json`：截至 11-07 的 28 天 1,239 次点击、31,460 次展示；首页 443 次点击、平均排名 3.2 |

## 第一步：线上立刻回撤（1 分钟生效）

只切换线上版本，不动代码。

```bash
npx wrangler rollback fb05dcb6-a462-41d1-a35f-1d949f0a9c76 --message "rollback to 2026-11-07"
```

然后打开 https://zoxide.org/ 确认首页回到旧版。

注意：之后只要有人再执行一次 `npm run deploy`，线上就会被当前代码覆盖。所以线上回撤后，还要做第二步。

## 第二步：代码回到回撤点

保留历史、最稳妥的做法（新建一个提交，把代码内容恢复成 11-07 的样子）：

```bash
git checkout main
git checkout rollback-2026-11-07 -- .
git commit -m "Revert site to rollback-2026-11-07"
git push origin main
```

`docs/`、`.seo/` 等目录下回撤点之后新加的文件不会被删除，不影响网站。确认无误后可以重新部署：

```bash
npm run deploy
```

## 怎么判断要不要回撤

改版上线后至少等 **3 周** 再下结论（Google 重新抓取、排名稳定需要时间），用同样的口径和基线比：

- 28 天总点击跌幅超过 25%，或首页点击跌幅超过 30%；
- 或主要页面（首页、install-macos、install-windows、install-ubuntu、fzf-integration、zoxide-commands）平均排名普遍下滑 2 位以上。

满足任一条，就考虑回撤。只是展示量下降而点击稳定，不算排名下降。
