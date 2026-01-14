---
title: "Mac 安装 zoxide：从 brew 安装到 Shell 初始化与自动补全（Tab 补全）一次讲清"
description: "围绕 mac 安装 zoxide、zoxide 支持哪些 shell、zoxide init 怎么配、zoxide 自动补全/Tab 补全怎么启用，给出 macOS 实操步骤与排错清单。"
keywords: ["mac 安装 zoxide", "zoxide 安装 mac", "zoxide init", "zoxide 支持哪些 shell", "zoxide 自动补全", "zoxide tab 补全"]
slug: "mac-anzhuang-zoxide-init-autocomplete"
---

# Mac 安装 zoxide：从 Homebrew 安装到 Shell 初始化与自动补全一次讲清

很多人搜索 **“mac 安装 zoxide”**，照着命令装完以后，兴冲冲输入 `z`，却发现要么报 `command not found`，要么完全没反应。根因通常不是安装失败，而是：

> **zoxide 安装只是第一步；真正让它“能用”的，是 Shell 初始化（`zoxide init`）。**

因为“切换当前目录”必须由 Shell 自己执行，zoxide 需要在你的 Shell 启动时注入函数、钩子与补全逻辑。本文以 macOS 为主线，把 **安装、初始化、支持哪些 Shell、自动补全（Tab 补全）、以及常见排错** 一次讲清。

---

## 1) macOS 上安装 zoxide（最推荐：Homebrew）

### 用 Homebrew 安装

```bash
brew install zoxide
```

### 想要最新版本：Cargo 安装

如果你有 Rust 工具链：

```bash
cargo install zoxide --locked
```

### 安装后自检（必做）

```bash
zoxide --version
which zoxide
```

如果 `which zoxide` 没输出，优先排查 PATH。没进 PATH，后面怎么 init 都白搭。

---

## 2) zoxide 支持哪些 Shell？（mac 常见三大类）

macOS 上最常见的 Shell 是：

- **Zsh**（mac 默认）
- **Bash**（少数用户）
- **Fish**（偏交互体验党）

zoxide 支持主流 Shell，只要用对应的 init 语句接入即可。

---

## 3) 最关键一步：zoxide init（Shell 初始化）

`zoxide init <shell>` 不会改你的任何文件，它只会输出一段脚本。你必须把这段脚本在 Shell 启动时执行（`eval` 或 `source`），它才会：

- 定义 `z` / `zi` 等命令
- 安装 Hook（监听目录切换并记录）
- 加载与补全/交互相关的逻辑

---

## 4) macOS 各 Shell 配置“标准答案”

### 4.1 Zsh（默认）

编辑 `~/.zshrc`，添加：

```zsh
eval "$(zoxide init zsh)"
```

生效：

```zsh
source ~/.zshrc
```

**插件排错建议：** 如果你用 oh-my-zsh / zinit 等插件体系，把这行放在插件加载之后，避免被同名函数、补全系统覆盖。

### 4.2 Bash

编辑 `~/.bashrc`（有些登录场景也可能是 `~/.bash_profile`）：

```bash
eval "$(zoxide init bash)"
```

生效：

```bash
source ~/.bashrc
```

### 4.3 Fish

编辑 `~/.config/fish/config.fish`：

```fish
zoxide init fish | source
```

---

## 5) zoxide 自动补全 / Tab 补全怎么理解？

很多人问 **“zoxide 自动补全”** 或 **“zoxide tab 补全”**。结论是：zoxide 支持补全，但补全的体验高度依赖你使用的 Shell 与补全系统是否启用。

常见导致“Tab 没反应”的原因：

1. init 行没加载（写错文件、没 reload、终端实际用的 Shell 不是你以为的那个）
2. 插件冲突（尤其是 oh-my-zsh 里也有 `z` 相关插件或补全体系）
3. 补全系统未启用（极简 dotfiles 常见）

排错优先级建议：先确保 init 生效（`type z` 看看 `z` 是否是函数），再排查插件冲突，最后再研究补全系统本身。

---

## 6) 强烈建议：配上 `zi` + fzf（交互式选择）

很多用户更爱用 `zi`，因为它像“目录搜索器”：你输入关键词，在列表里选。`zi` 通常与 fzf 配合更爽。

macOS 用 brew 装 fzf：

```bash
brew install fzf
```

然后试试：

```bash
zi
```

如果出现可搜索列表，说明你整套链路已经很顺了。

---

## 7) 进阶：让 zoxide 接管 cd（--cmd cd）

如果你想把肌肉记忆统一到 `cd`，可以这样：

```zsh
eval "$(zoxide init zsh --cmd cd)"
```

建议策略：先把默认 `z` 用稳，再决定是否“接管 cd”。

---

## 8) macOS 常见问题排查清单

- **`z: command not found`**：init 没加载。确认当前 Shell（`echo $SHELL`），确认你改的是对应配置文件，并 `source` 或重开终端。
- **`which zoxide` 为空**：PATH 问题。先解决安装路径，再谈 init。
- **Tab 补全无效**：先验证 init 生效，再排查插件冲突与补全系统启用状态。
- **`zi` 不交互**：安装 fzf，重启 shell。

---

## 总结

mac 上把 zoxide 用起来，本质就两件事：

1) 安装好二进制（brew 最省事）  
2) 把 `zoxide init` 正确写进 shell 配置，让 `z/zi`、hook、补全逻辑在启动时生效

做到这两步，你就能在终端里真正享受到“智能跳转”的爽感。
