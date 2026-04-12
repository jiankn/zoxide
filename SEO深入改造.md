# SEO 深入改造计划（6 个方向）

---

## 一、关键词聚焦度优化

**当前问题：** 很多文章的 `tags` 字段比较随意，没有明确的"主关键词"概念。比如 `stop-using-cd` 的 tags 是 `["zoxide", "command not found", "setup", "fzf", "config"]`，跟文章主题完全不匹配。

**改造方案：**

1. 给 `BlogPost` 接口新增一个 `primaryKeyword` 字段，明确每篇文章的主关键词
2. 重新梳理每篇文章的 tags，确保第一个 tag 就是主关键词
3. 在 `generateMetadata` 中，把 `primaryKeyword` 优先放入 meta keywords 的第一位
4. 确保主关键词出现在以下 4 个位置：title、H1、meta description、正文前 100 字

**涉及文件：**
- `data/blog.ts` — 新增 `primaryKeyword` 字段，逐篇修正 tags
- `app/[locale]/blog/[slug]/page.tsx` — `generateMetadata` 中优先使用 `primaryKeyword`

**具体的关键词映射表（需要逐篇调整）：**

| slug | 当前 tags | 建议主关键词 |
|------|----------|-------------|
| `stop-using-cd` | zoxide, command not found, setup... | `zoxide cd alternative` |
| `zoxide-alias-autocomplete` | alias, autocomplete, fzf... | `zoxide alias autocomplete` |
| `troubleshooting-zoxide-no-match-found` | troubleshooting, database... | `zoxide no match found` |
| `mastering-terminal-navigation-zoxide-guide` | zoxide, how to use... | `how to use zoxide` |
| `advanced-zoxide-techniques` | frecency, workflow... | `zoxide advanced techniques` |
| `quick-start` | 快速开始, 安装, 配置 | `zoxide 快速开始` |
| `advanced-config` | 配置, 高级, 优化 | `zoxide 高级配置` |
| `zoxide-vs-autojump` | 对比, 性能, autojump | `zoxide vs autojump` |
| `zoxide-performance-en` | performance, algorithm, rust | `zoxide performance` |
| `how-zoxide-works-en` | shell, internals, bash, zsh | `how zoxide works` |

---

## 二、H2 标题长尾关键词优化

**当前问题：** H2 标题偏向"可读性"，缺少搜索词。比如 `zoxide-init-guide` 的 H2 "Configuration by Shell" 不包含任何搜索关键词。

**改造方案：**

对有完整 markdown 内容的文章，逐篇优化 H2 标题。原则是：保持可读性的同时，嵌入长尾搜索词。

**涉及文件：**
- `data/blog.ts` — 修改文章 content 中的 H2 标题
- `messages/en.json`、`messages/zh.json`、`messages/ja.json` — 修改翻译文件中对应的 H2 内容

**以 `zoxide-init-guide` 为例：**

| 当前 H2 | 优化后 H2 |
|---------|----------|
| What Does `zoxide init` Actually Do? | What Does `zoxide init` Do? How Shell Integration Works |
| Configuration by Shell | How to Configure zoxide init for Bash, Zsh, Fish and PowerShell |
| Advanced: Replacing `cd` with zoxide | Replace cd with zoxide: Using the --cmd Flag |
| Performance Tuning: Lazy Loading | zoxide init Performance: Lazy Loading for Faster Shell Startup |
| Troubleshooting Common init Errors | Fix "command not found: z" and Other zoxide init Errors |

**以 `zoxide-fzf-interactive-guide-en` 为例：**

