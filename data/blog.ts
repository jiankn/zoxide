// 博客文章数据类型
export interface BlogPost {
  id: string;
  slug: string;
  // 可选：限定文章展示的语言（不填则在所有语言显示）
  locales?: ('zh' | 'en' | 'ja')[];
  // 可选：配对的其他语言版本的 slug（用于语言切换）
  alternateSlugs?: Partial<Record<'en' | 'zh' | 'ja', string>>;
  title: string;
  excerpt: string;
  content: string; // Markdown 格式
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number; // 阅读时长（分钟）
}

// 博客文章数据
export const blogPosts: BlogPost[] = [
  {
    id: '15',
    slug: 'zoxide-linux-en',
    locales: ['en'],
    alternateSlugs: { zh: 'zoxide-linux-zh', ja: 'zoxide-linux-ja' },
    title: 'zoxide linux: Fast Directory Jumps on Linux',
    excerpt:
      'A practical “zoxide linux” guide: installation on Ubuntu/Arch, shell init, fzf integration, and troubleshooting so your Linux terminal navigation stays fast.',
    content: `# zoxide on Linux: Install, Initialize, Use, Power Tips, and Uninstall (Keyword: **zoxide linux**)

If you searched for **"zoxide linux"**, you're probably trying to make terminal navigation faster. You installed the \`zoxide\` binary, typed \`z\`, and either got **"command not found"** or nothing happened. That's normal: installing the binary is only step one. The magic comes from **shell integration**, which is done via \`zoxide init\`.

This Linux‑first guide takes you from "just installed" to daily driver: installation options for popular distributions, the correct init lines for Bash/Zsh/Fish/Nushell, practical usage patterns, fzf‑powered interactive jumping, performance and hook tips, troubleshooting, and clean removal when you're done.

---

## 1) What is zoxide (and why it feels "smarter" than \`cd\`)?

\`zoxide\` is a smarter directory jumper. It learns from your behavior: every time you enter a directory, it records that path and adjusts its score based on **frequency** and **recency**. Later, you can jump using short keywords:

- Instead of: \`cd ~/dev/projects/company/infra/terraform/modules\`
- You type: \`z terraform\` (or \`z infra terraform\`) and jump straight there

On Linux, this is especially valuable because:

- Your filesystem is often deep (monorepos, multiple repos, container mounts, \`/srv\`, \`/var/log\`, etc.).
- You switch between local shells and remote shells (SSH, tmux).
- You want tools that are lightweight, scriptable, and shell‑native.

The core philosophy: **you shouldn't have to remember full paths**. You should be able to jump by intent.

---

## 2) Install zoxide on Linux: choose the right method

### Option A — Use your distro package manager (recommended)

This is the easiest way to install and receive updates through your system:

\`\`\`bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y zoxide

# Fedora / RHEL family
sudo dnf install -y zoxide

# Arch / Manjaro
sudo pacman -S zoxide

# openSUSE
sudo zypper install zoxide
\`\`\`

Verify:

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

If \`which zoxide\` prints nothing, the binary isn't in your PATH. Fix PATH first before troubleshooting init.

### Option B — Install the latest via Rust/Cargo

If your distro version is outdated, Cargo is a solid way to get the newest build:

\`\`\`bash
cargo install zoxide --locked
\`\`\`

Make sure \`~/.cargo/bin\` is in PATH.

### Option C — Manual binary install (portable + ops-friendly)

Many Linux users keep standalone binaries under \`~/.local/bin\`:

\`\`\`bash
mkdir -p ~/.local/bin
# Download a release binary, place it into ~/.local/bin, then:
chmod +x ~/.local/bin/zoxide
\`\`\`

Confirm \`~/.local/bin\` is on PATH:

\`\`\`bash
echo "$PATH" | tr ':' '\\n' | head
\`\`\`

---

## 3) The "missing step": \`zoxide init\` (shell integration)

Running:

\`\`\`bash
zoxide init <shell>
\`\`\`

does **not** edit your config files. It prints a block of shell script to STDOUT. That script typically:

- defines the \`z\` command (and companions like \`zi\`),
- installs a **hook** so directory changes are recorded into the database,
- enables interactive logic (commonly via fzf).

To make zoxide work every time you open a terminal, you must **evaluate** that init script at shell startup by adding it to your shell config file.

---

## 4) Linux shell setup: Bash / Zsh / Fish / Nushell

### Bash

Add this to \`~/.bashrc\`:

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

Apply:

\`\`\`bash
source ~/.bashrc
\`\`\`

### Zsh

Add this to \`~/.zshrc\`:

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

If you use plugin managers (oh‑my‑zsh, zinit, zim), place the init line after plugin loading so it doesn't get overridden by completions or custom functions.

### Fish

Add to \`~/.config/fish/config.fish\`:

\`\`\`fish
zoxide init fish | source
\`\`\`

### Nushell

Common pattern:

\`\`\`nu
zoxide init nushell | save -f ~/.zoxide.nu
\`\`\`

Then in \`config.nu\`:

\`\`\`nu
source ~/.zoxide.nu
\`\`\`

---

## 5) Everyday usage (what you'll actually type)

Once initialized, these cover most workflows:

\`\`\`bash
z foo        # jump to the best match for "foo"
z foo bar    # multi-keyword match for better precision
z foo/       # can also cd into real directories directly
z ..         # go to parent directory
z -          # go back to previous directory
zi foo       # interactive selection (usually needs fzf)
\`\`\`

### Install fzf for interactive mode (recommended)

On Linux, fzf is usually a package away:

\`\`\`bash
# Debian/Ubuntu
sudo apt install -y fzf

# Fedora
sudo dnf install -y fzf

# Arch
sudo pacman -S fzf
\`\`\`

Then try:

\`\`\`bash
zi
\`\`\`

You should get a searchable directory picker.

---

## 6) Power tip: make zoxide your default \`cd\` (unify muscle memory)

If you don't want to think "cd vs z", you can let zoxide take over the command name via \`--cmd\`. Example for Zsh:

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

What you get:

- \`cd\` still goes home with no args.
- \`cd ..\` still goes up.
- \`cd /etc\` still goes to absolute paths.
- \`cd work\` becomes fuzzy and jumps to your most-used \`work\` directory.

If you see odd behavior, revert to default \`z\` first (remove \`--cmd cd\`), confirm zoxide works, then investigate hook conflicts with your prompt, plugins, or custom \`cd\` functions.

### Bonus: control when zoxide records directories (\`--hook\`)

Depending on your shell/prompt setup, you might want different hook behavior. A common alternative is recording at each prompt render:

\`\`\`bash
eval "$(zoxide init bash --hook prompt)"
\`\`\`

Most Linux users should keep the default; change it only if you notice directories not being recorded consistently.

---

## 7) Database location, privacy, and cleanup

On Linux, zoxide typically follows XDG conventions. The database is commonly stored under:

- \`$XDG_DATA_HOME/zoxide\`, or
- \`~/.local/share/zoxide\`

That's local to your user account. You can also control the DB location with environment variables (for backups/sync or privacy), and exclude directories you don't want tracked (caches, build outputs, temp folders). Keeping your history clean improves matching quality.

---

## 8) Practical Linux workflows that feel great with zoxide

### Multi-repo development

If you have many repos like:

- \`~/dev/company/api\`
- \`~/dev/company/web\`
- \`~/dev/company/infra\`
- \`~/dev/personal/sideproject\`

You can jump with intent:

\`\`\`bash
z company api
z personal side
\`\`\`

Multi-keyword matching is often more precise than a single token.

### SSH and servers

You can install zoxide on remote hosts too. The main "gotcha" is init placement: some shells read different files for login vs interactive sessions. When in doubt, confirm your shell startup behavior and put the init line in the file that is guaranteed to be loaded.

### tmux

tmux panes are shells. If your shell config initializes zoxide, it works consistently across panes and sessions.

---

## 9) Troubleshooting (Linux pitfalls)

### "command not found: z"

- Ensure your init line is in the right file (\`.bashrc\`, \`.zshrc\`, etc.).
- Reload it (\`source ~/.zshrc\`) or open a new terminal.
- Confirm \`zoxide\` is in PATH (\`which zoxide\`).

### "It doesn't learn / doesn't add directories"

This is usually a hook conflict: prompt frameworks, custom \`cd\` wrappers, or plugin managers modifying hooks. Put the init line later in your config. If you use \`--cmd cd\`, disable it and confirm basic \`z\` learning first.

### \`zi\` isn't interactive

Install \`fzf\`, restart your shell, and ensure \`fzf\` is in PATH (\`which fzf\`).

---

## 10) Uninstall zoxide on Linux (and optionally remove history)

### Step 1 — Remove init lines

Delete the line you added, such as:

- \`eval "$(zoxide init bash)"\`
- \`eval "$(zoxide init zsh)"\`
- \`zoxide init fish | source\`

Restart your shell.

### Step 2 — Remove the package/binary

Pick the method matching your install:

\`\`\`bash
# apt
sudo apt remove -y zoxide

# dnf
sudo dnf remove -y zoxide

# pacman
sudo pacman -R zoxide

# cargo
cargo uninstall zoxide
\`\`\`

### Step 3 — Remove the database (optional)

To delete your navigation history:

\`\`\`bash
rm -rf "\${XDG_DATA_HOME:-$HOME/.local/share}/zoxide"
\`\`\`

---

## Wrap-up

The "**zoxide linux**" experience boils down to two essentials:

1) install a working zoxide binary, and  
2) **initialize it properly** so your shell records directory changes and provides the \`z/zi\` commands.

After that, it's all ergonomics: fzf for interactive picking, multi-keyword jumps for precision, and optional takeover of \`cd\` if you want one unified muscle memory. If you live in a terminal all day, zoxide is one of the highest-ROI upgrades you can make in under five minutes.
`,
    date: '2025-12-22',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide linux', 'linux', 'installation', 'fzf', 'troubleshooting'],
    readTime: 8,
  },
  {
    id: '14',
    slug: 'zoxide-linux-zh',
    locales: ['zh'],
    alternateSlugs: { en: 'zoxide-linux-en', ja: 'zoxide-linux-ja' },
    title: 'zoxide linux 安装与使用全攻略',
    excerpt:
      '面向关键词 “zoxide linux”：覆盖 Ubuntu/Arch 安装、Shell 初始化、fzf 集成、常见错误修复，让你的 Linux 终端跳转更快。',
    content: `# zoxide Linux 使用指南：安装、初始化、用法、技巧与卸载（关键词：zoxide linux）

如果你在搜索 **"zoxide linux"**，大概率是想解决一个终端痛点：目录越来越深、项目越来越多，但你不想每天反复 \`cd ~/dev/projects/...\` 这种长路径。zoxide 就是为此而生的工具——它会"学习"你最常进入的目录，然后让你用更少的字符完成跳转。

但很多 Linux 用户第一次安装完 zoxide 后，兴致勃勃输入 \`z\`，结果却只看到 **\`command not found\`**，或者输入了也"没反应"。这通常不是安装失败，而是因为：

> **安装只是第一步，Shell 初始化（Shell Integration / \`zoxide init\`）才是最后一步。**  
> 没有初始化，zoxide 无法监听你每次 \`cd\` 的目录变化，自然也就无法进行智能跳转。

这篇文章将围绕"**zoxide linux**"这个关键词，完整讲清：**Linux 环境下如何安装、配置（初始化）、日常使用、实用技巧、进阶玩法、常见问题排查，以及如何卸载与清理数据**。

---

## 1. zoxide 是什么？为什么 Linux 用户值得用它？

你可以把 zoxide 理解成"更聪明的 \`cd\`"。它会根据你平时进入目录的**频率**与**最近使用情况**给路径打分，随后你只需输入几个关键字，就能跳到最符合你习惯的目录。

在 Linux 的典型工作流里，它尤其有价值：

- 你经常在 \`~/dev/\`、\`~/work/\`、\`/srv/\`、\`/var/log/\`、容器挂载目录、多个仓库之间来回切换。
- 你可能同时使用 Bash/Zsh/Fish，或者在本机与 SSH 服务器之间切换。
- 你希望工具足够轻量、可脚本化、能跟 tmux、ssh、dotfiles 体系自然融合。

一句话：**zoxide 把"记路径"这件事外包给了工具，把"输入"变成了"意图"。**

---

## 2. Linux 上安装 zoxide：怎么装最稳？怎么装最新版？

先给结论：

- **优先用发行版包管理器**（安装简单、升级方便）
- 如果系统源版本太旧，再用 **Cargo（Rust）** 或 **下载预编译二进制**

### 2.1 发行版包管理器安装（大多数 Linux 用户首选）

下面是常见发行版的安装方式（以你的系统为准）：

\`\`\`bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y zoxide

# Fedora / RHEL 系
sudo dnf install -y zoxide

# Arch / Manjaro
sudo pacman -S zoxide

# openSUSE
sudo zypper install zoxide
\`\`\`

安装后建议立刻自检：

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

如果 \`which zoxide\` 没有输出，说明它不在 PATH 中：要么没装成功，要么 shell 的 PATH 没加载对（尤其在极简服务器或自定义 dotfiles 下更常见）。

### 2.2 Cargo 安装（想要最新版 / 喜欢 Rust 工具链的用户）

如果你有 Rust 工具链（\`cargo\`），可以这样装：

\`\`\`bash
cargo install zoxide --locked
\`\`\`

Cargo 的二进制通常在 \`~/.cargo/bin\`，若 \`which zoxide\` 找不到，检查你的 PATH 是否包含它。

### 2.3 手动安装预编译二进制（偏运维/可控）

一些用户喜欢把工具统一放到 \`~/.local/bin/\`：

\`\`\`bash
mkdir -p ~/.local/bin
# 将下载的 zoxide 放进 ~/.local/bin 并 chmod +x
chmod +x ~/.local/bin/zoxide
\`\`\`

然后确认 PATH：

\`\`\`bash
echo "$PATH" | tr ':' '\\n' | head -n 10
\`\`\`

---

## 3. Linux 上最关键一步：zoxide init（Shell 初始化）

### 3.1 \`zoxide init\` 到底做了什么？

执行：

\`\`\`bash
zoxide init <shell>
\`\`\`

它**不会自动修改你的任何文件**。它做的事情是：在标准输出打印一段 shell 脚本。这段脚本通常包括：

- 定义 \`z\`（以及 \`zi\` 等）命令/函数
- 设置 Hook（钩子）：当你切换目录时，把新路径记录到数据库并更新权重
- 为交互式选择（经常配合 fzf）准备逻辑

所以你必须把它"接入"到 shell 启动流程中：**把 init 语句写到 shell 配置文件里，让每次打开终端都自动执行。**

---

## 4. Linux 主流 Shell 配置：Bash / Zsh / Fish / Nushell

找到你正在用的 shell，把对应配置加进去即可。

### 4.1 Bash

编辑 \`~/.bashrc\`，在末尾添加：

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

立即生效：

\`\`\`bash
source ~/.bashrc
\`\`\`

### 4.2 Zsh

编辑 \`~/.zshrc\`：

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

如果你用 oh-my-zsh / zim / zinit 等插件管理器，建议把这一行放在插件加载之后（避免函数/补全/别名冲突）。

### 4.3 Fish

编辑 \`~/.config/fish/config.fish\`：

\`\`\`fish
zoxide init fish | source
\`\`\`

### 4.4 Nushell

通常分两步：先生成脚本文件，再 \`source\`：

\`\`\`nu
zoxide init nushell | save -f ~/.zoxide.nu
\`\`\`

然后在 \`config.nu\`：

\`\`\`nu
source ~/.zoxide.nu
\`\`\`

---

## 5. zoxide linux 的日常使用：最常用的 6 个命令姿势

初始化完成后，你就可以开始"智能跳转"了：

\`\`\`bash
z foo        # 跳到最匹配、最常用的 foo 目录
z foo bar    # 多关键词匹配（更准）
z foo/       # 也可以直接 cd 到真实存在的目录
z ..         # 回到上级目录
z -          # 回到上一次所在目录
zi foo       # 交互式选择（通常需要 fzf）
\`\`\`

### 5.1 强烈建议：安装 fzf，让 \`zi\` 变成"目录选择器"

\`zi\` 的交互模式通常依赖 \`fzf\`。Linux 下装 fzf 很简单：

\`\`\`bash
# Debian/Ubuntu
sudo apt install -y fzf

# Fedora
sudo dnf install -y fzf

# Arch
sudo pacman -S fzf
\`\`\`

装完后重开终端，试试：

\`\`\`bash
zi
\`\`\`

如果能出现可搜索的目录列表，你就进入 zoxide 的"爽区"了。

---

## 6. 进阶技巧：让 zoxide 接管 \`cd\`（把肌肉记忆统一起来）

很多资深用户并不想在 \`cd\` 和 \`z\` 之间切换。他们希望：**"我只想用 cd，但 cd 更聪明。"**

你可以用 \`--cmd\` 参数把 zoxide 的主命令改成 \`cd\`：

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

启用后体验通常是：

- \`cd\`：回家目录（行为不变）
- \`cd ..\`：上一级（不变）
- \`cd /etc\`：绝对路径（不变）
- \`cd work\`：模糊匹配并跳到你最常用的 \`work\` 目录（升级点）

> 建议做法：先确保默认 \`z\` 工作稳定，再考虑 \`--cmd cd\`。如果你在 Bash 下遇到卡顿/冲突，先回退到默认 \`z\`，再逐项排查 prompt hook、插件、PROMPT_COMMAND 等影响因素。

### 6.1 更细的控制：调整"什么时候记目录"（--hook）

如果你想控制记录时机，\`--hook\` 通常能帮上忙。例如在某些 prompt 框架里，你可能希望每次提示符刷新都记录一次：

\`\`\`bash
eval "$(zoxide init bash --hook prompt)"
\`\`\`

一般来说，Linux 上保持默认模式已经足够；只有在"记录不更新/不稳定"时才需要折腾这个参数。

---

## 7. 数据库在哪里？如何管理隐私与排除目录？

在 Linux/BSD 上，zoxide 通常遵循 XDG 目录规范，数据库默认在：

- \`$XDG_DATA_HOME/zoxide\` 或
- \`~/.local/share/zoxide\`

你也可以用环境变量把数据库移动到别的地方，例如 \`_ZO_DATA_DIR\`。此外还有一些常见开关：

- \`_ZO_ECHO=1\`：跳转前打印匹配结果（调试很有用）
- \`_ZO_EXCLUDE_DIRS\`：排除不想记录的目录（例如缓存目录、build 目录、临时目录）

实际建议：**把缓存、依赖、构建输出目录排除掉**，让你的历史库更"干净"，匹配更准。

---

## 8. Linux 场景实用技巧清单（少说教，多能用）

1. **多关键词更准**：\`z company api\` 往往比 \`z api\` 更容易跳到正确仓库。
2. **目录命名就是索引**：统一目录命名（如 \`work/\`, \`infra/\`, \`docs/\`）会让匹配稳定很多。
3. **tmux 与 ssh 一视同仁**：只要该 shell 会读取你的配置文件并初始化 zoxide，它在 tmux/ssh 里就能无缝工作。
4. **记录不更新**：把 init 放到配置文件更靠后的位置，避免被其他脚本覆盖 hook。
5. **先稳定再"接管 cd"**：\`--cmd cd\` 很爽，但不要在基础没跑通时先上"全自动"。

---

## 9. 卸载 zoxide（Linux）：删配置、卸包、清数据库三步走

### 9.1 删除初始化配置（非常关键）

先把你添加到配置文件中的 init 行删除：

- Bash：\`~/.bashrc\` 里的 \`eval "$(zoxide init bash)"\`
- Zsh：\`~/.zshrc\` 里的 \`eval "$(zoxide init zsh)"\`
- Fish：\`~/.config/fish/config.fish\` 里的 \`zoxide init fish | source\`

然后重开终端或 \`source\` 让更改生效。

### 9.2 卸载程序本体

按你的安装方式选择：

\`\`\`bash
# apt
sudo apt remove -y zoxide

# dnf
sudo dnf remove -y zoxide

# pacman
sudo pacman -R zoxide

# cargo
cargo uninstall zoxide
\`\`\`

### 9.3 清理数据库（可选：删除历史记录）

如果你想彻底删掉目录历史记录：

\`\`\`bash
rm -rf "\${XDG_DATA_HOME:-$HOME/.local/share}/zoxide"
\`\`\`

---

## 10. 总结：把 zoxide linux 用顺，其实就两件事

1) **装对版本**（包管理器优先，版本太旧再升级）  
2) **init 配好**（让 shell 能记录目录变化并提供 \`z/zi\` 能力）

剩下的都是"锦上添花"：fzf 让交互更爽，\`--cmd cd\` 让肌肉记忆统一，环境变量让数据库可控、可清洁、可排除。  
当你把这些打磨好，你会发现：**每天几十次的目录跳转，真的能从"拖沓"变成"流畅"。**
`,
    date: '2025-12-22',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide linux', 'linux', '安装', 'fzf', '故障排除'],
    readTime: 9,
  },
  {
    id: '16',
    slug: 'zoxide-linux-ja',
    locales: ['ja'],
    alternateSlugs: { en: 'zoxide-linux-en', zh: 'zoxide-linux-zh' },
    title: 'zoxide linux：Linuxでの高速ディレクトリジャンプ',
    excerpt:
      'zoxide linuxの実践ガイド：Ubuntu/Archへのインストール、シェル初期化、fzf連携、トラブルシューティングでLinuxターミナルナビゲーションを高速化。',
    content: `# zoxide Linux ガイド：インストール、初期化、使い方、ヒント、アンインストール

**「zoxide linux」**を検索しているなら、ターミナルナビゲーションを高速化したいのでしょう。\`zoxide\`バイナリをインストールして\`z\`と入力したら、**「command not found」**が表示されたか、何も起きなかったかもしれません。これは正常です：バイナリのインストールは最初のステップに過ぎません。魔法は**シェル統合**から生まれ、\`zoxide init\`で行います。

---

## 1) zoxideとは何か？

\`zoxide\`はスマートなディレクトリジャンパーです。ディレクトリに入るたびにそのパスを記録し、**頻度**と**最新性**に基づいてスコアを調整します。後で短いキーワードでジャンプできます：

- 従来：\`cd ~/dev/projects/company/infra/terraform/modules\`
- zoxide：\`z terraform\`（または\`z infra terraform\`）で直接ジャンプ

---

## 2) Linuxへのインストール

### オプションA — パッケージマネージャーを使用（推奨）

\`\`\`bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y zoxide

# Fedora / RHEL
sudo dnf install -y zoxide

# Arch / Manjaro
sudo pacman -S zoxide
\`\`\`

確認：

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

### オプションB — Cargo経由でインストール

\`\`\`bash
cargo install zoxide --locked
\`\`\`

\`~/.cargo/bin\`がPATHに含まれていることを確認してください。

---

## 3) 重要なステップ：\`zoxide init\`（シェル統合）

\`\`\`bash
zoxide init <shell>
\`\`\`

このコマンドはシェルスクリプトを出力します。これを評価する必要があります。

---

## 4) シェル設定

### Bash

\`~/.bashrc\`に追加：

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

### Zsh

\`~/.zshrc\`に追加：

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

### Fish

\`~/.config/fish/config.fish\`に追加：

\`\`\`fish
zoxide init fish | source
\`\`\`

### PowerShell

\`\`\`powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
\`\`\`

---

## 5) 日常的な使い方

\`\`\`bash
z foo        # 「foo」に最もマッチするディレクトリにジャンプ
z foo bar    # 複数キーワードでより正確にマッチ
z ..         # 親ディレクトリに移動
z -          # 前のディレクトリに戻る
zi foo       # インタラクティブ選択（fzfが必要）
\`\`\`

### fzfのインストール（推奨）

\`\`\`bash
# Debian/Ubuntu
sudo apt install -y fzf

# Fedora
sudo dnf install -y fzf

# Arch
sudo pacman -S fzf
\`\`\`

---

## 6) 上級ヒント：zoxideで\`cd\`を置き換える

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

これで\`cd\`がzoxideのスマートロジックを使用します。

---

## 7) データベースの場所

Linuxでは、zoxideは通常XDG規約に従います：

- \`$XDG_DATA_HOME/zoxide\`または
- \`~/.local/share/zoxide\`

---

## 8) トラブルシューティング

### 「command not found: z」

- initラインが正しいファイル（\`.bashrc\`、\`.zshrc\`など）にあることを確認
- シェルを再読み込み（\`source ~/.zshrc\`）
- \`zoxide\`がPATHにあることを確認（\`which zoxide\`）

### \`zi\`がインタラクティブでない

\`fzf\`をインストールし、シェルを再起動してください。

---

## 9) アンインストール

### ステップ1 — initラインを削除

設定ファイルから追加したラインを削除します。

### ステップ2 — パッケージを削除

\`\`\`bash
# apt
sudo apt remove -y zoxide

# dnf
sudo dnf remove -y zoxide

# pacman
sudo pacman -R zoxide

# cargo
cargo uninstall zoxide
\`\`\`

### ステップ3 — データベースを削除（オプション）

\`\`\`bash
rm -rf "\${XDG_DATA_HOME:-$HOME/.local/share}/zoxide"
\`\`\`

---

## まとめ

**「zoxide linux」**の体験は2つの要点に帰着します：

1) 動作するzoxideバイナリをインストールする
2) **適切に初期化する**ことで、シェルがディレクトリの変更を記録し、\`z/zi\`コマンドを提供できるようにする

その後は、すべてが快適です：fzfでインタラクティブピッキング、複数キーワードジャンプで精度向上、オプションで\`cd\`を置き換えて統一されたマッスルメモリー。ターミナルで一日中作業するなら、zoxideは5分未満でできる最高のROIアップグレードの1つです。
`,
    date: '2025-12-22',
    author: 'zoxide.org',
    category: 'チュートリアル',
    tags: ['zoxide linux', 'linux', 'インストール', 'fzf', 'トラブルシューティング'],
    readTime: 8,
  },
  {
    id: '1',
    slug: 'quick-start',
    title: 'zoxide 快速开始指南',
    excerpt: '5 分钟快速上手 zoxide，学习基本命令和配置方法。',
    content: `# zoxide 快速开始指南

zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。本指南将帮助你在 5 分钟内快速上手。

## 安装 zoxide

### macOS
\`\`\`bash
brew install zoxide
\`\`\`

### Windows
\`\`\`bash
scoop install zoxide
\`\`\`

### Linux / 所有平台
\`\`\`bash
cargo install zoxide
\`\`\`

## Shell 配置

安装完成后，需要在 Shell 配置文件中添加初始化命令。

### zsh
在 \`~/.zshrc\` 中添加：
\`\`\`bash
eval "$(zoxide init zsh)"
\`\`\`

### bash
在 \`~/.bashrc\` 中添加：
\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

### fish
在 \`~/.config/fish/config.fish\` 中添加：
\`\`\`fish
zoxide init fish | source
\`\`\`

## 基本使用

配置完成后，重新加载 Shell 或打开新终端窗口，就可以开始使用 zoxide 了。

### 基本命令

- \`z <目录名>\` - 跳转到匹配的目录
- \`zi <目录名>\` - 交互式选择目录（支持模糊搜索）
- \`z -\` - 返回上一个目录
- \`z -l\` - 列出所有匹配的目录

### 示例

\`\`\`bash
# 跳转到包含 "project" 的目录
z project

# 交互式选择目录
zi pro

# 返回上一个目录
z -
\`\`\`

## 高级技巧

### 排除目录

使用环境变量 \`_ZO_EXCLUDE_DIRS\` 可以排除不需要索引的目录：

\`\`\`bash
export _ZO_EXCLUDE_DIRS="/tmp:/var"
\`\`\`

### 自定义数据库位置

默认数据库存储在 \`~/.zo\`，可以通过 \`_ZO_DATA_DIR\` 自定义：

\`\`\`bash
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"
\`\`\`

## 总结

zoxide 让目录导航变得简单高效。通过智能学习和模糊搜索，你可以快速跳转到任何目录，无需输入完整路径。

更多高级用法，请查看[高级配置教程](/tutorials/advanced-config)。`,
    date: '2025-11-30',
    author: 'zoxide.org',
    category: '教程',
    tags: ['快速开始', '安装', '配置'],
    readTime: 5,
  },
  {
    id: '2',
    slug: 'advanced-config',
    title: 'zoxide 高级配置技巧',
    excerpt: '学习如何配置 zoxide 以提升工作效率，包括别名设置、目录排除等。',
    content: `# zoxide 高级配置技巧

zoxide 提供了丰富的配置选项，让你可以根据个人需求定制使用体验。

## 环境变量配置

### 排除目录

使用 \`_ZO_EXCLUDE_DIRS\` 可以排除不需要索引的目录，提升性能：

\`\`\`bash
export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules"
\`\`\`

多个目录用冒号分隔。

### 自定义数据库位置

默认数据库存储在用户主目录下的 \`.zo\` 文件中。可以通过 \`_ZO_DATA_DIR\` 自定义：

\`\`\`bash
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"
\`\`\`

### 最大历史记录数

使用 \`_ZO_MAXAGE\` 设置最大历史记录天数（默认 10000）：

\`\`\`bash
export _ZO_MAXAGE=5000
\`\`\`

## 别名设置

zoxide 支持自定义别名，让常用命令更简短：

\`\`\`bash
# 在 Shell 配置文件中添加
alias zz='z'
alias zi='zi'
alias za='zoxide add'
alias zq='zoxide query'
\`\`\`

## 与 fzf 集成

结合 fzf 可以实现更强大的目录搜索和选择：

\`\`\`bash
# 在 ~/.zshrc 中添加
zi() {
  local dir
  dir=$(zoxide query -l | fzf) && z "$dir"
}
\`\`\`

## 性能优化

### 减少索引范围

只索引常用目录，可以显著提升性能：

\`\`\`bash
export _ZO_EXCLUDE_DIRS="/tmp:/var:/proc:/sys"
\`\`\`

### 定期清理数据库

如果数据库过大，可以手动清理：

\`\`\`bash
# 查看数据库大小
ls -lh ~/.zo

# 删除数据库重新开始（谨慎操作）
rm ~/.zo
\`\`\`

## 团队协作

zoxide 支持共享数据库，团队成员可以共享常用目录：

\`\`\`bash
# 使用共享数据库位置
export _ZO_DATA_DIR="/shared/path/zoxide"
\`\`\`

## 总结

通过合理配置，zoxide 可以更好地适应你的工作流程。建议从排除不需要的目录开始，逐步优化配置。

更多配置选项，请查看[官方文档](https://github.com/ajeetdsouza/zoxide)。`,
    date: '2025-11-30',
    author: 'zoxide.org',
    category: '技巧',
    tags: ['配置', '高级', '优化'],
    readTime: 10,
  },
  {
    id: '3',
    slug: 'zoxide-vs-autojump',
    title: 'zoxide vs autojump 性能对比',
    excerpt: '详细对比 zoxide 和 autojump 的性能差异和使用体验。',
    content: `# zoxide vs autojump 性能对比

zoxide 和 autojump 都是智能目录跳转工具，但它们在性能、功能和易用性方面有显著差异。

## 性能对比

### 启动速度

zoxide 使用 Rust 编写，启动速度极快：

- **zoxide**: ~5ms 启动时间
- **autojump**: ~50ms 启动时间

zoxide 比 autojump 快 **10 倍**。

### 查询速度

在大型项目目录中，zoxide 的查询速度也明显更快：

- **zoxide**: 模糊搜索 < 10ms
- **autojump**: 查询时间 20-50ms

## 功能对比

### 模糊搜索

- **zoxide**: ✅ 支持模糊搜索，无需完整路径
- **autojump**: ❌ 不支持模糊搜索

### 交互式选择

- **zoxide**: ✅ 支持 \`zi\` 命令交互式选择
- **autojump**: ❌ 不支持

### 学习算法

- **zoxide**: ✅ 智能学习算法，越用越准确
- **autojump**: ✅ 基础频率统计

## 易用性对比

### 命令简洁性

zoxide 的命令更简洁：

\`\`\`bash
# zoxide
z project

# autojump
j project
\`\`\`

### 配置复杂度

- **zoxide**: 配置简单，只需一行初始化命令
- **autojump**: 需要额外配置 Shell 集成

## 跨平台支持

- **zoxide**: ✅ 支持 macOS、Linux、Windows
- **autojump**: ✅ 支持 macOS、Linux（Windows 支持有限）

## 维护状态

- **zoxide**: 非常活跃，持续更新
- **autojump**: 更新较慢

## 总结

| 特性 | zoxide | autojump |
|------|--------|----------|
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 模糊搜索 | ✅ | ❌ |
| 交互式选择 | ✅ | ❌ |
| 跨平台 | ✅ | ✅ |
| 维护状态 | 活跃 | 较慢 |

**结论**：如果你追求性能和现代化体验，zoxide 是更好的选择。如果你已经习惯使用 autojump，迁移到 zoxide 也很简单。

查看[完整对比](/comparisons)了解更多细节。`,
    date: '2025-11-30',
    author: 'zoxide.org',
    category: '对比',
    tags: ['对比', '性能', 'autojump'],
    readTime: 8,
  },
  {
    id: '4',
    slug: 'zoxide-command-not-found',
    title: 'zoxide command not found - How to Fix',
    excerpt: 'Troubleshooting guide for "zoxide command not found" error. Learn how to fix PATH issues and verify installation.',
    content: `# zoxide command not found - How to Fix

If you're seeing "zoxide command not found" after installation, this guide will help you troubleshoot and fix the issue.

## Common Causes

The "command not found" error typically occurs due to one of these reasons:

1. **zoxide is not in your PATH**
2. **Shell configuration not loaded**
3. **Installation didn't complete successfully**
4. **Wrong installation method for your system**

## Solution 1: Check Installation

First, verify that zoxide is actually installed:

\`\`\`bash
# Check if zoxide exists
which zoxide

# Or try to find it
find /usr -name zoxide 2>/dev/null
find ~ -name zoxide 2>/dev/null
\`\`\`

If zoxide is not found, you need to reinstall it. See the [installation guide](/tutorials/install-ubuntu) for your platform.

## Solution 2: Add to PATH

### Linux / macOS

If zoxide is installed but not in PATH, add it manually:

**For Cargo installation:**
\`\`\`bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.cargo/bin:$PATH"

# Reload shell
source ~/.bashrc # or source ~/.zshrc
\`\`\`

**For manual installation:**
\`\`\`bash
# If installed to /usr/local/bin
export PATH="/usr/local/bin:$PATH"

# Or if installed to ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"
\`\`\`

### Windows

**For Cargo installation:**
\`\`\`powershell
# Add to PATH
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:USERPROFILE\\.cargo\\bin", [EnvironmentVariableTarget]::User)
\`\`\`

**For manual installation:**
\`\`\`powershell
# Add your installation directory to PATH
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\\path\\to\\zoxide", [EnvironmentVariableTarget]::User)
\`\`\`

Restart your terminal after modifying PATH.

## Solution 3: Verify Shell Configuration

Make sure zoxide is initialized in your shell configuration file:

**Bash (~/.bashrc):**
\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

**Zsh (~/.zshrc):**
\`\`\`bash
eval "$(zoxide init zsh)"
\`\`\`

**Fish (~/.config/fish/config.fish):**
\`\`\`fish
zoxide init fish | source
\`\`\`

**PowerShell ($PROFILE):**
\`\`\`powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
\`\`\`

After adding the configuration, reload your shell:
- Bash/Zsh: \`source ~/.bashrc\` or \`source ~/.zshrc\`
- Fish: \`source ~/.config/fish/config.fish\`
- PowerShell: \`. $PROFILE\`

## Solution 4: Check Installation Method

### Using Homebrew (macOS)

If installed via Homebrew, make sure Homebrew is in your PATH:

\`\`\`bash
# Check Homebrew location
brew --prefix

# Add to PATH if needed
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

### Using Scoop (Windows)

Scoop should automatically add programs to PATH. If not working:

\`\`\`powershell
# Check Scoop installation
scoop which zoxide

# Reinstall if needed
scoop uninstall zoxide
scoop install zoxide
\`\`\`

### Using Cargo

Verify Cargo is installed and in PATH:

\`\`\`bash
cargo --version
which cargo

# If cargo not found, install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
\`\`\`

## Solution 5: Test in New Terminal

Sometimes the PATH changes don't take effect in the current terminal. Try:

1. Close your current terminal
2. Open a new terminal window
3. Test zoxide again:
   \`\`\`bash
   zoxide --version
   \`\`\`

## Quick Diagnostic Commands

Run these commands to diagnose the issue:

\`\`\`bash
# Check if zoxide is installed
which zoxide || echo "zoxide not in PATH"

# Check PATH
echo $PATH

# Check shell configuration
cat ~/.bashrc | grep zoxide # or ~/.zshrc
\`\`\`

## Still Not Working?

If none of the above solutions work:

1. **Reinstall zoxide** using the recommended method for your platform
2. **Check system logs** for installation errors
3. **Verify your shell** is compatible (bash, zsh, fish, PowerShell)
4. **Check permissions** - make sure zoxide binary is executable:
   \`\`\`bash
   chmod +x $(which zoxide)
   \`\`\`

## Prevention

To avoid this issue in the future:

1. Use package managers (Homebrew, Scoop) when possible
2. Always add installation directories to PATH immediately
3. Test installation right after completing it
4. Keep your shell configuration files organized

## Related Issues

- [zoxide not working](/blog/zoxide-not-working)
- [Installation guide for Ubuntu](/tutorials/install-ubuntu)
- [Installation guide for macOS](/tutorials/install-macos)
- [Installation guide for Windows](/tutorials/install-windows)`,
    date: '2025-12-01',
    author: 'zoxide.org',
    category: '故障排除',
    tags: ['troubleshooting', 'installation', 'error', 'command not found'],
    readTime: 5,
  },
  {
    id: '5',
    slug: 'zoxide-not-working',
    title: 'zoxide not working - Troubleshooting Guide',
    excerpt: 'Comprehensive troubleshooting guide for when zoxide is not working correctly. Fix common issues and get zoxide running again.',
    content: `# zoxide not working - Troubleshooting Guide

If zoxide is installed but not working as expected, this guide will help you diagnose and fix the issue.

## Common Issues

### Issue 1: zoxide Commands Not Recognized

**Symptoms:**
- \`z\` command not found
- \`zi\` command not found
- "command not found" errors

**Solutions:**

1. **Verify shell configuration is loaded:**
   \`\`\`bash
   # Check if zoxide init is in your config
   grep zoxide ~/.bashrc # or ~/.zshrc
   \`\`\`

2. **Reload shell configuration:**
   \`\`\`bash
   source ~/.bashrc # or source ~/.zshrc
   \`\`\`

3. **Check if zoxide binary exists:**
   \`\`\`bash
   which zoxide
   zoxide --version
   \`\`\`

### Issue 2: zoxide Not Learning Directories

**Symptoms:**
- zoxide doesn't remember visited directories
- \`z\` command always fails to find directories
- No history is being built

**Solutions:**

1. **Check database location:**
   \`\`\`bash
   # Default location
   ls -la ~/.zo
   
   # Check if database exists and is writable
   touch ~/.zo
   \`\`\`

2. **Verify permissions:**
   \`\`\`bash
   # Make sure you have write permissions
   ls -l ~/.zo
   \`\`\`

3. **Check environment variables:**
   \`\`\`bash
   echo $ZO_DATA_DIR
   echo $ZO_EXCLUDE_DIRS
   \`\`\`

4. **Manually add a directory to test:**
   \`\`\`bash
   zoxide add ~/Documents
   zoxide query Documents
   \`\`\`

### Issue 3: Slow Performance

**Symptoms:**
- zoxide commands are slow
- Delay when using \`z\` command
- High CPU usage

**Solutions:**

1. **Exclude large directories:**
   \`\`\`bash
   export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules"
   \`\`\`

2. **Check database size:**
   \`\`\`bash
   ls -lh ~/.zo
   \`\`\`

3. **Clean up old entries:**
   \`\`\`bash
   # Backup first
   cp ~/.zo ~/.zo.backup
   
   # zoxide will rebuild as you use it
   # Or manually remove if too large
   \`\`\`

4. **Reduce max age:**
   \`\`\`bash
   export _ZO_MAXAGE=5000 # Reduce from default 10000
   \`\`\`

### Issue 4: Wrong Directory Selected

**Symptoms:**
- \`z project\` goes to wrong directory
- Multiple matches but wrong one chosen
- Inconsistent behavior

**Solutions:**

1. **Use interactive mode:**
   \`\`\`bash
   zi project # Interactive selection
   \`\`\`

2. **List all matches first:**
   \`\`\`bash
   z -l project # List all matches
   \`\`\`

3. **Be more specific:**
   \`\`\`bash
   z project/src # More specific path
   \`\`\`

4. **Check frequency:**
   - zoxide learns from usage
   - Frequently visited directories get higher priority
   - Use directories more often to improve matching

### Issue 5: Shell Integration Not Working

**Symptoms:**
- \`z\` command works but doesn't change directory
- Shell hooks not executing
- No automatic directory tracking

**Solutions:**

1. **Verify initialization:**
   \`\`\`bash
   # Check if init command is correct
   eval "$(zoxide init bash)" # Test directly
   \`\`\`

2. **Check shell compatibility:**
   - Make sure you're using a supported shell (bash, zsh, fish, PowerShell)
   - Some shells may need different initialization

3. **Manual hook setup (if needed):**
   \`\`\`bash
   # For bash/zsh, zoxide should handle this automatically
   # But you can verify hooks are set:
   type z
   \`\`\`

## Diagnostic Steps

Run these commands to diagnose the issue:

\`\`\`bash
# 1. Check zoxide installation
zoxide --version

# 2. Check if commands are available
type z
type zi

# 3. Check database
ls -la ~/.zo

# 4. Test basic functionality
zoxide add ~
zoxide query ~

# 5. Check environment
env | grep ZO

# 6. Test in clean environment
env -i bash -c 'eval "$(zoxide init bash)" && z --help'
\`\`\`

## Platform-Specific Issues

### Linux

**Issue: Permission denied**
\`\`\`bash
# Fix permissions
chmod +x $(which zoxide)
sudo chown $USER:$USER ~/.zo
\`\`\`

### macOS

**Issue: Homebrew path not found**
\`\`\`bash
# Add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

### Windows

**Issue: PowerShell execution policy**
\`\`\`powershell
# Allow script execution
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
\`\`\`

## Reset zoxide

If nothing works, you can reset zoxide:

\`\`\`bash
# Backup current database
cp ~/.zo ~/.zo.backup

# Remove database (will be recreated)
rm ~/.zo

# Remove from shell config temporarily
# Then re-add initialization command
# Test fresh installation
\`\`\`

## Getting Help

If you're still experiencing issues:

1. Check the [official zoxide documentation](https://github.com/ajeetdsouza/zoxide)
2. Search [GitHub issues](https://github.com/ajeetdsouza/zoxide/issues)
3. Verify your zoxide version is up to date
4. Check system compatibility

## Prevention Tips

1. **Keep zoxide updated:**
   \`\`\`bash
   # Homebrew
   brew upgrade zoxide
   
   # Cargo
   cargo install --force zoxide
   \`\`\`

2. **Regular maintenance:**
   - Periodically check database size
   - Exclude unnecessary directories
   - Keep shell configuration clean

3. **Test after changes:**
   - Always test zoxide after modifying shell config
   - Verify in new terminal window
   - Check both \`z\` and \`zi\` commands

## Related Articles

- [zoxide command not found](/blog/zoxide-command-not-found)
- [Installation guides](/tutorials)
- [Advanced configuration](/tutorials/advanced-config)`,
    date: '2025-12-01',
    author: 'zoxide.org',
    category: '故障排除',
    tags: ['troubleshooting', 'error', 'fix', 'not working'],
    readTime: 8,
  },
  {
    id: '6',
    slug: 'stop-using-cd',
    title: '别再只用 `cd` 了：Zoxide 如何彻底变革终端导航',
    excerpt:
      '如果你还在频繁手动输入 `cd`、反复敲 Tab 补全路径，这篇文章会向你展示 Zoxide 如何用“智能跳转”彻底改变你的终端导航方式。',
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content: '# Stop Using cd: How Zoxide Revolutionizes Terminal Navigation',
    date: '2025-12-02',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide', 'command not found', 'setup', 'fzf', 'config'],
    readTime: 10,
  },
  {
    id: '7',
    slug: 'zoxide-alias-autocomplete',
    title: '提升终端效率：深入解析 Zoxide Alias 和 Autocomplete 功能',
    excerpt:
      '通过 zoxide alias 和 autocomplete（自动补全）深度优化终端导航体验，结合 fzf、Arch 与 NixOS 配置，构建高效、可重复的工作流。',
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content: '# Boosting Terminal Efficiency: A Deep Dive into Zoxide Aliases and Autocomplete',
    date: '2025-12-03',
    author: 'zoxide.org',
    category: '技巧',
    tags: ['alias', 'autocomplete', 'fzf', 'arch', 'nixos'],
    readTime: 8,
  },
  {
    id: '8',
    slug: 'troubleshooting-zoxide-no-match-found',
    title: 'Zoxide 故障排除：修复 "No Match Found" 和数据库错误',
    excerpt:
      'Zoxide 通常是一个"安装后即忘"的工具，但随着目录历史记录的增长，你可能会遇到特定问题。本指南涵盖了如何调试和修复 "No Match Found" 错误以及数据库相关问题。',
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content: '# Troubleshooting Zoxide: Fixing "No Match Found" and Database Errors',
    date: '2025-12-04',
    author: 'zoxide.org',
    category: '故障排除',
    tags: ['troubleshooting', 'database', 'no match found', 'arch', 'nixos'],
    readTime: 10,
  },
  {
    id: '9',
    slug: 'mastering-terminal-navigation-zoxide-guide',
    title: '终端导航大师 —— Zoxide 使用终极指南',
    excerpt:
      '如果你每天在命令行界面花费大量时间，你一定体会过使用标准 `cd` 命令在深层目录结构中导航的痛苦。这篇综合指南将深入探讨如何使用 Zoxide，涵盖从 Ubuntu 安装到高级 `fzf` 集成以及常见错误排查的所有内容。',
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content: '# Mastering Terminal Navigation – The Ultimate Guide on How to Use Zoxide',
    date: '2025-12-04',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide', 'how to use', 'tutorial', 'ubuntu', 'fzf', 'query'],
    readTime: 12,
  },
  {
    id: '10',
    slug: 'advanced-zoxide-techniques',
    title: 'Advanced Zoxide Techniques: Mastering Frecency and Custom Workflows',
    excerpt:
      'Unlock frecency scoring, database backups, and scripted workflows so your zoxide setup on Arch or NixOS stays fast, portable, and automation-ready.',
    content: `# Advanced Zoxide Techniques: Mastering Frecency and Custom Workflows

Once you have the basics down, Zoxide can do much more than just jump folders. Understanding the underlying database mechanics allows you to manipulate rankings, backup your history, and script custom workflows. This is essential for power users on **zoxide arch** and **zoxide nixos** systems who want total control over their environment.

### Manipulating the Frecency Score

Zoxide ranks directories based on frequency and recency. Sometimes, you might want to manually check the score of a directory to understand why **zoxide autocomplete** is prioritizing it.

You can query the raw database:

\`\`\`bash
# List all matches with their scores
zoxide query --list --score
\`\`\`

If a directory has a low score, you might get a **zoxide no match found** error when using a short abbreviation. You can manually boost a path's score by visiting it repeatedly or using \`zoxide add\` multiple times.

### Backup and Sync

Your navigation history is valuable. If you switch machines or reinstall your OS, you don't want to start from scratch.

  * **Linux/Arch:** The data usually lives in \`~/.local/share/zoxide/db.zo\`.
  * **macOS:** It is often in \`~/Library/Application Support/zoxide\`.

For **zoxide nixos** users, persisting this file is crucial since the root filesystem might be ephemeral (erased on boot). Ensure your persistence configuration includes the Zoxide data directory so your **zoxide alias** history survives reboots.

\`\`\`nix
# Example NixOS persistence config snippet
environment.persistence."/persist".directories = [
  ".local/share/zoxide"
];
\`\`\`

### Scripting with Zoxide

You can use Zoxide inside your own scripts. Since \`z\` is a shell function (an alias), scripts should use the binary \`zoxide query\` to find paths without changing the directory.

\`\`\`bash
# A script to open the most "frecent" project in an editor
PROJECT_DIR=$(zoxide query my-project)
if [ -z "$PROJECT_DIR" ]; then
    echo "Error: zoxide no match found"
else
    nvim "$PROJECT_DIR"
fi
\`\`\`

### Advanced Aliases

Beyond the standard \`z\`, you can create custom **zoxide alias** functions. For example, a command that jumps to a directory and immediately lists its contents:

\`\`\`bash
# Add this to .bashrc or .zshrc
za() {
    z "$@" && ls -F
}
\`\`\`

This effectively combines navigation and inspection. Whether you are fine-tuning a **zoxide arch** setup or defining declarative modules in **zoxide nixos**, these advanced techniques turn a simple tool into a productivity powerhouse.

-----
`,
    date: '2025-12-05',
    author: 'zoxide.org',
    category: '技巧',
    tags: ['frecency', 'workflow', 'backup', 'arch', 'nixos'],
    readTime: 9,
  },
  {
    id: '11',
    slug: 'zoxide-commands',
    title: 'The Ultimate Guide to Zoxide Commands: Navigating Your Terminal at Light Speed',
    excerpt: 'Master the full suite of zoxide commands from initialization to database management. Learn how to debug navigation, clean history, script workflows, and migrate data with practical examples.',
    content: '# The Ultimate Guide to Zoxide Commands',
    date: '2025-12-06',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide commands', 'commands', 'tutorial', 'guide', 'navigation'],
    readTime: 12,
  },
  {
    id: '12',
    slug: 'zoxide-download-guide',
    title: 'Zoxide Download Guide: Safe, Fast Install for macOS, Windows, and Linux',
    excerpt:
      'A practical, SEO-focused guide for the keyword “zoxide download”: where to get the official binaries, how to install on macOS, Windows, and Linux, plus verification, troubleshooting, and upgrade tips.',
    // 内容由多语言文案文件提供，这里只做占位
    content: '# Zoxide Download Guide',
    date: '2025-12-11',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide download', 'install', 'macos', 'windows', 'linux', 'package manager'],
    readTime: 11,
  },
  {
    id: '13',
    slug: 'zoxide-init-guide',
    title: 'zoxide init: The Comprehensive Guide to Shell Integration',
    excerpt: 'So, you\'ve installed zoxide using a package manager like Homebrew, Scoop, or Apt. You type `z` in your terminal, expecting magic, but all you get is command not found. Don\'t worry — this guide focuses entirely on the `zoxide init` command.',
    content: `# zoxide init: The Comprehensive Guide to Shell Integration

So, you've installed **zoxide** using a package manager like Homebrew, Scoop, or Apt. You type \`z\` in your terminal, expecting magic, but all you get is **\`command not found\`** or a cursor that does nothing.

Don't worry — this is the most common stumbling block for new users.

Installing the binary is only step one. Step two is **initialization**.

This guide focuses entirely on the \`zoxide init\` command — the bridge that connects the zoxide binary to your shell's behavior. We'll cover how to configure it for every major shell, how to optimize it for performance, and how to use advanced flags to replace \`cd\` entirely.

---

## What Does \`zoxide init\` Actually Do?

Before we paste code into config files, it helps to understand what's happening.

\`zoxide\` is an executable, but your shell (Bash, Zsh, etc.) needs to know how to talk to it when you change directories.

When you run:

\`\`\`bash
zoxide init <shell>
\`\`\`

…it outputs a block of shell script. This script does three things:

1. **Defines the \`z\` command (or function).**
2. **Sets up a "hook"** that listens every time you change a directory, adding that path to zoxide's database.
3. **Handles the logic for the \`zi\`** (interactive selection) command.

This is why simply running \`zoxide\` does nothing. You need to **evaluate** (run) this output every time your shell starts.

---

## Configuration by Shell

Below are the correct \`zoxide init\` setups for the most popular shells.

### 1. Bash (Linux / macOS default)

Add the following line to the end of your \`~/.bashrc\` file:

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

**Pro Tip:** If you are on macOS and using Bash (rare nowadays, as Zsh is default), you might need to add this to \`~/.bash_profile\` instead.

---

### 2. Zsh (macOS default / Power users)

Edit your \`~/.zshrc\` file:

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

**Troubleshooting Zsh:** If you use plugins like oh-my-zsh or \`zsh-syntax-highlighting\`, make sure the zoxide init line is placed **after plugins are loaded**, but generally **before syntax highlighting** to ensure the command is recognized correctly.

---

### 3. Fish Shell

Fish handles things differently. It doesn't use \`eval\` in the same way. Add this to your \`~/.config/fish/config.fish\`:

\`\`\`fish
zoxide init fish | source
\`\`\`

---

### 4. PowerShell (Windows)

For Windows users, you need to edit your PowerShell profile. You can find the profile path by typing:

\`\`\`powershell
$PROFILE
\`\`\`

Add this line to that file:

\`\`\`powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
\`\`\`

---

### 5. Nushell

Nushell is gaining traction for its structured data approach.

Add this to your env file (usually \`~/.config/nushell/env.nu\`):

\`\`\`nu
zoxide init nushell | save -f ~/.zoxide.nu
\`\`\`

And then in your config file (\`~/.config/nushell/config.nu\`), add:

\`\`\`nu
source ~/.zoxide.nu
\`\`\`

---

## Advanced: Replacing \`cd\` with zoxide

Many users (myself included) prefer not to think about whether to use \`cd\` or \`z\`. We want \`cd\` to just be smarter.

You can force \`zoxide init\` to alias \`cd\` to \`z\` automatically using the \`--cmd\` flag.

### Example for Zsh

Change your init line to:

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

### What this does

- \`cd\` now uses zoxide's fuzzy logic.
- \`cd ..\` still goes up one directory.
- \`cd /tmp\` still goes to an absolute path.
- But \`cd foo\` will jump to your most frequent \`foo\` directory, even if it's deep in your file system.

> **Note:** If you use this, the \`z\` command will still exist, but \`cd\` becomes your daily driver.

---

## Performance Tuning: Lazy Loading

If you are obsessive about shell startup time (milliseconds matter!), running:

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

…adds a tiny bit of overhead because it has to spawn the zoxide binary just to generate text.

You can **lazy load** zoxide. This means the shell won't initialize zoxide until the first time you actually type \`z\`.

### Example: Zsh Lazy Load Script

\`\`\`zsh
z() {
    unfunction "$0"
    eval "$(zoxide init zsh)"
    $0 "$@"
}
\`\`\`

⚠️ **Warning:** The downside of lazy loading is that zoxide won't record directory changes until after you run \`z\` for the first time in that session. If you open a terminal, \`cd\` around manually, and then close it without ever running \`z\`, those paths won't be saved to the database.

---

## Troubleshooting Common init Errors

### "command not found: z"

- Did you restart the shell? The config file is only read on startup.
  - Run \`source ~/.zshrc\` (or equivalent), or open a new terminal tab.
- Is zoxide in your \`PATH\`?
  - Run \`which zoxide\`. If it returns nothing, check your installation method.
- Did you use the wrong shell syntax?
  - Putting the Bash \`eval\` command into \`config.fish\` will fail.

---

### "zoxide: error: unknown flag"

You might be using an outdated version of zoxide. The init flags have evolved.

- Check version:

\`\`\`bash
zoxide --version
\`\`\`

- Update it.
  - If you installed via \`apt\` on an old Ubuntu distro, it might be very old.
  - Prefer **Homebrew** or the **official install script** for the latest version.

---

## Final Thoughts

The \`zoxide init\` command is a "set it and forget it" step, but understanding it gives you control over your terminal environment.

Whether you stick to the standard \`z\` command or alias \`cd\` entirely, proper initialization is the key to unlocking that 10× navigation speed.

Now, go edit that config file.`,
    date: '2025-12-20',
    author: 'zoxide.org',
    category: '教程',
    tags: ['zoxide init', 'shell', 'configuration', 'bash', 'zsh', 'fish', 'powershell', 'nushell', 'setup'],
    readTime: 12,
  },
  {
    id: '16',
    slug: 'zoxide-performance-en',
    locales: ['en'],
    alternateSlugs: { zh: 'zoxide-performance-zh', ja: 'zoxide-performance-ja' },
    title: 'Why zoxide is Faster: A Deep Dive into the Rank Algorithm',
    excerpt: 'Understanding the Frecent algorithm behind zoxide and how it predicts your next directory jump with high accuracy.',
    content: `# Why zoxide is Faster: A Deep Dive into the Rank Algorithm
    
Have you ever wondered how \`z\` knows exactly where you want to go? It's not magic—it's **Frecency**.

## Frequency + Recency = Frecency

Zoxide uses a ranking algorithm that weighs two factors:
1.  **Frequency**: How often you visit a directory.
2.  **Recency**: How recently you visited it.

By combining these, \`zoxide\` ensures that a directory you visited 100 times last year doesn't outrank a directory you visited 5 times today.

## Best Practices for Performance

To keep your database fast:
-   **Exclude heavy directories** like node_modules. (See [Advanced Config](/en/tutorials/advanced-config/))
-   **Use strict mode** if you want exact matches.

Zoxide is built in **Rust** for blazing speed, ensuring that the lookup time is imperceptible even with a large database.`,
    date: '2026-01-07',
    author: 'zoxide.org',
    category: 'Deep Dive',
    tags: ['performance', 'algorithm', 'rust'],
    readTime: 4,
  },
  {
    id: '17',
    slug: 'zoxide-performance-zh',
    locales: ['zh'],
    alternateSlugs: { en: 'zoxide-performance-en', ja: 'zoxide-performance-ja' },
    title: '为什么 zoxide 这么快：深入解析排名算法',
    excerpt: '深入了解 zoxide 背后的"频率+最近使用"（Frecent）算法，以及它是如何精准预测你的下一次跳转的。',
    content: `# 为什么 zoxide 这么快：深入解析排名算法
    
你有没有想过，为什么输入 \`z\` 就能准确跳到你想去的地方？这可不是魔法，而是 **Frecency（频率+时效）** 算法。

## 频率 (Frequency) + 时效 (Recency)

Zoxide 使用一套加权排名算法：
1.  **频率**：你访问某个目录的次数。
2.  **时效**：你最近一次访问它的时间。

通过结合这两点，zoxide 确保了"如果一个目录你去年去了 100 次但最近没去"，它不会排在"今天去了 5 次"的活跃目录前面。

## 性能优化最佳实践

为了保持极速体验：
-   **排除重型目录**：比如 node_modules。（参考 [高级配置](/zh/tutorials/advanced-config/)）
-   **定期清理**：系统会自动处理，但你也可以手动管理数据库。

Zoxide 使用 **Rust** 编写，确保即使在庞大的数据库中，查询时间也几乎可以忽略不计。`,
    date: '2026-01-07',
    author: 'zoxide.org',
    category: '深度解析',
    tags: ['性能', '算法', 'rust'],
    readTime: 4,
  },
  {
    id: '18',
    slug: 'how-zoxide-works-en',
    locales: ['en'],
    alternateSlugs: { zh: 'how-zoxide-works-zh', ja: 'how-zoxide-works-ja' },
    title: 'How does zoxide change the directory? (The Internal Magic)',
    excerpt: 'Deep dive into how zoxide interacts with your shell to change directories, despite being a separate binary process.',
    content: `# How does zoxide change the directory?
    
If you've ever written a script in a language like Python or Rust, you might know a hard truth: **a child process cannot change the working directory of its parent process**.

So, if \`zoxide\` is just a binary tool, how does typing \`z foo\` actually move your shell to another folder?

## The Problem: Process Isolation

When you run a command in your shell (like \`bash\` or \`zsh\`), that command runs in a new process.
-   **Wrapper**: \`zoxide\` runs, finds the best match directory, and prints it.
-   **Exit**: \`zoxide\` finishes and exits.
-   **Result**: The parent shell stays exactly where it was.

If \`zoxide\` tried to call \`chdir()\` internally, it would only change *its own* directory, not the shell's.

## The Solution: Shell Integration

This is why **initialization** is so critical. When you run \`eval "$(zoxide init <shell>)"\`, you aren't just configuring zoxide; you are defining a **shell function** (or alias) wrapper.

Here is what logically happens when you type \`z foo\`:

1.  **Capture**: The shell wrapper calls \`zoxide query foo\`.
2.  **Output**: \`zoxide\` calculates the best match (e.g., \`/home/user/projects/foo\`) and prints it to standard output.
3.  **Action**: The shell wrapper captures this string.
4.  **Navigation**: The shell wrapper executes \`cd /home/user/projects/foo\`.

Because the \`cd\` command is executed by the *shell wrapper* (which is part of the shell process), your working directory actually changes.

## Why 'zoxide init' is Mandatory

Many users install the binary and wonder why \`z\` doesn't work. Without the \`init\` line in your \`.bashrc\` or \`.zshrc\`, the \`z\` function doesn't exist, and the bridge between the tool and your shell is never built.

To learn how to set this up correctly, check out our [Installation Guide](/en/tutorials/install-windows/).

## Conclusion

Zoxide relies on a clever handshake: the binary handles the brain (database, ranking, matching), and the shell function handles the body (moving the user). This separation allows zoxide to be incredibly fast and portable while still feeling native to your terminal.`,
    date: '2026-01-08',
    author: 'zoxide.org',
    category: 'Deep Dive',
    tags: ['shell', 'internals', 'bash', 'zsh'],
    readTime: 5,
  },
  {
    id: '19',
    slug: 'how-zoxide-works-zh',
    locales: ['zh'],
    alternateSlugs: { en: 'how-zoxide-works-en', ja: 'how-zoxide-works-ja' },
    title: 'zoxide 是如何切换目录的？（原理解析）',
    excerpt: '深入解析 zoxide 作为独立二进制程序，是如何突破进程限制，控制你的 Shell 进行目录切换的。',
    content: `# zoxide 是如何切换目录的？
    
如果你写过 Python 或 Rust 脚本，你可能知道一个铁律：**子进程无法改变父进程的工作目录**。

那么，既然 \`zoxide\` 只是一个外部二进制工具，为什么输入 \`z foo\` 却能真的让你的终端跳转到别的文件夹呢？

## 问题：进程隔离

当你在 Shell（如 \`bash\` 或 \`zsh\`）中运行一个命令时，该命令是在一个新的子进程中运行的。
-   **运行**：\`zoxide\` 启动，计算出最佳匹配目录，然后打印出来。
-   **退出**：\`zoxide\` 任务结束，进程销毁。
-   **结果**：父进程（Shell）依然停留在原地。

如果 \`zoxide\` 在内部调用 \`chdir()\`，它只会改变*它自己*的当前目录，而不会影响你的 Shell。

## 解决方案：Shell 集成

这就是为什么 **初始化 (Initialization)** 如此重要。当你运行 \`eval "$(zoxide init <shell>)"\` 时，你不仅仅是在配置 zoxide，你实际上是在当前 Shell 中定义了一个 **函数 (Function)** 或别名。

当你输入 \`z foo\` 时，后台发生的真实逻辑是这样的：

1.  **捕获**：Shell 函数调用 \`zoxide query foo\`。
2.  **输出**：\`zoxide\` 计算出最佳匹配（例如 \`/home/user/projects/foo\`）并将其打印到标准输出。
3.  **行动**：Shell 函数捕获这个字符串。
4.  **导航**：Shell 函数执行 \`cd /home/user/projects/foo\`。

因为这个 \`cd\` 命令是由 *Shell 函数*（属于 Shell 进程本身）执行的，所以你的工作目录才真正发生了改变。

## 为什么 'zoxide init' 必不可少

很多用户安装完二进制文件后，疑惑为什么 \`z\` 没反应。原因就是没有在 \`.bashrc\` 或 \`.zshrc\` 中添加 \`init\` 命令行，导致那个能够"桥接"工具与 Shell 的 \`z\` 函数根本不存在。

如果需要了解正确的配置方法，请查看我们的 [安装指南](/zh/tutorials/install-windows/)。

## 总结

Zoxide 依赖于一个巧妙的握手协议：二进制程序负责"大脑"（数据库、排名、匹配），而 Shell 函数负责"身体"（移动用户）。这种分离设计使得 zoxide 既能保持极高的性能和移植性，又能像原生命令一样无缝融入你的终端体验。`,
    date: '2026-01-08',
    author: 'zoxide.org',
    category: '深度解析',
    tags: ['shell', '原理解析', 'bash', 'zsh'],
    readTime: 5,
  }
  ,

  {
    id: '20',
    slug: 'zoxide-performance-ja',
    locales: ['ja'],
    alternateSlugs: { en: 'zoxide-performance-en' },
    title: 'zoxideが速い理由：ランクアルゴリズムの詳細解説',
    excerpt: 'zoxideの背後にあるFrecentアルゴリズムを理解し、次のディレクトリジャンプを高精度で予測する仕組み。',
    content: '',
    date: '2026-01-07',
    author: 'zoxide.org',
    category: '詳細解説',
    tags: ['zoxide', 'パフォーマンス', 'アルゴリズム', 'rust'],
    readTime: 6,
  },
  {
    id: '21',
    slug: 'how-zoxide-works-ja',
    locales: ['ja'],
    alternateSlugs: { en: 'how-zoxide-works-en' },
    title: 'zoxideはどうやってディレクトリを変更するのか？（内部の魔法）',
    excerpt: '別のバイナリプロセスであるにもかかわらず、zoxideがシェルとどのように連携してディレクトリを変更するのかを深掘り。',
    content: '',
    date: '2026-01-08',
    author: 'zoxide.org',
    category: '詳細解説',
    tags: ['zoxide', '内部', 'シェル', 'フック'],
    readTime: 7,
  }
];

