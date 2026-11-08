---
version: 1
slug: "app-locale-page-tsx"
primary_target: "app/[locale]/page.tsx"
related_targets: ["app/[locale]/download/page.tsx"]
---

# 首页 + 配置生成器（含排名模拟器页）

模式：Operate（访客要完成一件事：拿到能用的命令）。
受众：开着终端的开发者，电脑访问为主，从“zoxide install / fzf / not working”类搜索进入。
任务：选系统和 shell，得到四步命令并确认 z 生效；坏了能找到原因。
证据：站内实测（macOS 26.6.2、Windows 11 23H2、Ubuntu 24.04 容器、Arch 容器、NixOS 26.05 虚拟机），/evidence/ 下的归档 JSON。
约束：三语；URL 不变；广告不放进工具交互区；“非官方”标识常驻。
未决：广告位最终位置、模拟器是否支持分享链接。

## Direction contract

THESIS: 首页就是工具。访客落地第一眼是“系统 × shell”选择器和按顺序排好的四步命令，每一套组合附一张测试回执；拒绝“大标题 + 介绍段落 + 三张功能卡片”的文档站首页。

OWN-WORLD: 地铁线路图。白色地面、深海军蓝导航条（#14213d），每个 shell 一条线路色（zsh 绿 #00985f、bash 红 #d6402b、fish 黄 #e8a317、PowerShell 蓝 #2f6fd6），安装步骤是线路上的站点圆环；Overpass 做界面字，JetBrains Mono 只用于命令；回执用等宽数字的定义列表，状态点绿色为已测、琥珀色为未测。

STORY: 访客知道这套命令在哪台机器上跑过、用的什么版本；相信它比 README 更贴合自己的环境；复制四步命令、看到 z 生效，出问题点右栏进入排错或模拟器。

FIRST VIEWPORT: 顶部海军蓝导航（Setup builder 为当前项）。左侧约 2/3：一行 H1、一句说明、System / Shell / Options 三排分段按钮；下方开始线路图的第一站。右侧约 1/3：上半“Already installed?”症状列表，下半测试回执卡片（随选择实时更新）。主操作是第一站命令块的 Copy 按钮。

FORM: 自定义方向“线路图生成器”，在我的候选列表中排第 1（以 IMPECCABLE’S PICK 身份被用户选中）；排名模拟器页沿用同一线路图世界，借阅卡的“盖章”只作为访问记录的表现方式。seed:99a674a66cb96355

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
