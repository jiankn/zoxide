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