| 当前 H2 | 优化后 H2 |
|---------|----------|
| What is zoxide? (And Why It's Better Than `cd`) | What is zoxide? A Smarter cd Alternative |
| What is fzf? The Command-Line's Fuzzy Search Hero | What is fzf? Fuzzy Finder for the Command Line |
| The Magic Combo: Setting Up zoxide with fzf | How to Set Up zoxide with fzf: Step-by-Step |
| How to Use Your New Superpower: The `zi` Command | How to Use `zi`: Interactive Directory Jumping with fzf |
| Pro-Tips for Maximum Productivity | zoxide fzf Tips: Aliases, Exclusions and Workflows |

其他文章同理，每篇都需要逐一审查 H2。

---

## 三、Slug 策略统一

**当前问题：** 中文文章用拼音 slug（`mac-anzhuang-zoxide-init-autocomplete`），日文文章用罗马字 slug（`zoxide-toha-cd-no-kawari`），对 Google 没有语义价值。

**改造方案：**

把所有拼音/罗马字 slug 改为英文 slug。由于改 slug 等于改 URL，需要做 301 重定向。

**涉及文件：**
- `data/blog.ts` — 修改 slug 和 alternateSlugs
- `middleware.ts` 或 `next.config.ts` — 添加旧 URL 到新 URL 的 301 重定向

**具体映射：**

| 当前 slug | 新 slug | 语言 |
|-----------|---------|------|
| `zoxide-shi-shenme-z-mingling-tidai-cd` | `what-is-zoxide-smarter-cd-zh` | zh |
| `zoxide-toha-cd-no-kawari` | `what-is-zoxide-smarter-cd-ja` | ja |
| `mac-anzhuang-zoxide-init-autocomplete` | `install-zoxide-mac-shell-integration-zh` | zh |
| `mac-ni-zoxide-install-init-completion` | `install-zoxide-mac-shell-integration-ja` | ja |
| `zoxide-tidai-autojump-z-fasd-zlua` | `zoxide-alternatives-comparison-zh` | zh |
| `zoxide-daitai-autojump-z-fasd-zlua` | `zoxide-alternatives-comparison-ja` | ja |

**重定向规则示例（在 `next.config.ts` 的 `redirects` 中）：**

```typescript
async redirects() {
  return [
    {
      source: '/zh/blog/zoxide-shi-shenme-z-mingling-tidai-cd/',
      destination: '/zh/blog/what-is-zoxide-smarter-cd-zh/',
      permanent: true, // 301
    },
    // ... 其他映射
  ];
}
```

---

## 四、正文内链策略

**当前问题：** 大部分文章的正文内部没有指向站内其他页面的链接。目前只有少数几篇有内链（`quick-start` 链接到 `/tutorials/advanced-config`，`zoxide-vs-autojump` 链接到 `/comparisons`）。

**改造方案：**

1. 建立一个"内链矩阵"，定义哪些文章之间应该互相链接
2. 在每篇文章的正文中，在自然语境下插入 2-4 个站内链接
3. 链接锚文本要包含目标页面的主关键词

**涉及文件：**
- `data/blog.ts` — 在文章 content 的 markdown 中添加内链
- `messages/*.json` — 在翻译内容中添加对应的内链

**内链矩阵（核心关联）：**

| 文章 | 应链接到 |
|------|---------|
| `zoxide-init-guide` | `zoxide-command-not-found`, `zoxide-commands`, `quick-start` |
| `zoxide-fzf-interactive-guide-en` | `zoxide-commands`, `zoxide-init-guide`, `what-is-zoxide-smarter-cd` |
| `zoxide-command-not-found` | `zoxide-init-guide`, `zoxide-download-guide`, `zoxide-not-working` |
| `zoxide-not-working` | `zoxide-command-not-found`, `zoxide-init-guide`, `troubleshooting-zoxide-no-match-found` |
| `what-is-zoxide-smarter-cd` | `quick-start`, `zoxide-vs-autojump`, `zoxide-fzf-interactive-guide-en` |
| `zoxide-commands` | `zoxide-init-guide`, `advanced-zoxide-techniques`, `zoxide-fzf-interactive-guide-en` |
| `zoxide-download-guide` | `zoxide-init-guide`, `zoxide-command-not-found`, `quick-start` |
| `stop-using-cd` | `what-is-zoxide-smarter-cd`, `zoxide-commands`, `zoxide-vs-autojump` |
| `zoxide-vs-autojump` | `zoxide-alternatives-comparison-open-source`, `zoxide-performance-en`, `what-is-zoxide-smarter-cd` |
| `advanced-zoxide-techniques` | `zoxide-commands`, `zoxide-init-guide`, `how-zoxide-works-en` |

**插入方式示例（在 `zoxide-init-guide` 正文中）：**

```markdown
If you haven't installed zoxide yet, check out our [zoxide download guide](/blog/zoxide-download-guide/) first.
```

---

## 五、首页 H1 关键词确认与优化

**当前状态：** Hero 组件的 H1 内容来自翻译文件 `home.title` + `home.subtitle`：
- 英文：`zoxide - A smarter cd command` + `Navigate directories 10x faster`
- 这个 H1 包含了核心关键词 "zoxide" 和 "smarter cd command"，基本没问题

**改造方案（微调）：**

1. 英文 H1 subtitle 可以优化为包含更多搜索词，比如 `Install & navigate directories 10x faster`，自然地加入 "install" 这个高搜索量词
2. 中文 H1 确认包含"智能 cd 命令"或"cd 替代工具"
3. 首页 description 已经很好了，不需要改

**涉及文件：**
- `messages/en.json` — 微调 `home.subtitle`
- `messages/zh.json` — 确认 `home.title` 和 `home.subtitle` 包含核心中文关键词
- `messages/ja.json` — 同上

---

## 六、各页面 Meta Description 差异化

**当前问题：** 部分页面的 description 比较泛化，需要确保每个页面的 description 是独特的、包含该页面主关键词的。

**改造方案：**

逐页审查并优化 description，确保：
- 每个 description 独一无二，不与其他页面重复
- 长度控制在 150-160 字符
- 包含该页面的主关键词
- 包含行动号召（CTA）或价值主张

**涉及文件：**
- `messages/en.json`、`messages/zh.json`、`messages/ja.json` — 修改各页面的 description

**具体优化建议：**

| 页面 | 当前 description 问题 | 优化方向 |
|------|---------------------|---------|
| features | "Learn about zoxide's core features..." 太泛 | "zoxide features: blazing Rust performance, frecency-based smart ranking, fuzzy directory search, and shell integration for Bash, Zsh, Fish & PowerShell." |
| comparisons | "Compare the differences between zoxide and other tools..." 太泛 | "zoxide vs autojump vs z vs fasd: side-by-side comparison of speed, features, and shell support. Find the best cd replacement for your workflow." |
| faq | "Common questions and solutions..." 太泛 | "Answers to common zoxide questions: fix 'command not found', configure shell integration, manage the database, and troubleshoot matching issues." |
| changelog | "View zoxide's version update history..." 太泛 | "zoxide changelog: latest releases, new features, bug fixes, and breaking changes. Stay updated with zoxide version history." |
| tutorials | "From quick start to advanced..." 太泛 | "Step-by-step zoxide tutorials: install on Ubuntu/macOS/Windows, configure Bash/Zsh/Fish, integrate fzf, and master advanced navigation workflows." |

---

## 执行优先级建议

1. **第一优先：** 改造一（关键词聚焦）+ 改造二（H2 优化）— 这是"一个页面一个主关键词"策略的核心落地，对排名影响最直接
2. **第二优先：** 改造四（内链）+ 改造六（description 差异化）— 提升页面间的权重传递和点击率
3. **第三优先：** 改造三（slug 统一）— 需要做 301 重定向，有一定风险，建议在 Google Search Console 确认旧 URL 的流量后再决定是否改
4. **第四优先：** 改造五（首页 H1）— 当前已经不错，微调即可
