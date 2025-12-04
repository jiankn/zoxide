// 博客文章数据类型
export interface BlogPost {
  id: string;
  slug: string;
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
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter((post) => {
      // 排除当前文章
      if (post.id === currentPost.id) return false;
      
      // 优先匹配相同分类
      if (post.category === currentPost.category) return true;
      
      // 其次匹配相同标签
      return post.tags.some((tag) => currentPost.tags.includes(tag));
    })
    .slice(0, limit);
}

