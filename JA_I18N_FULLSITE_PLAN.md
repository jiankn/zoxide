# zoxide.org 三语（EN / ZH / JA）一次性上线改造计划（给 Antigravity IDE）

> 目标：把当前项目从 **中/英双语**升级为 **中/英/日三语完整站**。  
> **切换到 Japanese 后，全站任何可见文字 + SEO + 结构化数据 + 搜索结果** 都必须是日语环境，并且改完即可直接部署上线（不留“后续再补”）。

---

## 1. 项目现状（你现在的代码是这样工作的）

- 路由：`app/[locale]/...`（Next.js App Router）
- 国际化：`next-intl`
  - 语言列表：`i18n/routing.ts`
  - 翻译资源：`messages/en.json`、`messages/zh.json`
- 内容：
  - **Blog**：主要来自 `data/blog.ts`，但标题/摘要/正文在部分 slug 上会被 `messages/*` 覆盖（`blog.data.<slug>`）
  - **Tutorials**：主要来自 `data/tutorials.ts`，但正文会被 `messages/*` 覆盖（`tutorials.data.<slug>`）
- SEO：
  - `lib/seo/metadata.ts` 统一生成 canonical + hreflang（会跟随 `routing.locales`）
  - `app/sitemap.ts` 生成 sitemap（目前对 blog 的 locale 过滤需要加强，否则会生成 404 URL）
- 搜索：
  - `app/api/search/route.ts` 会按 `locale` 动态导入 `@/messages/${locale}.json` 并构建索引

---

## 2. Definition of Done（什么叫“一步到位”）

✅ 当访问 `/ja/...` 时：

1. **页面任何可见文本**都是日语（导航/按钮/正文/占位符/提示/页脚/ Cookie banner / 404 / 搜索弹窗 / 分享区域…）
2. **Blog + Tutorials 的正文内容**全量日语（Markdown 保留结构、代码块原样、链接/表格不损坏）
3. SEO 完整：
   - title/description/keywords 为日语
   - canonical 指向 `/ja/...` 自己
   - hreflang 同时指向 `en/zh/ja` 对应页面（blog 需要正确 slug 映射）
   - OpenGraph locale 为 `ja_JP`
   - JSON-LD（Article/HowTo/FAQ/Breadcrumb/Organization）内容是日语
4. sitemap 不生成 404 URL（尤其是 blog：只生成该文章真实存在的语言版本）
5. `npm run build` 通过；`/en /zh /ja` 三语互切不掉链

---

## 3. Blog / Tutorials 清点（SEO 核心资产清单）

### 3.1 Blog 现有文章清单（来自 `data/blog.ts`，共 19 篇）

> 说明：
> - `has_messages_en/zh` 表示该 slug 在 `messages/en.json` / `messages/zh.json` 是否存在可覆盖的翻译数据（`blog.data.<slug>`）
> - `content_source` 表示正文目前来自哪里
> - `needs_ja` 给出日语落库策略（你要“一步到位”，日语必须全覆盖）

