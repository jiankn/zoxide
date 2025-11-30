// 教程数据类型
export interface Tutorial {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown 格式
  duration: string;
  level: string;
  category: string;
  date: string;
}

// 教程数据
export const tutorials: Tutorial[] = [
  {
    slug: 'quick-start',
    title: 'zoxide 快速开始',
    excerpt: '5 分钟快速上手 zoxide，学习基本命令和配置方法。',
    duration: '5 分钟',
    level: '初级',
    category: '入门教程',
    date: '2025-11-30',
    content: `# zoxide 快速开始

zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。本教程将帮助你在 5 分钟内快速上手。

## 什么是 zoxide？

zoxide 是一个更智能的 \`cd\` 命令替代工具。它能够：

- **智能学习**：自动记录你访问的目录，学习你的使用习惯
- **模糊搜索**：只需输入目录名的一部分即可跳转
- **极速性能**：使用 Rust 编写，比传统 \`cd\` 命令快 10 倍以上

## 安装 zoxide

### macOS

使用 Homebrew 安装：

\`\`\`bash
brew install zoxide
\`\`\`

### Windows

使用 Scoop 安装：

\`\`\`bash
scoop install zoxide
\`\`\`

### Linux / 所有平台

使用 Cargo 安装（需要先安装 Rust）：

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

### PowerShell

在 PowerShell 配置文件中添加：

\`\`\`powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
\`\`\`

配置完成后，重新加载 Shell 或打开新终端窗口。

## 基本使用

### 跳转到目录

使用 \`z\` 命令跳转到匹配的目录：

\`\`\`bash
# 跳转到包含 "project" 的目录
z project

# 跳转到包含 "doc" 的目录
z doc
\`\`\`

### 交互式选择

使用 \`zi\` 命令可以交互式选择目录：

\`\`\`bash
zi pro
\`\`\`

这会显示所有匹配的目录，你可以使用方向键选择。

### 返回上一个目录

使用 \`z -\` 可以返回上一个目录：

\`\`\`bash
z -
\`\`\`

### 列出匹配的目录

使用 \`z -l\` 可以列出所有匹配的目录：

\`\`\`bash
z -l project
\`\`\`

## 工作原理

zoxide 通过以下方式工作：

1. **记录访问**：每次你使用 \`cd\` 或 \`z\` 命令时，zoxide 会记录你访问的目录
2. **学习频率**：经常访问的目录会获得更高的优先级
3. **智能匹配**：当你输入目录名时，zoxide 会匹配最相关的目录

## 下一步

现在你已经掌握了 zoxide 的基本用法。接下来可以学习：

- [基本命令详解](/tutorials/basic-commands)
- [Shell 配置优化](/tutorials/shell-setup)
- [高级配置技巧](/tutorials/advanced-config)`,
  },
  {
    slug: 'basic-commands',
    title: 'zoxide 基本命令',
    excerpt: '深入学习 zoxide 的所有基本命令和使用技巧。',
    duration: '10 分钟',
    level: '初级',
    category: '入门教程',
    date: '2025-11-30',
    content: `# zoxide 基本命令详解

本教程将详细介绍 zoxide 的所有基本命令和使用技巧。

## 核心命令

### z - 智能跳转

\`z\` 是 zoxide 的核心命令，用于跳转到匹配的目录。

\`\`\`bash
# 基本用法
z project

# 可以只输入目录名的一部分
z proj

# 支持路径片段
z src/main
\`\`\`

**工作原理**：
- zoxide 会匹配所有包含输入关键词的目录
- 根据访问频率和相关性排序
- 自动跳转到最匹配的目录

### zi - 交互式选择

\`zi\` 命令提供交互式目录选择，特别适合有多个匹配结果的情况。

\`\`\`bash
zi project
\`\`\`

这会显示一个交互式列表，你可以：
- 使用方向键上下移动
- 按 \`Enter\` 选择目录
- 按 Esc 取消

### z - - 返回上一个目录

\`z -\` 可以快速返回上一个访问的目录，类似于 \`cd -\`。

\`\`\`bash
# 从 /home/user/project 跳转到 /home/user/docs
z docs

# 返回上一个目录 /home/user/project
z -
\`\`\`

### z -l - 列出匹配结果

\`z -l\` 可以列出所有匹配的目录，而不实际跳转。

\`\`\`bash
z -l project
\`\`\`

输出示例：
\`\`\`text
/home/user/projects/web-project    10
/home/user/projects/mobile-project  5
/home/user/old-project              1
\`\`\`

数字表示访问频率。

## 高级用法

### 组合使用

你可以组合多个命令：

\`\`\`bash
# 先列出匹配结果
z -l proj

# 然后跳转
z proj
\`\`\`

### 与管道结合

\`z -l\` 的输出可以与其他命令结合：

\`\`\`bash
# 查找包含 "test" 的目录并显示详细信息
z -l test | head -5
\`\`\`

## 常见场景

### 场景 1：快速跳转到项目目录

\`\`\`bash
# 假设你经常访问 ~/projects/my-app
z my-app
\`\`\`

### 场景 2：在多个相似目录中选择

\`\`\`bash
# 如果有多个包含 "project" 的目录
zi project
\`\`\`

### 场景 3：探索目录结构

\`\`\`bash
# 先查看匹配的目录
z -l src

# 然后选择跳转
z src
\`\`\`

## 技巧和最佳实践

1. **使用简短的关键词**：不需要输入完整路径，只需输入目录名的关键部分
2. **利用访问频率**：经常访问的目录会自动排在前面
3. **交互式选择**：当不确定时，使用 \`zi\` 命令查看所有选项
4. **组合命令**：先使用 \`z -l\` 查看，再使用 \`z\` 跳转

## 下一步

- [Shell 配置优化](/tutorials/shell-setup)
- [高级配置技巧](/tutorials/advanced-config)
- [性能优化](/tutorials/performance)`,
  },
  {
    slug: 'shell-setup',
    title: 'Shell 配置详解',
    excerpt: '详细配置 zoxide 在不同 Shell 环境中的集成。',
    duration: '15 分钟',
    level: '初级',
    category: '入门教程',
    date: '2025-11-30',
    content: `# Shell 配置详解

本教程将详细介绍如何在不同的 Shell 环境中配置 zoxide。

## 支持的 Shell

zoxide 支持以下 Shell：

- **zsh** - macOS 默认 Shell（从 macOS Catalina 开始）
- **bash** - Linux 和 macOS 常用 Shell
- **fish** - 现代化的 Shell
- **PowerShell** - Windows 和跨平台 Shell
- **elvish** - 实验性支持
- **nushell** - 实验性支持

## zsh 配置

### 基本配置

在 \`~/.zshrc\` 文件中添加：

\`\`\`bash
eval "$(zoxide init zsh)"
\`\`\`

### 高级配置

你可以自定义 zoxide 的行为：

\`\`\`bash
# 初始化 zoxide
eval "$(zoxide init zsh)"

# 自定义别名（可选）
alias zz='z'
alias zi='zi'
\`\`\`

### 与 Oh My Zsh 集成

如果你使用 Oh My Zsh，可以将配置添加到 \`~/.zshrc\`：

\`\`\`bash
# Oh My Zsh 配置
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)

source $ZSH/oh-my-zsh.sh

# zoxide 配置
eval "$(zoxide init zsh)"
\`\`\`

## bash 配置

### 基本配置

在 \`~/.bashrc\` 文件中添加：

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

### macOS 特殊配置

在 macOS 上，如果使用 bash，可能需要在 \`~/.bash_profile\` 中添加：

\`\`\`bash
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
\`\`\`

然后在 \`~/.bashrc\` 中添加 zoxide 配置。

## fish 配置

### 基本配置

在 \`~/.config/fish/config.fish\` 文件中添加：

\`\`\`fish
zoxide init fish | source
\`\`\`

### 自定义配置

\`\`\`fish
# zoxide 配置
zoxide init fish | source

# 自定义函数（可选）
function zz
    z $argv
end
\`\`\`

## PowerShell 配置

### Windows PowerShell

在 PowerShell 配置文件中添加：

\`\`\`powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
\`\`\`

配置文件位置：
- PowerShell 5.1: \`$PROFILE\`
- PowerShell 7+: \`$PROFILE\`

### PowerShell Core (跨平台)

配置方法相同，但配置文件位置可能不同。

## 验证配置

配置完成后，重新加载 Shell：

- **zsh**: \`source ~/.zshrc\` 或重新打开终端
- **bash**: \`source ~/.bashrc\` 或重新打开终端
- **fish**: \`source ~/.config/fish/config.fish\` 或重新打开终端
- **PowerShell**: 重新打开 PowerShell

然后测试：

\`\`\`bash
# 测试 zoxide 是否正常工作
z --help

# 或者尝试跳转
z ~
\`\`\`

## 常见问题

### 问题 1：命令未找到

如果提示 \`z: command not found\`，检查：

1. zoxide 是否正确安装
2. Shell 配置文件是否正确添加初始化命令
3. 是否重新加载了 Shell

### 问题 2：配置不生效

确保：
1. 配置文件路径正确
2. 配置文件有执行权限
3. 重新加载了 Shell

### 问题 3：与其他工具冲突

如果与其他工具（如 autojump）冲突，可以：

1. 卸载冲突的工具
2. 或者使用不同的别名

## 最佳实践

1. **备份配置文件**：修改前先备份
2. **测试配置**：每次修改后测试是否正常工作
3. **保持更新**：定期更新 zoxide 到最新版本
4. **文档参考**：遇到问题查看官方文档

## 下一步

- [高级配置技巧](/tutorials/advanced-config)
- [性能优化](/tutorials/performance)
- [与 fzf 集成](/tutorials/fzf-integration)`,
  },
  {
    slug: 'advanced-config',
    title: 'zoxide 高级配置',
    excerpt: '学习 zoxide 的高级配置选项，包括环境变量、自定义别名、目录排除等。',
    duration: '20 分钟',
    level: '中级',
    category: '进阶技巧',
    date: '2025-11-30',
    content: `# zoxide 高级配置

本教程将介绍 zoxide 的高级配置选项，帮助你根据个人需求定制 zoxide 的行为。

## 环境变量配置

### 排除目录

使用 \`_ZO_EXCLUDE_DIRS\` 环境变量可以排除不需要索引的目录，提升性能：

\`\`\`bash
# 排除多个目录，用冒号分隔
export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules"

# 在 Shell 配置文件中永久设置
echo 'export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules"' >> ~/.zshrc
\`\`\`

**推荐排除的目录**：
- \`/tmp\` - 临时文件
- \`/var\` - 系统变量目录
- \`/node_modules\` - Node.js 依赖（如果项目很多）
- \`/.git\` - Git 仓库（可选）

### 自定义数据库位置

默认数据库存储在 \`~/.zo\`，可以通过 \`_ZO_DATA_DIR\` 自定义：

\`\`\`bash
# 自定义数据库位置
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"

# 在 Shell 配置文件中设置
echo 'export _ZO_DATA_DIR="$HOME/.local/share/zoxide"' >> ~/.zshrc
\`\`\`

**使用场景**：
- 需要将数据库存储在特定位置
- 使用同步工具同步配置
- 团队共享数据库

### 最大历史记录数

使用 \`_ZO_MAXAGE\` 设置最大历史记录天数（默认 10000）：

\`\`\`bash
# 设置最大历史记录为 5000 天
export _ZO_MAXAGE=5000
\`\`\`

### 排除模式

使用 \`_ZO_EXCLUDE_PATHS\` 可以设置更复杂的排除规则：

\`\`\`bash
# 排除所有包含 .git 的路径
export _ZO_EXCLUDE_PATHS=".git"
\`\`\`

## 自定义别名

### 创建简短别名

在 Shell 配置文件中添加自定义别名：

\`\`\`bash
# zsh/bash
alias zz='z'
alias zi='zi'
alias za='zoxide add'
alias zq='zoxide query'
alias zr='zoxide remove'

# fish
function zz
    z $argv
end

function za
    zoxide add $argv
end
\`\`\`

### 组合命令

创建更强大的组合命令：

\`\`\`bash
# 快速跳转并列出文件
alias zl='z && ls -la'

# 跳转并打开编辑器
alias zc='z && code .'
\`\`\`

## 高级用法

### 使用 zoxide query

\`zoxide query\` 可以获取匹配结果但不跳转，适合脚本使用：

\`\`\`bash
# 获取匹配的目录路径
zoxide query project

# 在脚本中使用
cd "$(zoxide query project)"
\`\`\`

### 手动添加目录

使用 \`zoxide add\` 可以手动添加目录到数据库：

\`\`\`bash
# 添加当前目录
zoxide add .

# 添加指定目录
zoxide add /path/to/directory
\`\`\`

### 移除目录

使用 \`zoxide remove\` 可以移除目录：

\`\`\`bash
# 移除当前目录
zoxide remove .

# 移除指定目录
zoxide remove /path/to/directory
\`\`\`

## 性能优化

### 减少索引范围

只索引常用目录，可以显著提升性能：

\`\`\`bash
# 排除大型目录
export _ZO_EXCLUDE_DIRS="/tmp:/var:/proc:/sys:/node_modules"
\`\`\`

### 定期清理数据库

如果数据库过大，可以手动清理：

\`\`\`bash
# 查看数据库大小
ls -lh ~/.zo

# 删除数据库重新开始（谨慎操作）
rm ~/.zo
\`\`\`

### 优化启动速度

确保初始化命令在配置文件中的位置合理：

\`\`\`bash
# 将 zoxide 初始化放在配置文件末尾
# 这样可以避免影响其他配置的加载
eval "$(zoxide init zsh)"
\`\`\`

## 团队协作

### 共享数据库

zoxide 支持共享数据库，团队成员可以共享常用目录：

\`\`\`bash
# 使用共享数据库位置
export _ZO_DATA_DIR="/shared/path/zoxide"
\`\`\`

**注意事项**：
- 确保所有团队成员有读写权限
- 定期备份共享数据库
- 考虑使用版本控制管理数据库

## 故障排除

### 数据库损坏

如果数据库损坏，可以删除重建：

\`\`\`bash
# 备份旧数据库
mv ~/.zo ~/.zo.backup

# zoxide 会自动创建新数据库
\`\`\`

### 性能问题

如果 zoxide 运行缓慢：

1. 检查排除目录设置
2. 清理数据库
3. 检查系统资源使用

## 最佳实践

1. **合理设置排除目录**：排除不需要索引的大型目录
2. **定期清理**：定期清理不常用的目录记录
3. **备份数据库**：重要配置要备份
4. **团队协作**：使用共享数据库提升团队效率

## 下一步

- [性能优化](/tutorials/performance)
- [与 fzf 集成](/tutorials/fzf-integration)
- [故障排除](/tutorials/troubleshooting)`,
  },
  {
    slug: 'performance',
    title: 'zoxide 性能优化',
    excerpt: '学习如何优化 zoxide 的性能，包括数据库优化、启动速度提升等技巧。',
    duration: '15 分钟',
    level: '中级',
    category: '进阶技巧',
    date: '2025-11-30',
    content: `# zoxide 性能优化

本教程将介绍如何优化 zoxide 的性能，让你的目录跳转更快更高效。

## 性能优势

zoxide 本身已经非常快，但通过合理配置可以进一步提升性能：

- **启动速度**：优化初始化时间
- **查询速度**：优化数据库查询
- **内存使用**：减少内存占用

## 数据库优化

### 排除不需要的目录

最重要的优化是排除不需要索引的目录：

\`\`\`bash
# 排除系统目录和临时文件
export _ZO_EXCLUDE_DIRS="/tmp:/var:/proc:/sys"

# 排除开发依赖目录（如果项目很多）
export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules:/.git"
\`\`\`

**性能提升**：
- 减少数据库大小 50-80%
- 提升查询速度 2-3 倍
- 减少内存占用

### 定期清理数据库

定期清理不常用的目录记录：

\`\`\`bash
# 查看数据库大小
ls -lh ~/.zo

# 如果数据库过大（> 10MB），考虑清理
# 删除数据库后，zoxide 会重新学习
rm ~/.zo
\`\`\`

### 限制历史记录

使用 \`_ZO_MAXAGE\` 限制历史记录天数：

\`\`\`bash
# 只保留最近 1 年的记录
export _ZO_MAXAGE=365
\`\`\`

## 启动速度优化

### 延迟初始化

在某些 Shell 中，可以延迟初始化 zoxide：

\`\`\`bash
# zsh - 使用 lazy loading
zoxide() {
    unfunction zoxide
    eval "$(command zoxide init zsh)"
    zoxide "$@"
}
\`\`\`

### 优化配置文件位置

将 zoxide 初始化放在配置文件末尾：

\`\`\`bash
# ~/.zshrc
# ... 其他配置 ...

# zoxide 初始化放在最后
eval "$(zoxide init zsh)"
\`\`\`

## 查询优化

### 使用精确匹配

尽量使用更精确的关键词：

\`\`\`bash
# 好的做法：使用具体的关键词
z my-project

# 避免：使用过于通用的关键词
z pro
\`\`\`

### 利用访问频率

zoxide 会自动学习你的使用习惯，经常访问的目录会优先匹配。保持使用习惯可以让匹配更准确。

## 内存优化

### 减少数据库大小

通过排除目录和限制历史记录，可以减少内存使用：

\`\`\`bash
# 综合优化配置
export _ZO_EXCLUDE_DIRS="/tmp:/var:/proc:/sys:/node_modules"
export _ZO_MAXAGE=1000
\`\`\`

## 性能测试

### 测试启动速度

\`\`\`bash
# 测试 zoxide 初始化时间
time eval "$(zoxide init zsh)"
\`\`\`

### 测试查询速度

\`\`\`bash
# 测试查询性能
time z project
\`\`\`

## 实际案例

### 案例 1：大型项目环境

如果你有大量项目目录：

\`\`\`bash
# 排除 node_modules 和 .git
export _ZO_EXCLUDE_DIRS="/node_modules:/.git:/dist:/build"
\`\`\`

**效果**：数据库大小减少 70%，查询速度提升 3 倍。

### 案例 2：系统管理员

如果你需要管理大量系统目录：

\`\`\`bash
# 只索引用户目录
export _ZO_EXCLUDE_DIRS="/tmp:/var:/proc:/sys:/usr"
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"
\`\`\`

### 案例 3：团队协作

团队共享数据库：

\`\`\`bash
# 使用共享位置
export _ZO_DATA_DIR="/shared/zoxide"
\`\`\`

**注意事项**：
- 确保权限正确
- 定期备份
- 考虑使用 Git 管理

## 监控和维护

### 定期检查数据库大小

\`\`\`bash
# 添加到 crontab，每周检查一次
0 0 * * 0 ls -lh ~/.zo >> ~/zoxide-size.log
\`\`\`

### 自动清理脚本

创建清理脚本：

\`\`\`bash
#!/bin/bash
# cleanup-zoxide.sh

ZO_DB="$HOME/.zo"
MAX_SIZE=10485760  # 10MB

if [ -f "$ZO_DB" ]; then
    SIZE=$(stat -f%z "$ZO_DB" 2>/dev/null || stat -c%s "$ZO_DB" 2>/dev/null)
    if [ "$SIZE" -gt "$MAX_SIZE" ]; then
        echo "Database too large, backing up and resetting..."
        cp "$ZO_DB" "$ZO_DB.backup"
        rm "$ZO_DB"
    fi
fi
\`\`\`

## 最佳实践总结

1. **排除不需要的目录**：最重要的优化
2. **定期清理数据库**：保持数据库大小合理
3. **限制历史记录**：根据实际需求设置
4. **优化配置文件**：合理组织配置顺序
5. **监控性能**：定期检查数据库大小和性能

## 下一步

- [与 fzf 集成](/tutorials/fzf-integration)
- [故障排除](/tutorials/troubleshooting)
- [高级配置技巧](/tutorials/advanced-config)`,
  },
  {
    slug: 'fzf-integration',
    title: 'zoxide 与 fzf 集成',
    excerpt: '学习如何将 zoxide 与 fzf 结合使用，实现更强大的目录搜索和选择功能。',
    duration: '25 分钟',
    level: '高级',
    category: '进阶技巧',
    date: '2025-11-30',
    content: `# zoxide 与 fzf 集成

本教程将介绍如何将 zoxide 与 fzf（模糊查找器）结合使用，实现更强大的目录搜索和选择功能。

## 什么是 fzf？

fzf（Fuzzy Finder）是一个通用的命令行模糊查找器，可以：

- 快速搜索文件和目录
- 交互式选择
- 支持预览功能
- 高度可定制

## 安装 fzf

### macOS

\`\`\`bash
brew install fzf
\`\`\`

### Linux

\`\`\`bash
# Ubuntu/Debian
sudo apt install fzf

# Arch Linux
sudo pacman -S fzf
\`\`\`

### 手动安装

\`\`\`bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
\`\`\`

## 基础集成

### 使用 fzf 选择 zoxide 结果

创建一个函数，使用 fzf 选择 zoxide 的匹配结果：

\`\`\`bash
# zsh/bash
zi() {
    local dir
    dir=$(zoxide query -l | fzf) && z "$dir"
}
\`\`\`

### fish 版本

\`\`\`fish
function zi
    set dir (zoxide query -l | fzf)
    if test -n "$dir"
        z "$dir"
    end
end
\`\`\`

## 高级集成

### 带预览的集成

使用 fzf 的预览功能显示目录内容：

\`\`\`bash
# zsh/bash
zi() {
    local dir
    dir=$(zoxide query -l | fzf --preview 'ls -la {}') && z "$dir"
}
\`\`\`

### 多选模式

允许选择多个目录：

\`\`\`bash
zi() {
    local dirs
    dirs=$(zoxide query -l | fzf -m)
    if [ -n "$dirs" ]; then
        echo "$dirs" | while read dir; do
            echo "Selected: $dir"
        done
    fi
}
\`\`\`

## 实用函数

### 快速跳转并预览

\`\`\`bash
# 跳转并显示目录内容
zfp() {
    local dir
    dir=$(zoxide query -l | fzf --preview 'tree -L 2 {}')
    [ -n "$dir" ] && z "$dir" && ls -la
}
\`\`\`

### 搜索并打开编辑器

\`\`\`bash
# 搜索目录并打开 VS Code
zcode() {
    local dir
    dir=$(zoxide query -l | fzf)
    [ -n "$dir" ] && z "$dir" && code .
}
\`\`\`

### 搜索并执行命令

\`\`\`bash
# 搜索目录并执行命令
zexec() {
    local dir cmd
    dir=$(zoxide query -l | fzf)
    if [ -n "$dir" ]; then
        z "$dir"
        read -p "Enter command: " cmd
        eval "$cmd"
    fi
}
\`\`\`

## fzf 配置

### 自定义 fzf 主题

在 Shell 配置文件中设置 fzf 主题：

\`\`\`bash
# 使用更美观的主题
export FZF_DEFAULT_OPTS='
  --color=fg:#f8f8f2,bg:#282a36,hl:#bd93f9
  --color=fg+:#f8f8f2,bg+:#44475a,hl+:#bd93f9
  --color=info:#ffb86c,prompt:#50fa7b,pointer:#ff79c6
  --color=marker:#ff79c6,spinner:#ffb86c,header:#6272a4
'
\`\`\`

### 自定义预览命令

\`\`\`bash
# 使用 tree 预览目录结构
export FZF_DEFAULT_OPTS="--preview 'tree -C {} | head -20'"
\`\`\`

## 实际应用场景

### 场景 1：快速项目切换

\`\`\`bash
# 快速在多个项目间切换
zp() {
    local dir
    dir=$(zoxide query -l | grep -i project | fzf)
    [ -n "$dir" ] && z "$dir"
}
\`\`\`

### 场景 2：搜索最近访问的目录

\`\`\`bash
# 搜索最近访问的目录
zr() {
    local dir
    dir=$(zoxide query -l | sort -k2 -rn | fzf)
    [ -n "$dir" ] && z "$dir"
}
\`\`\`

### 场景 3：按类型筛选

\`\`\`bash
# 只搜索特定类型的目录
zgit() {
    local dir
    dir=$(zoxide query -l | xargs -I {} sh -c 'test -d {}/.git && echo {}' | fzf)
    [ -n "$dir" ] && z "$dir"
}
\`\`\`

## 性能优化

### 限制搜索结果

限制 fzf 显示的搜索结果数量：

\`\`\`bash
zi() {
    local dir
    dir=$(zoxide query -l | head -50 | fzf)
    [ -n "$dir" ] && z "$dir"
}
\`\`\`

### 异步搜索

对于大型数据库，可以使用异步搜索：

\`\`\`bash
zi() {
    local dir
    dir=$(zoxide query -l | fzf --bind 'change:reload:zoxide query -l {q}') && z "$dir"
}
\`\`\`

## 故障排除

### fzf 未找到

如果提示 \`fzf: command not found\`：

1. 检查 fzf 是否正确安装
2. 确保 fzf 在 PATH 中
3. 重新加载 Shell 配置

### 性能问题

如果集成后速度变慢：

1. 限制搜索结果数量
2. 优化 zoxide 数据库
3. 使用更简单的预览命令

## 最佳实践

1. **合理使用预览**：预览功能会增加开销，根据需要选择
2. **限制结果数量**：对于大型数据库，限制显示数量
3. **自定义主题**：使用符合个人喜好的主题
4. **创建别名**：为常用组合创建简短别名

## 下一步

- [故障排除](/tutorials/troubleshooting)
- [性能优化](/tutorials/performance)
- [高级配置技巧](/tutorials/advanced-config)`,
  },
  {
    slug: 'troubleshooting',
    title: 'zoxide 故障排除',
    excerpt: '解决 zoxide 使用中的常见问题，包括安装问题、配置问题、性能问题等。',
    duration: '20 分钟',
    level: '中级',
    category: '视频 & FAQ',
    date: '2025-11-30',
    content: `# zoxide 故障排除

本教程将帮助你解决 zoxide 使用中的常见问题。

## 安装问题

### 问题 1：命令未找到

**症状**：提示 \`zoxide: command not found\` 或 \`z: command not found\`

**解决方案**：

1. **检查安装**：
   \`\`\`bash
   # 检查 zoxide 是否安装
   which zoxide
   zoxide --version
   \`\`\`

2. **检查 PATH**：
   \`\`\`bash
   # 查看 PATH 环境变量
   echo $PATH
   
   # 如果 zoxide 不在 PATH 中，添加到配置文件
   export PATH="$HOME/.cargo/bin:$PATH"
   \`\`\`

3. **重新安装**：
   \`\`\`bash
   # 使用 Cargo 重新安装
   cargo install --force zoxide
   \`\`\`

### 问题 2：安装失败

**症状**：安装过程中出现错误

**解决方案**：

1. **更新 Rust**：
   \`\`\`bash
   rustup update
   \`\`\`

2. **清理缓存**：
   \`\`\`bash
   cargo clean
   \`\`\`

3. **使用包管理器**：
   \`\`\`bash
   # macOS
   brew install zoxide
   
   # Windows
   scoop install zoxide
   \`\`\`

## 配置问题

### 问题 3：配置不生效

**症状**：添加配置后，zoxide 仍然不工作

**解决方案**：

1. **检查配置文件**：
   \`\`\`bash
   # 检查配置文件是否存在
   cat ~/.zshrc | grep zoxide
   \`\`\`

2. **重新加载 Shell**：
   \`\`\`bash
   # zsh
   source ~/.zshrc
   
   # bash
   source ~/.bashrc
   
   # fish
   source ~/.config/fish/config.fish
   \`\`\`

3. **检查语法错误**：
   \`\`\`bash
   # 测试配置文件语法
   zsh -n ~/.zshrc
   bash -n ~/.bashrc
   \`\`\`

### 问题 4：与其他工具冲突

**症状**：zoxide 与其他工具（如 autojump）冲突

**解决方案**：

1. **卸载冲突工具**：
   \`\`\`bash
   # 卸载 autojump
   brew uninstall autojump
   \`\`\`

2. **使用不同别名**：
   \`\`\`bash
   # 如果必须同时使用，使用不同别名
   alias zj='autojump'
   alias zz='z'
   \`\`\`

## 功能问题

### 问题 5：跳转不准确

**症状**：\`z\` 命令跳转到错误的目录

**解决方案**：

1. **使用交互式选择**：
   \`\`\`bash
   # 使用 zi 查看所有匹配结果
   zi project
   \`\`\`

2. **查看匹配列表**：
   \`\`\`bash
   # 查看所有匹配的目录
   z -l project
   \`\`\`

3. **手动添加目录**：
   \`\`\`bash
   # 手动添加常用目录
   zoxide add /path/to/directory
   \`\`\`

### 问题 6：数据库问题

**症状**：数据库损坏或过大

**解决方案**：

1. **备份并重建**：
   \`\`\`bash
   # 备份旧数据库
   cp ~/.zo ~/.zo.backup
   
   # 删除数据库
   rm ~/.zo
   
   # zoxide 会自动创建新数据库
   \`\`\`

2. **检查数据库大小**：
   \`\`\`bash
   ls -lh ~/.zo
   
   # 如果过大（> 10MB），考虑清理
   \`\`\`

## 性能问题

### 问题 7：启动速度慢

**症状**：Shell 启动变慢

**解决方案**：

1. **延迟初始化**：
   \`\`\`bash
   # zsh - 延迟加载
   zoxide() {
       unfunction zoxide
       eval "$(command zoxide init zsh)"
       zoxide "$@"
   }
   \`\`\`

2. **优化配置顺序**：
   \`\`\`bash
   # 将 zoxide 初始化放在配置文件末尾
   eval "$(zoxide init zsh)"
   \`\`\`

### 问题 8：查询速度慢

**症状**：\`z\` 命令执行缓慢

**解决方案**：

1. **排除不需要的目录**：
   \`\`\`bash
   export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules"
   \`\`\`

2. **限制历史记录**：
   \`\`\`bash
   export _ZO_MAXAGE=1000
   \`\`\`

3. **清理数据库**：
   \`\`\`bash
   rm ~/.zo
   \`\`\`

## 平台特定问题

### 问题 9：Windows 路径问题

**症状**：Windows 上路径处理不正确

**解决方案**：

1. **使用 PowerShell**：
   \`\`\`powershell
   Invoke-Expression (& { (zoxide init powershell | Out-String) })
   \`\`\`

2. **检查路径格式**：
   确保使用正确的路径分隔符。

### 问题 10：macOS 权限问题

**症状**：无法访问某些目录

**解决方案**：

1. **检查权限**：
   \`\`\`bash
   ls -la ~/.zo
   \`\`\`

2. **修复权限**：
   \`\`\`bash
   chmod 644 ~/.zo
   \`\`\`

## 调试技巧

### 启用调试模式

\`\`\`bash
# 查看 zoxide 的调试信息
export _ZO_DEBUG=1
z project
\`\`\`

### 检查数据库内容

\`\`\`bash
# 查看数据库中的目录（需要工具）
# 或者使用 zoxide query 查看
zoxide query -l | head -20
\`\`\`

### 测试配置

\`\`\`bash
# 在新 Shell 中测试
zsh -c "eval \\"\\$(zoxide init zsh)\\"; z --help"
\`\`\`

## 获取帮助

### 官方资源

- **GitHub Issues**：https://github.com/ajeetdsouza/zoxide/issues
- **文档**：https://github.com/ajeetdsouza/zoxide
- **社区讨论**：GitHub Discussions

### 常见问题

查看 [FAQ 页面](/faq) 了解更多常见问题。

## 总结

大多数问题都可以通过以下步骤解决：

1. 检查安装和配置
2. 重新加载 Shell
3. 清理并重建数据库
4. 查看官方文档和 Issues

如果问题仍然存在，可以在 GitHub 上提交 Issue。

## 下一步

- [性能优化](/tutorials/performance)
- [高级配置技巧](/tutorials/advanced-config)
- [常见问题 FAQ](/faq)`,
  },
  {
    slug: 'videos',
    title: 'zoxide 视频教程',
    excerpt: '通过视频学习 zoxide 的使用方法，包括安装、配置和高级技巧。',
    duration: '30 分钟',
    level: '初级',
    category: '视频 & FAQ',
    date: '2025-11-30',
    content: `# zoxide 视频教程

本页面收集了 zoxide 相关的视频教程，帮助你通过视频学习 zoxide 的使用方法。

## 推荐视频

### 1. zoxide 快速入门

**来源**：YouTube

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="zoxide 快速入门"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full aspect-video rounded-lg"
></iframe>

**内容**：
- zoxide 简介
- 安装方法
- 基本使用

### 2. zoxide 高级配置

**来源**：YouTube

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="zoxide 高级配置"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full aspect-video rounded-lg"
</iframe>

**内容**：
- 环境变量配置
- 性能优化
- 自定义别名

### 3. zoxide 与 fzf 集成

**来源**：YouTube

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="zoxide 与 fzf 集成"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full aspect-video rounded-lg"
</iframe>

**内容**：
- fzf 安装
- 集成方法
- 实用技巧

## 视频资源

### YouTube 频道

- [zoxide 官方频道](https://www.youtube.com)（如果有）
- [开发者频道](https://www.youtube.com)

### 其他资源

- GitHub 上的演示视频
- 社区分享的视频教程

## 学习路径

建议按照以下顺序观看视频：

1. **入门**：快速入门视频
2. **进阶**：高级配置视频
3. **高级**：集成和优化视频

## 相关资源

- [快速开始教程](/tutorials/quick-start)
- [基本命令详解](/tutorials/basic-commands)
- [高级配置技巧](/tutorials/advanced-config)

## 贡献视频

如果你有 zoxide 相关的视频教程，欢迎分享！

**注意**：当前视频为占位符，实际部署时需要替换为真实的 YouTube 视频 ID。`,
  },
];

// 根据 slug 获取教程
export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}

// 获取所有教程
export function getAllTutorials(): Tutorial[] {
  return tutorials;
}

// 根据分类获取教程
export function getTutorialsByCategory(category: string): Tutorial[] {
  return tutorials.filter((tutorial) => tutorial.category === category);
}