// 根据 slug 获取文章
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

// 根据 ID 获取文章
export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

// 获取所有文章
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

// 获取相关文章（基于分类和标签）
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3, targetLocale?: string): BlogPost[] {
  return blogPosts
    .filter((post) => {
      // 排除当前文章
      if (post.id === currentPost.id) return false;

      // 如果提供了目标语言，且文章限定了语言，必须包含目标语言
      if (targetLocale && post.locales && !post.locales.includes(targetLocale as 'zh' | 'en' | 'ja')) {
        return false;
      }

      // 如果当前文章限定了语言，只推荐同语言的文章（保留原有逻辑作为回退）
      if (!targetLocale && currentPost.locales && !currentPost.locales.some((loc) => post.locales?.includes(loc))) {
        return false;
      }

      // 优先匹配相同分类
      if (post.category === currentPost.category) return true;

      // 其次匹配相同标签
      return post.tags.some((tag) => currentPost.tags.includes(tag));
    })
    .slice(0, limit);
}

// 获取文章在目标语言中对应的 slug
// 如果文章没有语言限制，返回相同 slug
// 如果目标语言已支持该文章，返回相同 slug
// 如果有配对文章，返回配对的 slug
// 否则返回 null（表示目标语言无对应文章）
export function getAlternateSlug(slug: string, targetLocale: 'zh' | 'en' | 'ja'): string | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  // 如果文章没有语言限制，返回相同 slug
  if (!post.locales) return slug;

  // 如果目标语言已支持，返回相同 slug
  if (post.locales.includes(targetLocale)) return slug;

  // 返回配对的 slug（如果存在）
  return post.alternateSlugs?.[targetLocale] || null;
}

