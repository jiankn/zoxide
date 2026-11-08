# zoxide.org 设计系统（2026-11-08 改版）

## 视觉世界：线路图

访客的处境：白天对着显示器，旁边开着终端，要的是“照着抄就能跑”的命令。整站像一张地铁线路图：每个 Shell 一条线路色，安装步骤是线路上的站点，命令块是深色的“站牌”。

- 浅色地面 + 海军蓝墨色；只有命令块是深色。
- 线路色只用来区分 Shell，不做装饰。
- 排名模拟器是唯一用“借阅卡日期章”的页面（落章动画 0.35 秒），其他页面不借用。

## 颜色（`app/globals.css` 的 `:root`）

| Token | 值 | 用途 |
|---|---|---|
| `--ink` | #14213d | 正文、标题、导航栏和页脚底色 |
| `--ink-soft` | #55607a | 次要文字 |
| `--rule` | #dfe3ea | 分隔线、边框 |
| `--background` | #f7f8fa | 页面底色 |
| `--paper` | #ffffff | 卡片、回执 |
| `--code-bg` / `--code-fg` | #0f1729 / #e8edf7 | 命令块 |
| `--line-zsh` | #00985f | zsh 线路；也是品牌强调色（导航当前项、页脚顶线、提示条左边线） |
| `--line-bash` | #d6402b | bash 线路 |
| `--line-fish` | #e8a317（文字用 `--line-fish-text` #8a5a00） | fish 线路 |
| `--line-powershell` | #2f6fd6 | PowerShell 线路；焦点环 |
| `--state-caution` | #c98a12 | 回执“有注意事项” |
| `--state-untested` | #8a94a6 | 回执“没测过” |

旧页面里大量的 Tailwind `blue-*` / `gray-*` 在 `@theme` 里整体映射成海军蓝和冷灰，没逐个改写的页面也自动进入新视觉。新代码优先用 `text-ink`、`border-rule`、`bg-paper` 这些语义类。

## 字体

- 界面和标题：Overpass（400/600/700/800），中文回落 PingFang SC / Microsoft YaHei。
- 命令：JetBrains Mono（400/600），**关掉连字**，否则 `--cmd` 会显示成破折号。
- 旧的 `font-serif` 已指向 Overpass，全站只有一套标题字体。

## 组件

| 组件 | 位置 | 要点 |
|---|---|---|
| 配置生成器 | `components/SetupBuilder/SetupBuilder.tsx` | `full`（首页，读写网址参数 `?os=&shell=`）和 `compact`（下载页、安装教程顶部，`initial` 预选）。四站：安装 / 接入 Shell / 检查 / 第一次跳转 |
| 测试回执 | `components/SetupBuilder/TestReceipt.tsx` | 三种状态：Tested / 有注意事项 / Not tested yet。只写真实跑过的组合，并链接原始记录 |
| 测试矩阵 | `components/SetupBuilder/TestMatrix.tsx` | 点格子切换首页生成器 |
| 命令块 | `components/TaskGuides/CommandBlock.tsx`、`components/CodeBlock/CodeBlock.tsx` | 深色底，复制按钮常驻（触屏没有悬停），提示符不可选中、不进剪贴板 |
| 排名模拟器 | `components/RankingSimulator/` | 规则全在 `lib/zoxide-rank.ts`（纯函数，有测试） |
| 模拟器入口 | `components/RankingSimulator/SimulatorCallout.tsx` | 只放在“跳错目录 / no match”类排错文章 |

## 数据真实性规则

- 回执、教程里的输出只能来自 `public/evidence/` 里的原始记录或教程写明的实测。
- 新增组合要先跑实测（脚本在 `.ci/evidence/`、`.ci/windows/`），归档后才写回执。
- 模拟器规则改动必须同时改 `lib/zoxide-rank.test.ts`，并注明对照的源码文件或实测记录。

## 不要做

- 工具控件旁边放广告。
- 渐变、发光、玻璃拟态卡片。
- 给没测过的组合写“Tested”。