| slug                                       | data.locales   | has_messages_en   | has_messages_zh   | content_source                        | needs_ja                               |
|:-------------------------------------------|:---------------|:------------------|:------------------|:--------------------------------------|:---------------------------------------|
| zoxide-linux-en                            | en             | Y                 |                   | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |
| zoxide-linux-zh                            | zh             |                   | Y                 | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |
| quick-start                                |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| advanced-config                            |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-vs-autojump                         |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-command-not-found                   |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-not-working                         |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| stop-using-cd                              |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-alias-autocomplete                  |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| troubleshooting-zoxide-no-match-found      |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| mastering-terminal-navigation-zoxide-guide |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| advanced-zoxide-techniques                 |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-commands                            |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-download-guide                      |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-init-guide                          |                | Y                 | Y                 | messages/* (blog.data.<slug>.content) | Translate + add to messages/ja.json    |
| zoxide-performance-en                      | en             | Y                 |                   | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |
| zoxide-performance-zh                      | zh             |                   | Y                 | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |
| how-zoxide-works-en                        | en             | Y                 |                   | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |
| how-zoxide-works-zh                        | zh             |                   | Y                 | messages/* (blog.data.<slug>.content) | Handled via new -ja slug + alt mapping |

### 3.2 Blog 的 3 个“多 slug 支柱文章”（需要新增 `-ja` slug）

这些文章目前是 **en/zh 各一条 slug**（例如 `...-en` vs `...-zh`），语言切换靠 `alternateSlug` 两两跳转。  
要加入日语，并保证三语互切不掉链，必须新增第三条 `...-ja`。

| topic                 | en_slug               | zh_slug               | ja_slug               |
|:----------------------|:----------------------|:----------------------|:----------------------|
| Linux guide           | zoxide-linux-en       | zoxide-linux-zh       | zoxide-linux-ja       |
| Performance deep dive | zoxide-performance-en | zoxide-performance-zh | zoxide-performance-ja |
| How zoxide works      | how-zoxide-works-en   | how-zoxide-works-zh   | how-zoxide-works-ja   |

### 3.3 Tutorials 现有教程清单（来自 `data/tutorials.ts`，共 12 篇）

> 日语版本必须在 `messages/ja.json -> tutorials.data.<slug>.content` 提供完整正文，避免回退到 data 文件里的中/英文内容。

| slug               | category(data)   | has_messages_en   | en_has_content   | has_messages_zh   | zh_has_content   | needs_ja                                                                      |
|:-------------------|:-----------------|:------------------|:-----------------|:------------------|:-----------------|:------------------------------------------------------------------------------|
| quick-start        | 入门教程         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| basic-commands     | 入门教程         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| shell-setup        | 入门教程         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| advanced-config    | 进阶技巧         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| performance        | 进阶技巧         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| fzf-integration    | 进阶技巧         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| troubleshooting    | 视频 & FAQ       | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| videos             | 视频 & FAQ       | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| install-ubuntu     | 安装指南         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| install-macos      | 安装指南         | Y                 | Y                | Y                 |                  | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| install-windows    | 安装指南         | Y                 | Y                | Y                 | Y                | Translate title/excerpt/category/duration/level/content into messages/ja.json |
| install-arch-nixos | 安装指南         | Y                 | Y                | Y                 | Y                | Translate title/excerpt/category/duration/level/content into messages/ja.json |

---

## 4. SEO 关键词：英文 → 日语映射（落到 `messages/ja.json -> seo.*`）

> 要求：不是直译，而是“日本用户会搜的说法”，同时保留品牌词 `zoxide`。  
> 你可以直接把右侧日语词条拼成逗号分隔字符串，写回 `messages/ja.json` 对应字段。

### SEO 키워드映射：`seo.main`

| en_term                          | ja_term                                                  |
|:---------------------------------|:---------------------------------------------------------|
| zoxide install                   | zoxide インストール                                      |
| zoxide install Ubuntu            | zoxide Ubuntu インストール                               |
| zoxide command not found         | zoxide コマンドが見つからない (command not found)        |
| zoxide nvim                      | zoxide nvim / zoxide Neovim 連携                         |
| zoxide download                  | zoxide ダウンロード                                      |
| fzf zoxide                       | zoxide fzf 連携 (fzf zoxide)                             |
| brew zoxide                      | brew zoxide (Homebrew)                                   |
| command zoxide not found         | zoxide コマンドが見つからない (command zoxide not found) |
| autojump                         | autojump                                                 |
| smart cd command                 | スマート cd コマンド                                     |
| cd alternative                   | cd 代替 / cd コマンド 代替                               |
| zoxide tutorial                  | zoxide チュートリアル                                    |
| how to use zoxide                | zoxide 使い方                                            |
| How to install Zoxide on Linux   | Zoxide Linux インストール方法                            |
| How to install Zoxide on Windows | Zoxide Windows インストール方法                          |
| How to install Zoxide on macOS   | Zoxide macOS インストール方法                            |

### SEO 키워드映射：`seo.install`

| en_term                          | ja_term                          |
|:---------------------------------|:---------------------------------|
| zoxide install                   | zoxide インストール              |
| zoxide install Ubuntu            | zoxide Ubuntu インストール       |
| how to install zoxide            | zoxide インストール方法          |
| How to install Zoxide on Linux   | Zoxide Linux インストール方法    |
| How to install Zoxide on Windows | Zoxide Windows インストール方法  |
| How to install Zoxide on macOS   | Zoxide macOS インストール方法    |
| zoxide installation guide        | zoxide インストールガイド        |
| install zoxide on ubuntu         | Ubuntu に zoxide をインストール  |
| install zoxide on mac            | Mac に zoxide をインストール     |
| install zoxide on windows        | Windows に zoxide をインストール |
| brew zoxide                      | brew zoxide (Homebrew)           |
| zoxide download                  | zoxide ダウンロード              |

### SEO 키워드映射：`seo.features`

| en_term             | ja_term               |
|:--------------------|:----------------------|
| zoxide features     | zoxide 機能           |
| zoxide capabilities | zoxide できること     |
| smart cd command    | スマート cd コマンド  |
| zoxide performance  | zoxide パフォーマンス |
| best cd replacement | 最適な cd 代替ツール  |

### SEO 키워드映射：`seo.tutorial`

| en_term                  | ja_term                        |
|:-------------------------|:-------------------------------|
| zoxide tutorial          | zoxide チュートリアル          |
| zoxide quick start       | zoxide クイックスタート        |
| how to use zoxide        | zoxide 使い方                  |
| zoxide setup guide       | zoxide セットアップガイド      |
| zoxide configuration     | zoxide 設定                    |
| zoxide shell integration | zoxide シェル統合 / シェル連携 |

### SEO 키워드映射：`seo.comparison`

| en_term                  | ja_term                     |
|:-------------------------|:----------------------------|
| zoxide vs autojump       | zoxide vs autojump          |
| zoxide vs z              | zoxide vs z                 |
| zoxide vs fasd           | zoxide vs fasd              |
| best cd replacement tool | cd 代替ツール 比較 (ベスト) |

### SEO 키워드映射：`seo.blog`

| en_term         | ja_term               |
|:----------------|:----------------------|
| zoxide blog     | zoxide ブログ         |
| zoxide tutorial | zoxide チュートリアル |
| zoxide tips     | zoxide ヒント / Tips  |
| zoxide news     | zoxide ニュース       |

### SEO 키워드映射：`seo.faq`

| en_term                | ja_term                       |
|:-----------------------|:------------------------------|
| zoxide faq             | zoxide FAQ                    |
| zoxide common issues   | zoxide よくある問題           |
| zoxide troubleshooting | zoxide トラブルシューティング |
| zoxide problems        | zoxide 問題                   |

### SEO 키워드映射：`seo.changelog`

| en_term                | ja_term                     |
|:-----------------------|:----------------------------|
| zoxide changelog       | zoxide 変更履歴 (changelog) |
| zoxide updates         | zoxide アップデート         |
| zoxide new features    | zoxide 新機能               |
| zoxide version history | zoxide バージョン履歴       |

### SEO 키워드映射：`seo.video`

| en_term               | ja_term                   |
|:----------------------|:--------------------------|
| zoxide video tutorial | zoxide 動画チュートリアル |
| zoxide youtube        | zoxide YouTube            |

### SEO 키워드映射：`seo.legal`

| en_term          | ja_term              |
|:-----------------|:---------------------|
| privacy policy   | プライバシーポリシー |
| terms of service | 利用規約             |
| about us         | 私たちについて       |


---

## 5. 工程改造路线（按顺序执行；每步都能单独 `npm run build` 验证）

> 下面每个 Phase 我都给了 **“Antigravity IDE 任务指令”**（可直接复制粘贴），以及“验收点”。

---

### Phase 0：创建分支 + 基线自检（防止改着改着找不到锅）

**PowerShell：**
```powershell
git checkout -b feat/ja-locale
npm install
npm run build
npm run lint
```

**验收：** build/lint 全绿。

---

### Phase 1：接入 `ja` locale（先让 `/ja/*` 跑起来）

**改动点：**
- `i18n/routing.ts`：`locales` 加入 `ja`
- 新建 `messages/ja.json`（先复制 `messages/en.json`，保持 key 结构一致）

**Antigravity 指令：**
1. 修改 `i18n/routing.ts`，把 locales 从 `['zh','en']` 改成 `['zh','en','ja']`。
2. 新建 `messages/ja.json`，先复制 `messages/en.json` 的完整内容（仅复制，先不翻译也行，但结构必须完整）。
3. 运行 `npm run build`，确保项目能静态生成 `ja` 路由。

**验收：**
- `/ja/` 能访问（哪怕文案先是英文占位）
- `npm run build` 通过

---

### Phase 2：把所有“只写了 zh/en 二分逻辑”的地方升级为三语（关键，不然一定漏）

必须改掉的典型写法：`locale === 'zh' ? ... : ...`（加入 ja 后会默认落到英文或中文，直接漏翻）。

#### 2.1 导航语言切换器（`components/Navigation/Navigation.tsx`）
- 语言标签改为映射：`zh->中文, en->English, ja->日本語`
- 所有 “Language / 中文 / English” 等硬编码改为 `messages.common` 或 `messages.navigation` 的翻译 key

#### 2.2 搜索弹窗（`components/Search/Search.tsx`）
- `isI18nPath()` / `getLocaleFromPathname()` 必须识别 `/ja/`
- 搜索 UI 文案全走翻译（placeholder/loading/no results…）
- 语言标签显示支持 “日本語”

#### 2.3 Blog 列表/详情页的 locale 类型 & 过滤
- `app/[locale]/blog/page.tsx` 和 `app/[locale]/blog/[slug]/page.tsx`：
  - 所有 `locale as 'zh' | 'en'` 改为 `locale as 'zh' | 'en' | 'ja'`
  - 文章语言过滤（`post.locales.includes(...)`）也要支持 ja

**Antigravity 指令：**
- 全局搜索并修复：
  - `as 'zh' | 'en'`
  - `locale === 'zh' ?`
  - `'/zh/'`、`'/en/'`
  - `'中文'`、`'English'`

**验收：**
- `/ja/` 访问时，任何地方不应该再被“二分逻辑”默认落到中/英（下一 Phase 才会翻译内容）

---

### Phase 3：Blog 三语互切（核心：新增 `alternateSlugs`，支持 en/zh/ja 三向映射）

#### 3.1 升级 blog 数据模型（`data/blog.ts`）
把：
- `alternateSlug?: string`
升级为：
- `alternateSlugs?: Partial<Record<'en'|'zh'|'ja', string>>`

并提供函数：
- `getAlternateSlug(slug, targetLocale)`：返回对应 locale 的 slug（找不到就返回原 slug）

#### 3.2 新增 3 篇日语支柱文章（`-ja` slug）
在 `data/blog.ts` 追加三条新 blogPosts：
- `zoxide-linux-ja`
- `zoxide-performance-ja`
- `how-zoxide-works-ja`

并且三语互相指向：
```ts
alternateSlugs: {
  en: '...-en',
  zh: '...-zh',
  ja: '...-ja'
}
locales: ['ja']
```

#### 3.3 更新 `/api/alternate-slug` 支持 ja
- `targetLocale` 支持 `'ja'`
- 返回值从旧的 `alternateSlug` 迁移到 `alternateSlugs[targetLocale]`

#### 3.4 修复 Blog metadata 的关键词来源（非常重要）
现在 blog 的 metadata keywords 用的是 `post.tags.join(', ')`（可能是中文 tags）。  
必须改成 **使用翻译后的 tags**：
- 详情页：用 `tags` 变量（`tData?.tags || post.tags`）
- 列表页：同理

否则 `/ja/blog/...` 的 keywords 可能还是中文/英文，影响 SEO。

**验收：**
- 在任意 blog 详情页 `/en/blog/...` 切换到 Japanese，会跳转到正确 `/ja/blog/<对应slug>`
- `/ja/blog/<slug>` 的 title/desc/keywords 都是日语（下一 Phase 才会填充正文）

---

### Phase 4：把 Blog 正文“全量日语化”（落库规则不允许漏）

#### 4.1 对“共享 slug 的 13 篇文章”
日语正文落到：
- `messages/ja.json -> blog.data.<slug>.content`
同时补齐：
- `title` / `excerpt` / `category` / `author` / `tags`

> 提示：你可以以 `messages/en.json -> blog.data.<slug>` 为英文源文本，把它整段翻译到日语。

#### 4.2 对 3 篇 `-ja` 新增支柱文章
日语正文落到（两种选一，但建议双保险）：
- ✅ 主存：`data/blog.ts` 新对象的 `title/excerpt/content/tags`
- ✅ 同步存：`messages/ja.json -> blog.data.<slug>`（保证搜索/SEO/覆盖逻辑一致）

**硬性要求（翻译规则）：**
- Markdown 结构不改（标题层级、列表、表格、引用）
- 代码块（```）内容一字不改
- 命令、参数、文件路径保持英文
- 外部链接不丢失
- 专有名词保留：zoxide / fzf / Neovim / PowerShell / Homebrew / Scoop / Bash / Zsh / Fish

**验收：**
- `/ja/blog` 列表所有文章标题/摘要/分类为日语
- 打开每篇文章正文：无中文/英文漏出（除代码块/命令名）

---

### Phase 5：把 Tutorials 正文“全量日语化”（12 篇全覆盖）

日语正文全部落到：
- `messages/ja.json -> tutorials.data.<slug>.content`

并补齐：
- `title` / `excerpt` / `category` / `level` / `duration`

**特别注意：**
- tutorials 页使用分类 key：`tutorials.categories.beginner / install / advanced / video`  
  日语必须在 `messages/ja.json` 有完整翻译，否则分类显示会漏。

**验收：**
- `/ja/tutorials`：所有卡片标题/摘要/分类为日语
- 打开任意 tutorial 详情：正文全日语

---

### Phase 6：修 sitemap（避免 ja 版本生成不存在的 URL）

**文件：`app/sitemap.ts`**

改造规则：
- Blog：
  - 若某 post 有 `locales` 限制：只生成这些语言版本
  - 否则：生成 en/zh/ja 全部版本
- 对 3 个支柱文章：en/zh/ja 三条都真实存在，应全部生成

**验收：**
- sitemap 里不应出现明显 404：
  - 例如 `/ja/blog/zoxide-linux-en` 这种（en-only slug 不应生成 ja）
- `npm run build` 通过

---

### Phase 7：SEO 全量日语化（标题/描述/关键词/OG/JSON-LD）

#### 7.1 `messages/ja.json -> seo.*` 写入日语关键词（基于第 4 章映射）
- `seo.main/install/features/tutorial/comparison/blog/faq/changelog/video/legal`
- `seo.titles.*` 全量翻译（home/features/download/tutorials/blog/blogPost/faq/changelog/comparisons/about/privacy/terms）

#### 7.2 JSON-LD（结构化数据）必须跟随语言
- `lib/seo/schema.ts` 的 Organization description 现在是固定中文 → 改为从 `messages` 按 locale 取值（新增 key：`seo.organizationDescription`）
- Blog 详情页中 HowTo schema 的 step 文案目前是英文写死 → 改为从 `messages/blog.detail` 读取对应日语 step 文案（避免 schema 漏英）

**验收：**
- View Source 检查 `/ja/...`：title/description/keywords/JSON-LD 都是日语
- OG locale 正确：`ja_JP`

---

### Phase 8：质量门禁（防“漏翻”最关键）

新增脚本：`scripts/check-i18n-keys.mjs`  
目的：确保 **en.json 与 ja.json key 集合一致**（缺 key 直接失败）。

建议脚本功能：
1. 扁平化 key 路径，比较差集
2. 若 ja 缺 key 或多 key：`process.exit(1)`

`package.json` 加：
```json
"scripts": {
  "check:i18n": "node scripts/check-i18n-keys.mjs"
}
```

**CI/本地验收：**
```powershell
npm run check:i18n
npm run lint
npm run build
```

---

## 6. 最终上线前“人工验收清单”（必须逐条勾）

### 6.1 UI 全站
- [ ] `/ja/` 导航/按钮/页脚/搜索/分享区全日语
- [ ] Cookie banner 全日语
- [ ] 404 全日语
- [ ] 搜索弹窗占位符/空状态全日语

### 6.2 Blog（SEO 核心）
- [ ] `/ja/blog` 列表标题/摘要/分类/日期显示为日语
- [ ] 每篇 blog 正文全日语（除代码块）
- [ ] 从 `/en/blog/<slug>` 切到 Japanese，落到正确 `/ja/blog/<对应slug>`
- [ ] View Source：title/desc/keywords/JSON-LD 为日语

### 6.3 Tutorials（SEO 核心）
- [ ] `/ja/tutorials` 全日语
- [ ] 每个 tutorial 正文全日语
- [ ] tutorial metadata title/description 为日语

### 6.4 SEO
- [ ] sitemap 不包含明显 404 URL（尤其 blog 的 en-only/zh-only slug）
- [ ] hreflang 三语互指正确
- [ ] canonical 自引用

---

## 7. 交付物（你最终会得到什么）

- ✅ 三语全站：`en/zh/ja`
- ✅ Blog/Tutorials 正文日语化（SEO 主资产完成）
- ✅ SEO 关键词/标题/描述/结构化数据全日语化
- ✅ sitemap + hreflang 正确
- ✅ i18n key parity 检查脚本（防漏翻）

---

## 8. 直接给 Antigravity IDE 的“执行顺序提示词”（逐条喂，不要合并）

1. **加 ja locale + 新建 messages/ja.json（复制 en.json）**
2. **修所有 zh/en 二分逻辑为三语（导航/搜索/blog/tutorial）**
3. **升级 blog 数据模型为 alternateSlugs，并新增 3 篇 -ja 支柱文章**
4. **把 Blog 正文 16 篇（日语版）全部落库（messages/ja + data/blog.ts）**
5. **把 Tutorials 12 篇（日语版）全部落库（messages/ja）**
6. **修 sitemap 的 blog locale 过滤，避免 404 URL**
7. **补齐 SEO（seo.* + titles.* + JSON-LD 本地化）**
8. **加 check:i18n 脚本，跑 lint/build/check**

> 每一步完成后都要跑：`npm run build`。有报错就先修完再进入下一步。

---
