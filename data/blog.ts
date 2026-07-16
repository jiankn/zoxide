// 博客文章数据类型
export interface BlogPost {
  id: string;
  slug: string;
  // 可选：限定文章展示的语言（不填则在所有语言显示）
  locales?: ("zh" | "en" | "ja")[];
  // 可选：配对的其他语言版本的 slug（用于语言切换）
  alternateSlugs?: Partial<Record<"en" | "zh" | "ja", string>>;
  title: string;
  excerpt: string;
  content: string; // Markdown 格式
  date: string;
  author: string;
  category: string;
  // SEO 主关键词：每篇文章的核心搜索词，优先用于 meta keywords 第一位
  primaryKeyword?: string;
  tags: string[];
  readTime: number; // 阅读时长（分钟）
}

// 博客文章数据
export const blogPosts: BlogPost[] = [
  {
    id: "17",
    slug: "zoxide-fzf-interactive-guide-en",
    locales: ["en"],
    alternateSlugs: {
      zh: "zoxide-fzf-interactive-guide-zh",
      ja: "zoxide-fzf-interactive-guide-ja",
    },
    title:
      "Supercharge Your Terminal: The Ultimate Guide to zoxide and fzf for Interactive Directory Jumping",
    excerpt:
      "Unlock lightning-fast terminal navigation by combining zoxide and fzf. This guide shows you how to set up and use zoxide with fzf for an interactive, fuzzy search experience that will change the way you use the command line.",
    content: `# Supercharge Your Terminal: The Ultimate Guide to zoxide and fzf for Interactive Directory Jumping

Tired of typing \`cd ../../..\` or hitting \`Tab\` a dozen times to navigate your filesystem? We've all been there. The command line is powerful, but navigating it can feel clumsy and repetitive. What if you could jump to any frequently used directory in seconds, even if you only remember part of its name?

Enter the power couple of terminal productivity: **zoxide and fzf**. Zoxide is a "smart" directory jumper that remembers your habits, and fzf is a lightning-fast fuzzy finder. When you combine them, you get an interactive, fuzzy-search-powered navigation system that feels like magic. This guide will show you exactly how to set up and master the zoxide fzf workflow.

## What is zoxide? A Smarter cd Alternative

At its core, **zoxide** is a blazing-fast replacement for the \`cd\` command. Instead of manually typing out paths, you simply pass \`zoxide\` a few characters from the directory name you're thinking of. New to zoxide? Read our [introduction to what zoxide is and how it works](/blog/what-is-zoxide-smarter-cd/).

How does it work? Zoxide runs in the background, tracking the directories you visit most often. It uses a clever algorithm called "frecency"—a combination of **fre**quency and **recency**—to rank your directories. When you type \`z my-project\`, it instantly jumps to the most "frecent" directory matching \`my-project\`. It learns as you work, getting smarter and more accurate over time.

Written in Rust, it’s incredibly lightweight and won’t slow down your shell’s startup time.

## What is fzf? Fuzzy Finder for the Command Line

**fzf** is a general-purpose command-line fuzzy finder. If you've never used a fuzzy finder, prepare to be amazed. It allows you to filter through long lists of items (files, command history, git commits, and more) by typing just a few characters.

Unlike a strict search, fzf’s "fuzzy" matching doesn't require you to type consecutive characters. For example, to find a file named \`authentication_controller.rb\`, you could simply type \`authconrb\` and fzf would find it instantly. It's an indispensable tool for anyone who spends significant time in the terminal.

## How to Set Up zoxide with fzf: Step-by-Step

This is where the real power is unleashed. By default, if \`zoxide\` finds multiple matches for your query, it will just jump to the highest-ranked one. But when you integrate it with fzf, zoxide will instead open an interactive menu, allowing you to choose the exact directory you want.

Here’s how to set it up.

**Step 1: Install zoxide and fzf**

The easiest way to install both is with a package manager.

*   **macOS (Homebrew):**
    \`\`\`bash
    brew install zoxide fzf
    \`\`\`

*   **Windows (Scoop or Winget):**
    \`\`\`powershell
    # Using Scoop
    scoop install zoxide fzf

    # Or using Winget
    winget install ajeetdsouza.zoxide fzf
    \`\`\`

*   **Linux (using your distro's package manager):**
    Check the official zoxide and fzf installation guides, as package names may vary. For example, on Arch Linux:
    \`\`\`bash
    pacman -S zoxide fzf
    \`\`\`

**Step 2: Configure Your Shell**

Now, add one line to your shell's configuration file to initialize zoxide and enable the fzf integration automatically.

*   **For Bash or Zsh (\`~/.bashrc\` or \`~/.zshrc\`):**
    \`\`\`bash
    eval "$(zoxide init bash)"
    \`\`\`
    *(Note: For Zsh, you can also use \`eval "$(zoxide init zsh)"\`)*

*   **For Fish (\`~/.config/fish/config.fish\`):**
    \`\`\`fish
    zoxide init fish | source
    \`\`\`

*   **For PowerShell (\`$PROFILE\`):**
    \`\`\`powershell
    Invoke-Expression (& { (zoxide init powershell | Out-String) })
    \`\`\`

After saving the file, restart your shell or source the config file (e.g., \`source ~/.zshrc\`). That's it! If fzf is installed, zoxide will automatically use it for interactive selection. For a deeper look at shell configuration options, see our [comprehensive zoxide init guide](/blog/zoxide-init-guide/).

## How to Use \`zi\`: Interactive Directory Jumping with fzf

With the setup complete, you now have access to the interactive \`zi\` command.

Simply type \`zi\` in your terminal and press Enter.

An fzf-powered menu will pop up, listing all the directories zoxide knows about, ranked by "frecency".

Now you can:
1.  **Start typing:** Type a few characters from the directory you want. The list will filter in real-time.
2.  **Use arrow keys:** Move up and down to select the correct directory.
3.  **Press Enter:** You'll be instantly transported to your chosen destination.

This workflow is incredibly fast and intuitive. It turns a multi-step navigation process into a seamless, two-second action.

## zoxide fzf Tips: Aliases, Exclusions and Workflows

To make the experience even smoother, consider adding these aliases to your shell configuration file:

\`\`\`bash
# For Bash/Zsh
alias j="z"
alias jj="zi"
\`\`\`

\`\`\`fish
# For Fish
alias j "z"
alias jj "zi"
\`\`\`

Now you can use \`j project\` for a quick jump and \`jj\` for an interactive search. This simple aliasing scheme is a popular convention and saves valuable keystrokes.

If you ever want to clean up your database, you can use \`zoxide remove /path/to/directory\` to forget a specific entry.

## Conclusion: Never Type a Full Path Again

Combining zoxide and fzf is more than just a small tweak to your workflow; it's a fundamental upgrade to your command-line experience. It reduces the mental overhead of remembering paths, minimizes keystrokes, and ultimately saves you time and frustration.

By leveraging the intelligent history of zoxide and the interactive fuzzy search of fzf, you can navigate your filesystem at the speed of thought. If you're looking for a single change that will have a massive impact on your terminal productivity, the **zoxide fzf** combination is it. Give it a try—your \`cd\` key will thank you.`,
    date: "2026-01-17",
    author: "zoxide.org",
    category: "Tutorial",
    primaryKeyword: "zoxide fzf",
    tags: [
      "zoxide fzf",
      "fzf",
      "tutorial",
      "interactive",
      "fuzzy search",
      "productivity",
    ],
    readTime: 7,
  },
  {
    id: "18",
    slug: "zoxide-fzf-interactive-guide-zh",
    locales: ["zh"],
    alternateSlugs: {
      en: "zoxide-fzf-interactive-guide-en",
      ja: "zoxide-fzf-interactive-guide-ja",
    },
    title: "超级终端：zoxide 与 fzf 交互式目录跳转终极教程",
    excerpt:
      "通过结合 zoxide 和 fzf，解锁快如闪电的终端导航。本教程将展示如何配置和使用 zoxide 与 fzf，获得改变你命令行习惯的交互式模糊搜索体验。",
    content: `# 超级终端：zoxide 与 fzf 交互式目录跳转终极教程

你是否厌倦了反复输入 \`cd ../../..\`，或者为了切换目录而按无数次 \`Tab\` 键？我们都经历过这种痛苦。命令行功能强大，但文件系统导航却常常显得笨拙和重复。如果只需输入部分名称，就能在几秒钟内跳转到任何常用目录，那会怎么样？

现在，让我们隆重介绍终端效率工具中的“王炸组合”：**zoxide 和 fzf**。Zoxide 是一个“智能”目录跳转工具，能记住你的使用习惯；而 fzf 则是一个快如闪电的模糊搜索器。将它们结合，你将得到一个堪称魔法的交互式模糊搜索导航系统。本篇 **zoxide fzf 教程**将向你展示如何配置并精通这套工作流，让它成为你的命令行神器。

## 什么是 zoxide？比 cd 更智能的目录跳转工具

**zoxide** 的核心是一个速度极快的 \`cd\` 命令替代品。你无需手动输入完整路径，只需向 \`zoxide\` 传递你目标目录名称的几个字符即可。

它的工作原理是什么？Zoxide 在后台运行，默默记录你最常访问的目录。它通过一个名为“frecency”的智能算法——即 **fre**quency（频率）和 **recency**（近时性）的结合——来为你的目录排名。当你输入 \`z my-project\`，它会立即跳转到与 \`my-project\` 匹配的、最“frecent”的目录。随着你的使用，它会不断学习，变得越来越智能和精准。

由于它是用 Rust 编写的，因此极其轻量，绝不会拖慢你的 shell 启动速度。

## 什么是 fzf？命令行模糊搜索神器

**fzf** 是一个通用的命令行模糊查找器。如果你从未使用过模糊搜索，那么准备好大开眼界吧。它允许你通过输入寥寥数个字符，就能从海量列表（如文件、命令历史、git 提交记录等）中筛选出目标。

与严格搜索不同，fzf 的“模糊”匹配不要求你输入连续的字符。例如，要查找名为 \`authentication_controller.rb\` 的文件，你只需输入 \`authconrb\`，fzf 就能立即找到它。对于任何长时间使用终端的人来说，它都是一个不可或缺的工具。

## 如何配置 zoxide 与 fzf 交互式搜索：分步教程

这才是真正释放其威力的地方。默认情况下，如果 \`zoxide\` 为你的查询找到多个匹配项，它只会跳转到排名最高的那一个。但是，当你将它与 fzf 集成后，zoxide 会打开一个**交互式菜单**，让你精确选择你想要的目录。

以下是配置步骤。

**第一步：安装 zoxide 和 fzf**

安装这两个工具最简单的方法是使用包管理器。

*   **macOS (Homebrew):**
    \`\`\`bash
    brew install zoxide fzf
    \`\`\`

*   **Windows (Scoop or Winget):**
    \`\`\`powershell
    # 使用 Scoop
    scoop install zoxide fzf

    # 或使用 Winget
    winget install ajeetdsouza.zoxide fzf
    \`\`\`

*   **Linux (使用你的发行版包管理器):**
    请查阅 zoxide 和 fzf 的官方安装指南，因为包名可能有所不同。例如，在 Arch Linux 上：
    \`\`\`bash
    pacman -S zoxide fzf
    \`\`\`

**第二步：配置你的 Shell**

现在，只需在你的 shell 配置文件中添加一行，即可初始化 zoxide 并自动启用 fzf 的交互式集成。

*   **对于 Bash 或 Zsh (\`~/.bashrc\` 或 \`~/.zshrc\`):**
    \`\`\`bash
    eval "$(zoxide init bash)"
    \`\`\`
    *(注意: 对于 Zsh, 你也可以使用 \`eval "$(zoxide init zsh)"\`)*

*   **对于 Fish (\`~/.config/fish/config.fish\`):**
    \`\`\`fish
    zoxide init fish | source
    \`\`\`

*   **对于 PowerShell (\`$PROFILE\`):**
    \`\`\`powershell
    Invoke-Expression (& { (zoxide init powershell | Out-String) })
    \`\`\`

保存文件后，重启你的 shell 或重新加载配置文件 (例如, \`source ~/.zshrc\`)。就这样！只要 fzf 已安装，zoxide 就会自动调用它进行交互式选择。

## 如何使用 zi 命令：fzf 交互式目录跳转

配置完成后，你现在可以使用 \`zi\` 这个强大的**交互式命令**了。

只需在终端中输入 \`zi\` 并按回车。

一个由 fzf 驱动的菜单会立即弹出，按“frecency”顺序列出 zoxide 知道的所有目录。

现在你可以：
1.  **开始输入**: 输入你目标目录的几个字符，列表将实时筛选。
2.  **使用方向键**: 上下移动以选择正确的目录。
3.  **按下回车**: 你将瞬间被传送到你选择的目标位置。

这个**终端目录跳转**工作流非常快速和直观。它将一个多步骤的导航过程变成了一个无缝的、两秒钟内即可完成的动作。

## zoxide fzf 技巧：别名、排除目录与工作流优化

为了让体验更加顺滑，可以考虑在你的 shell 配置文件中添加以下别名：

\`\`\`bash
# 对于 Bash/Zsh
alias j="z"
alias jj="zi"
\`\`\`

\`\`\`fish
# 对于 Fish
alias j "z"
alias jj "zi"
\`\`\`

现在你可以使用 \`j project\` 进行快速跳转，使用 \`jj\` 进行交互式搜索。这个简单的别名方案是一个流行的约定，能为你节省宝贵的击键次数。

如果你想清理数据库，可以使用 \`zoxide remove /path/to/directory\` 来让 zoxide 忘记某个特定条目。

## 结论：告别输入完整路径的时代

结合 zoxide 和 fzf 不仅仅是对工作流的一个小调整；它更是对你命令行体验的一次根本性升级。它减少了记忆路径的认知负担，最小化了击键次数，并最终为你节省了时间和免去了挫败感。

通过利用 zoxide 的智能历史和 fzf 的**交互式模糊搜索**，你可以以思想的速度在文件系统中导航。如果你正在寻找一个能极大地提升你**命令行效率**的改变，那么 **zoxide fzf** 这个组合就是答案。试试看吧——你的 \`cd\` 键会感谢你的。`,
    date: "2026-01-17",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide fzf 教程",
    tags: ["zoxide fzf", "fzf", "教程", "交互式", "模糊搜索", "命令行神器"],
    readTime: 7,
  },
  {
    id: "19",
    slug: "zoxide-fzf-interactive-guide-ja",
    locales: ["ja"],
    alternateSlugs: {
      en: "zoxide-fzf-interactive-guide-en",
      zh: "zoxide-fzf-interactive-guide-zh",
    },
    title:
      "ターミナルを強化する：zoxideとfzfによるインタラクティブなディレクトリ移動の究極ガイド",
    excerpt:
      "zoxideとfzfを連携させて、光速のターミナルナビゲーションを体験しましょう。このガイドでは、zoxideとfzfのセットアップ方法と使い方を解説し、あなたのコマンドライン習慣を変えるインタラクティブなあいまい検索を実現します。",
    content: `# ターミナルを強化する：zoxideとfzfによるインタラクティブなディレクトリ移動の究極ガイド

\`cd ../../..\` と入力したり、ファイルシステムを移動するために \`Tab\` キーを何十回も叩くのにうんざりしていませんか？誰もが経験することです。コマンドラインは強力ですが、その操作は不便で反復的に感じられることがあります。もし、名前の一部を覚えているだけで、よく使うディレクトリに数秒でジャンプできるとしたらどうでしょう？

ターミナルの生産性を向上させる強力なコンビ、**zoxide と fzf** の登場です。Zoxideはあなたの癖を記憶する「スマート」なディレクトリジャンパーで、fzfは超高速のあいまい検索（ファジーファインダー）です。この2つを連携させることで、まるで魔法のようなインタラクティブなあいまい検索ナビゲーションシステムが手に入ります。このガイドでは、**zoxide fzf 連携** のセットアップ方法と使い方を詳しく解説し、あなたのコマンドライン作業を効率化します。

## zoxideとは？cdに代わるスマートな選択肢

**zoxide** の核心は、\`cd\` コマンドの超高速な代替品であることです。パスを手動で入力する代わりに、目的のディレクトリ名の数文字を \`zoxide\` に渡すだけです。

どのように機能するのでしょうか？Zoxideはバックグラウンドで動作し、あなたが最も頻繁に訪れるディレクトリを追跡します。**fre**quency（頻度）と **recency**（最近性）を組み合わせた「frecency」という賢いアルゴリズムを使い、ディレクトリをランク付けします。\`z my-project\` と入力すると、\`my-project\` にマッチする最も「frecent」なディレクトリに即座にジャンプします。使えば使うほど学習し、時間と共によりスマートで正確になります。

Rustで書かれているため、信じられないほど軽量で、シェルの起動時間を遅くすることもありません。

## fzfとは？コマンドラインのファジーファインダー

**fzf** は、汎用のコマンドラインあいまい検索ツールです。ファジーファインダーを使ったことがないなら、驚く準備をしてください。ほんの数文字を入力するだけで、長いリスト（ファイル、コマンド履歴、gitコミットなど）をフィルタリングできます。

厳密な検索とは異なり、fzfの「あいまい」検索では、連続した文字を入力する必要はありません。例えば、\`authentication_controller.rb\` という名前のファイルを見つけるには、\`authconrb\` と入力するだけで、fzfは即座にそれを見つけ出します。ターミナルで多くの時間を過ごす人にとっては、不可欠なツールです。

## zoxide と fzf のセットアップ方法：ステップバイステップ

ここからが本領発揮です。デフォルトでは、\`zoxide\` がクエリに複数のマッチを見つけた場合、最高ランクのものにジャンプするだけです。しかし、fzfと連携させると、zoxideは代わりに**インタラクティブなメニュー**を開き、目的のディレクトリを正確に選択させてくれます。

セットアップ方法は以下の通りです。

**ステップ1：zoxide と fzf のインストール**

両方をインストールする最も簡単な方法は、パッケージマネージャーを使うことです。

*   **macOS (Homebrew):**
    \`\`\`bash
    brew install zoxide fzf
    \`\`\`

*   **Windows (Scoop or Winget):**
    \`\`\`powershell
    # Scoopを使用
    scoop install zoxide fzf

    # またはWingetを使用
    winget install ajeetdsouza.zoxide fzf
    \`\`\`

*   **Linux (各ディストリビューションのパッケージマネージャーを使用):**
    パッケージ名は異なる場合があるため、zoxideとfzfの公式インストールガイドを確認してください。例えば、Arch Linuxの場合：
    \`\`\`bash
    pacman -S zoxide fzf
    \`\`\`

**ステップ2：シェルの設定**

次に、シェルの設定ファイルに一行追加して、zoxideを初期化し、fzf連携を自動的に有効にします。

*   **Bash または Zsh (\`~/.bashrc\` または \`~/.zshrc\`):**
    \`\`\`bash
    eval "$(zoxide init bash)"
    \`\`\`
    *(注: Zshの場合, \`eval "$(zoxide init zsh)"\` も使用できます)*

*   **Fish (\`~/.config/fish/config.fish\`):**
    \`\`\`fish
    zoxide init fish | source
    \`\`\`

*   **PowerShell (\`$PROFILE\`):**
    \`\`\`powershell
    Invoke-Expression (& { (zoxide init powershell | Out-String) })
    \`\`\`

ファイルを保存した後、シェルを再起動するか、設定ファイルを再読み込みします (例: \`source ~/.zshrc\`)。これだけです！fzfがインストールされていれば、zoxideは自動的にインタラクティブ選択にfzfを使用します。

## zi コマンドの使い方：fzf でインタラクティブにディレクトリ移動

セットアップが完了したら、強力な**インタラクティブコマンド** \`zi\` が使えるようになります。

ターミナルで \`zi\` と入力してエンターキーを押すだけです。

fzfによるメニューがポップアップし、zoxideが知っているすべてのディレクトリが「frecency」順にリスト表示されます。

これで、あなたは次のことができます：
1.  **入力を開始**: 目的のディレクトリの数文字を入力します。リストはリアルタイムでフィルタリングされます。
2.  **矢印キーを使用**: 上下に移動して正しいディレクトリを選択します。
3.  **エンターキーを押す**: 選択した目的地に一瞬で移動します。

このワークフローは、**ディレクトリ移動を高速化**し、信じられないほど速く直感的です。多段階のナビゲーションプロセスを、シームレスな2秒のアクションに変えてくれます。

## zoxide fzf ヒント：エイリアス、除外設定、ワークフロー

さらにスムーズな体験のために、以下のエイリアスをシェルの設定ファイルに追加することをお勧めします。

\`\`\`bash
# Bash/Zshの場合
alias j="z"
alias jj="zi"
\`\`\`

\`\`\`fish
# Fishの場合
alias j "z"
alias jj "zi"
\`\`\`

これで、\`j project\` で素早くジャンプし、\`jj\` でインタラクティブな検索ができます。このシンプルなエイリアス設定は人気の慣習で、貴重なキーストロークを節約できます。

データベースをクリーンアップしたい場合は、\`zoxide remove /path/to/directory\` を使って特定のエントリを忘れさせることができます。

## 結論：もうフルパスを入力する必要はない

zoxideとfzfの連携は、ワークフローの小さな調整以上のものであり、コマンドライン体験の根本的なアップグレードです。パスを記憶する精神的な負担を減らし、キーストロークを最小限に抑え、最終的には時間とフラストレーションを節約します。

zoxideのインテリジェントな履歴とfzfの**インタラクティブなあいまい検索**を活用することで、思考の速さでファイルシステムをナビゲートできます。**コマンドライン効率化**に大きな影響を与える単一の変更を探しているなら、**zoxide fzf 連携**がその答えです。ぜひ試してみてください—あなたの \`cd\` キーが感謝することでしょう。`,
    date: "2026-01-17",
    author: "zoxide.org",
    category: "チュートリアル",
    primaryKeyword: "zoxide fzf 連携",
    tags: ["zoxide fzf", "fzf", "連携", "使い方", "インタラクティブ", "効率化"],
    readTime: 7,
  },
  {
    id: "15",
    slug: "zoxide-linux-en",
    locales: ["en"],
    alternateSlugs: { zh: "zoxide-linux-zh", ja: "zoxide-linux-ja" },
    title: "zoxide linux: Fast Directory Jumps on Linux",
    excerpt:
      "A practical “zoxide linux” guide: installation on Ubuntu/Arch, shell init, fzf integration, and troubleshooting so your Linux terminal navigation stays fast.",
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

## 2) How to Install zoxide on Linux: Ubuntu, Arch, Fedora

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

## 3) The Missing Step: \`zoxide init\` for Linux Shell Integration

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

## 5) How to Use zoxide on Linux: Essential Commands

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

## 6) Replace cd with zoxide on Linux (--cmd Flag)

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

## 9) Troubleshooting zoxide on Linux

### "command not found: z"

- Ensure your init line is in the right file (\`.bashrc\`, \`.zshrc\`, etc.).
- Reload it (\`source ~/.zshrc\`) or open a new terminal.
- Confirm \`zoxide\` is in PATH (\`which zoxide\`).

### "It doesn't learn / doesn't add directories"

This is usually a hook conflict: prompt frameworks, custom \`cd\` wrappers, or plugin managers modifying hooks. Put the init line later in your config. If you use \`--cmd cd\`, disable it and confirm basic \`z\` learning first.

### \`zi\` isn't interactive

Install \`fzf\`, restart your shell, and ensure \`fzf\` is in PATH (\`which fzf\`).

---

## 10) How to Uninstall zoxide on Linux

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
    date: "2025-12-22",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide linux",
    tags: ["zoxide linux", "linux", "installation", "fzf", "troubleshooting"],
    readTime: 8,
  },
  {
    id: "14",
    slug: "zoxide-linux-zh",
    locales: ["zh"],
    alternateSlugs: { en: "zoxide-linux-en", ja: "zoxide-linux-ja" },
    title: "zoxide linux 安装与使用全攻略",
    excerpt:
      "面向关键词 “zoxide linux”：覆盖 Ubuntu/Arch 安装、Shell 初始化、fzf 集成、常见错误修复，让你的 Linux 终端跳转更快。",
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
    date: "2025-12-22",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide linux 安装",
    tags: ["zoxide linux", "linux", "安装", "fzf", "故障排除"],
    readTime: 9,
  },
  {
    id: "16",
    slug: "zoxide-linux-ja",
    locales: ["ja"],
    alternateSlugs: { en: "zoxide-linux-en", zh: "zoxide-linux-zh" },
    title: "zoxide linux：Linuxでの高速ディレクトリジャンプ",
    excerpt:
      "zoxide linuxの実践ガイド：Ubuntu/Archへのインストール、シェル初期化、fzf連携、トラブルシューティングでLinuxターミナルナビゲーションを高速化。",
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
    date: "2025-12-22",
    author: "zoxide.org",
    category: "チュートリアル",
    primaryKeyword: "zoxide linux インストール",
    tags: [
      "zoxide linux",
      "linux",
      "インストール",
      "fzf",
      "トラブルシューティング",
    ],
    readTime: 8,
  },
  {
    id: "1",
    slug: "quick-start",
    title: "zoxide 快速开始指南",
    excerpt: "5 分钟快速上手 zoxide，学习基本命令和配置方法。",
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

更多高级用法，请查看[高级配置教程](/blog/advanced-config/)。`,
    date: "2025-11-30",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide 快速开始",
    tags: ["zoxide 快速开始", "安装", "配置"],
    readTime: 5,
  },
  {
    id: "2",
    slug: "advanced-config",
    title: "zoxide 高级配置技巧",
    excerpt: "学习如何配置 zoxide 以提升工作效率，包括别名设置、目录排除等。",
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
    date: "2025-11-30",
    author: "zoxide.org",
    category: "技巧",
    primaryKeyword: "zoxide 高级配置",
    tags: ["zoxide 高级配置", "配置", "高级", "优化"],
    readTime: 10,
  },
  {
    id: "3",
    slug: "zoxide-vs-autojump",
    title: "zoxide vs autojump 性能对比",
    excerpt: "详细对比 zoxide 和 autojump 的性能差异和使用体验。",
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

查看[完整对比](/blog/zoxide-alternatives-comparison-open-source/)了解更多细节。`,
    date: "2025-11-30",
    author: "zoxide.org",
    category: "对比",
    primaryKeyword: "zoxide vs autojump",
    tags: ["zoxide vs autojump", "对比", "性能", "autojump"],
    readTime: 8,
  },
  {
    id: "4",
    slug: "zoxide-command-not-found",
    title: "zoxide command not found - How to Fix",
    excerpt:
      'Troubleshooting guide for "zoxide command not found" error. Learn how to fix PATH issues and verify installation.',
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

If zoxide is not found, you need to reinstall it. See our [zoxide download guide](/blog/zoxide-download-guide/) for your platform.

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

Make sure zoxide is initialized in your shell configuration file. For detailed setup instructions, read our [zoxide init shell integration guide](/blog/zoxide-init-guide/):

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

- [zoxide not working troubleshooting guide](/blog/zoxide-not-working/)
- [zoxide init shell integration guide](/blog/zoxide-init-guide/)
- [zoxide download guide](/blog/zoxide-download-guide/)`,
    date: "2025-12-01",
    author: "zoxide.org",
    category: "故障排除",
    primaryKeyword: "zoxide command not found",
    tags: ["zoxide command not found", "troubleshooting", "installation", "error"],
    readTime: 5,
  },
  {
    id: "5",
    slug: "zoxide-not-working",
    title: "zoxide not working - Troubleshooting Guide",
    excerpt:
      "Comprehensive troubleshooting guide for when zoxide is not working correctly. Fix common issues and get zoxide running again.",
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

- [Fix "zoxide command not found" error](/blog/zoxide-command-not-found/)
- [zoxide init shell integration guide](/blog/zoxide-init-guide/)
- [Fix "no match found" and database errors](/blog/troubleshooting-zoxide-no-match-found/)`,
    date: "2025-12-01",
    author: "zoxide.org",
    category: "故障排除",
    primaryKeyword: "zoxide not working",
    tags: ["zoxide not working", "troubleshooting", "error", "fix"],
    readTime: 8,
  },
  {
    id: "6",
    slug: "stop-using-cd",
    title: "别再只用 `cd` 了：Zoxide 如何彻底变革终端导航",
    excerpt:
      "如果你还在频繁手动输入 `cd`、反复敲 Tab 补全路径，这篇文章会向你展示 Zoxide 如何用“智能跳转”彻底改变你的终端导航方式。",
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content: "# Stop Using cd: How Zoxide Revolutionizes Terminal Navigation",
    date: "2025-12-02",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide cd alternative",
    tags: ["zoxide cd alternative", "zoxide", "command not found", "setup", "fzf", "config"],
    readTime: 10,
  },
  {
    id: "7",
    slug: "zoxide-alias-autocomplete",
    title: "提升终端效率：深入解析 Zoxide Alias 和 Autocomplete 功能",
    excerpt:
      "通过 zoxide alias 和 autocomplete（自动补全）深度优化终端导航体验，结合 fzf、Arch 与 NixOS 配置，构建高效、可重复的工作流。",
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content:
      "# Boosting Terminal Efficiency: A Deep Dive into Zoxide Aliases and Autocomplete",
    date: "2025-12-03",
    author: "zoxide.org",
    category: "技巧",
    primaryKeyword: "zoxide alias autocomplete",
    tags: ["zoxide alias autocomplete", "alias", "autocomplete", "fzf", "arch", "nixos"],
    readTime: 8,
  },
  {
    id: "8",
    slug: "troubleshooting-zoxide-no-match-found",
    title: 'Zoxide 故障排除：修复 "No Match Found" 和数据库错误',
    excerpt:
      'Zoxide 通常是一个"安装后即忘"的工具，但随着目录历史记录的增长，你可能会遇到特定问题。本指南涵盖了如何调试和修复 "No Match Found" 错误以及数据库相关问题。',
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content:
      '# Troubleshooting Zoxide: Fixing "No Match Found" and Database Errors',
    date: "2025-12-04",
    author: "zoxide.org",
    category: "故障排除",
    primaryKeyword: "zoxide no match found",
    tags: ["zoxide no match found", "troubleshooting", "database", "arch", "nixos"],
    readTime: 10,
  },
  {
    id: "9",
    slug: "mastering-terminal-navigation-zoxide-guide",
    title: "终端导航大师 —— Zoxide 使用终极指南",
    excerpt:
      "如果你每天在命令行界面花费大量时间，你一定体会过使用标准 `cd` 命令在深层目录结构中导航的痛苦。这篇综合指南将深入探讨如何使用 Zoxide，涵盖从 Ubuntu 安装到高级 `fzf` 集成以及常见错误排查的所有内容。",
    // 真实内容由多语言文案文件提供，这里只做占位，避免在翻译缺失时完全为空
    content:
      "# Mastering Terminal Navigation – The Ultimate Guide on How to Use Zoxide",
    date: "2025-12-04",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "how to use zoxide",
    tags: ["how to use zoxide", "zoxide", "tutorial", "ubuntu", "fzf", "query"],
    readTime: 12,
  },
  {
    id: "10",
    slug: "advanced-zoxide-techniques",
    title:
      "Advanced Zoxide Techniques: Mastering Frecency and Custom Workflows",
    excerpt:
      "Unlock frecency scoring, database backups, and scripted workflows so your zoxide setup on Arch or NixOS stays fast, portable, and automation-ready.",
    content: `# Advanced Zoxide Techniques: Mastering Frecency and Custom Workflows

Once you have the basics down, Zoxide can do much more than just jump folders. If you're still getting started, check out our [zoxide commands reference](/blog/zoxide-commands/) first. Understanding the underlying database mechanics allows you to manipulate rankings, backup your history, and script custom workflows. This is essential for power users on **zoxide arch** and **zoxide nixos** systems who want total control over their environment.

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

This effectively combines navigation and inspection. Whether you are fine-tuning a **zoxide arch** setup or defining declarative modules in **zoxide nixos**, these advanced techniques turn a simple tool into a productivity powerhouse. Want to understand the algorithm behind it all? Read our deep dive into [how zoxide works under the hood](/blog/how-zoxide-works-en/).

-----
`,
    date: "2025-12-05",
    author: "zoxide.org",
    category: "技巧",
    primaryKeyword: "zoxide advanced techniques",
    tags: ["zoxide advanced techniques", "frecency", "workflow", "backup", "arch", "nixos"],
    readTime: 9,
  },
  {
    id: "11",
    slug: "zoxide-commands",
    title:
      "The Ultimate Guide to Zoxide Commands: Navigating Your Terminal at Light Speed",
    excerpt:
      "Master the full suite of zoxide commands from initialization to database management. Learn how to debug navigation, clean history, script workflows, and migrate data with practical examples.",
    content: "# The Ultimate Guide to Zoxide Commands",
    date: "2025-12-06",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide commands",
    tags: ["zoxide commands", "commands", "tutorial", "guide", "navigation"],
    readTime: 12,
  },
  {
    id: "12",
    slug: "zoxide-download-guide",
    title:
      "Zoxide Download Guide: Safe, Fast Install for macOS, Windows, and Linux",
    excerpt:
      "A practical zoxide download guide: where to get the official binaries, how to install on macOS, Windows, and Linux, plus verification, troubleshooting, and upgrade tips.",
    // 内容由多语言文案文件提供，这里只做占位
    content: "# Zoxide Download Guide",
    date: "2025-12-11",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide download",
    tags: [
      "zoxide download",
      "install",
      "macos",
      "windows",
      "linux",
      "package manager",
    ],
    readTime: 11,
  },
  {
    id: "13",
    slug: "zoxide-init-guide",
    title: "zoxide init: The Comprehensive Guide to Shell Integration",
    excerpt:
      "So, you've installed zoxide using a package manager like Homebrew, Scoop, or Apt. You type `z` in your terminal, expecting magic, but all you get is command not found. Don't worry — this guide focuses entirely on the `zoxide init` command.",
    content: `# zoxide init: The Comprehensive Guide to Shell Integration

So, you've installed **zoxide** using a package manager like Homebrew, Scoop, or Apt. You type \`z\` in your terminal, expecting magic, but all you get is **\`command not found\`** or a cursor that does nothing.

Don't worry — this is the most common stumbling block for new users. If you haven't installed zoxide yet, check out our [zoxide download guide](/blog/zoxide-download-guide/) first.

Installing the binary is only step one. Step two is **initialization**.

This guide focuses entirely on the \`zoxide init\` command — the bridge that connects the zoxide binary to your shell's behavior. We'll cover how to configure it for every major shell, how to optimize it for performance, and how to use advanced flags to replace \`cd\` entirely.

---

## What Does \`zoxide init\` Do? How Shell Integration Works

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

## How to Configure zoxide init for Bash, Zsh, Fish and PowerShell

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

## Replace cd with zoxide: Using the --cmd Flag

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

## zoxide init Performance: Lazy Loading for Faster Shell Startup

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

## Fix "command not found: z" and Other zoxide init Errors

### "command not found: z"

- Did you restart the shell? The config file is only read on startup.
  - Run \`source ~/.zshrc\` (or equivalent), or open a new terminal tab.
- Is zoxide in your \`PATH\`?
  - Run \`which zoxide\`. If it returns nothing, check your installation method.
- Did you use the wrong shell syntax?
  - Putting the Bash \`eval\` command into \`config.fish\` will fail.

For a deeper dive into this error, see our [zoxide command not found troubleshooting guide](/blog/zoxide-command-not-found/).

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

Whether you stick to the standard \`z\` command or alias \`cd\` entirely, proper initialization is the key to unlocking that 10× navigation speed. Once you're set up, explore the [full list of zoxide commands](/blog/zoxide-commands/) to get the most out of it.

Now, go edit that config file.`,
    date: "2025-12-20",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide init",
    tags: [
      "zoxide init",
      "shell",
      "configuration",
      "bash",
      "zsh",
      "fish",
      "powershell",
      "nushell",
      "setup",
    ],
    readTime: 12,
  },
  {
    id: "16",
    slug: "zoxide-performance-en",
    locales: ["en"],
    alternateSlugs: {
      zh: "zoxide-performance-zh",
      ja: "zoxide-performance-ja",
    },
    title: "Why zoxide is Faster: A Deep Dive into the Rank Algorithm",
    excerpt:
      "Understanding the Frecent algorithm behind zoxide and how it predicts your next directory jump with high accuracy.",
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
    date: "2026-01-07",
    author: "zoxide.org",
    category: "Deep Dive",
    primaryKeyword: "zoxide performance",
    tags: ["zoxide performance", "performance", "algorithm", "rust"],
    readTime: 4,
  },
  {
    id: "17",
    slug: "zoxide-performance-zh",
    locales: ["zh"],
    alternateSlugs: {
      en: "zoxide-performance-en",
      ja: "zoxide-performance-ja",
    },
    title: "为什么 zoxide 这么快：深入解析排名算法",
    excerpt:
      '深入了解 zoxide 背后的"频率+最近使用"（Frecent）算法，以及它是如何精准预测你的下一次跳转的。',
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
    date: "2026-01-07",
    author: "zoxide.org",
    category: "深度解析",
    primaryKeyword: "zoxide 性能",
    tags: ["zoxide 性能", "性能", "算法", "rust"],
    readTime: 4,
  },
  {
    id: "18",
    slug: "how-zoxide-works-en",
    locales: ["en"],
    alternateSlugs: { zh: "how-zoxide-works-zh", ja: "how-zoxide-works-ja" },
    title: "How does zoxide change the directory? (The Internal Magic)",
    excerpt:
      "Deep dive into how zoxide interacts with your shell to change directories, despite being a separate binary process.",
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
    date: "2026-01-08",
    author: "zoxide.org",
    category: "Deep Dive",
    primaryKeyword: "how zoxide works",
    tags: ["how zoxide works", "shell", "internals", "bash", "zsh"],
    readTime: 5,
  },
  {
    id: "19",
    slug: "how-zoxide-works-zh",
    locales: ["zh"],
    alternateSlugs: { en: "how-zoxide-works-en", ja: "how-zoxide-works-ja" },
    title: "zoxide 是如何切换目录的？（原理解析）",
    excerpt:
      "深入解析 zoxide 作为独立二进制程序，是如何突破进程限制，控制你的 Shell 进行目录切换的。",
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
    date: "2026-01-08",
    author: "zoxide.org",
    category: "深度解析",
    primaryKeyword: "zoxide 工作原理",
    tags: ["zoxide 工作原理", "shell", "原理解析", "bash", "zsh"],
    readTime: 5,
  },

  {
    id: "20",
    slug: "zoxide-performance-ja",
    locales: ["ja"],
    alternateSlugs: { en: "zoxide-performance-en" },
    title: "zoxideが速い理由：ランクアルゴリズムの詳細解説",
    excerpt:
      "zoxideの背後にあるFrecentアルゴリズムを理解し、次のディレクトリジャンプを高精度で予測する仕組み。",
    content: "",
    date: "2026-01-07",
    author: "zoxide.org",
    category: "詳細解説",
    primaryKeyword: "zoxide パフォーマンス",
    tags: ["zoxide パフォーマンス", "zoxide", "アルゴリズム", "rust"],
    readTime: 6,
  },
  {
    id: "21",
    slug: "how-zoxide-works-ja",
    locales: ["ja"],
    alternateSlugs: { en: "how-zoxide-works-en" },
    title: "zoxideはどうやってディレクトリを変更するのか？（内部の魔法）",
    excerpt:
      "別のバイナリプロセスであるにもかかわらず、zoxideがシェルとどのように連携してディレクトリを変更するのかを深掘り。",
    content: "",
    date: "2026-01-08",
    author: "zoxide.org",
    category: "詳細解説",
    primaryKeyword: "zoxide 仕組み",
    tags: ["zoxide 仕組み", "zoxide", "内部", "シェル", "フック"],
    readTime: 7,
  },
  {
    id: "17",
    slug: "what-is-zoxide-smarter-cd",
    locales: ["en"],
    alternateSlugs: {
      zh: "zoxide-shi-shenme-z-mingling-tidai-cd",
      ja: "zoxide-toha-cd-no-kawari",
    },
    title: "What is zoxide? The smarter cd command for fast directory jumping",
    excerpt:
      "Learn what zoxide is, what problems it solves, how it changes directories, and why the z command feels like a smarter cd.",
    content: `# What is zoxide? The smarter \`cd\` command for fast directory jumping

If you’ve ever typed \`cd ~/some/really/long/path/to/a/project\` and thought “there has to be a better way,” you’re exactly the kind of person who will love zoxide.

**zoxide is a smarter \`cd\` command**. It learns the directories you actually use, then lets you jump to them using short keywords. Instead of remembering full paths, you type your intent (“work”, “infra”, “client”, “docs”) and zoxide takes you to the best match—usually the directory you visit most often, most recently.

This post answers the questions people commonly ask when searching **“what is zoxide”** and **“zoxide change directory”**: what it is, why it exists, how it works with your shell, and how the \`z\` command differs from plain \`cd\`.

---

## What Problems Does zoxide Solve? Why Replace cd?

On paper, \`cd\` is simple. In real life, it becomes friction:

- **Deep project paths**: modern repos, monorepos, and nested config folders are long.
- **Constant context switching**: you bounce between \`~/dev/\`, \`~/work/\`, \`~/src/\`, \`/etc/\`, \`/var/log/\`, and a dozen repos.
- **You forget paths**: you remember “the terraform folder”, not whether it’s under \`ops/infra/terraform\` or \`infra/terraform/modules\`.
- **You waste keystrokes**: even with tab completion, you still need to “walk” the tree.

zoxide solves this by building a personal “directory memory” so the terminal can jump directly to the right place.

---

## How Does zoxide Change Directories? Shell Integration Explained

This part surprises new users: **zoxide is a binary, but directory changes happen inside the shell**.

A normal program cannot directly change the working directory of your current shell process. So zoxide uses a standard shell trick:

1. Your shell defines a function (usually named \`z\`).
2. That function runs the \`zoxide\` binary to figure out the best destination directory.
3. Then the function performs the actual \`cd\` (or equivalent) inside the shell.

That’s why **shell integration** is required. The integration is generated by:

\`\`\`bash
zoxide init <shell>
\`\`\`

That command prints shell code to standard output. You then “evaluate” it on startup (for example, \`eval "$(zoxide init zsh)"\`). Once enabled, zoxide can also install a **hook** to record directories whenever you change into them, so its database stays up to date.

---

## The z Command: How to Use zoxide Instead of cd

The \`z\` command is the user-facing shortcut. After you’ve visited a directory a few times, zoxide remembers it and assigns it a score. Then you jump by keywords:

\`\`\`bash
z work
z infra terraform
z docs
\`\`\`

A few practical examples:

- \`z repo\` jumps to your most relevant directory matching “repo”.
- \`z api\` might jump to \`~/dev/company/api\` if that’s where you live.
- \`z infra\` might jump to \`~/dev/company/infra\` even if it’s deeply nested.

Unlike plain \`cd\`, which requires a path, \`z\` allows **fuzzy, intent-based navigation**.

### Does \`z\` replace \`cd\` completely?

Many people still use both:

- Use \`cd\` for explicit paths: \`cd /etc\`, \`cd ~/Downloads\`, \`cd ..\`
- Use \`z\` for “I know what I mean, but not the full path”: \`z terraform\`

Later, you can choose to make \`cd\` smarter using \`zoxide init ... --cmd cd\` (covered in the setup guide).

---

## How zoxide “learns” (in plain English)

zoxide keeps a database of directories you’ve visited. It doesn’t need a cloud account, and it doesn’t scan your filesystem by default. It learns from your behavior: the paths you actually enter (via hooks). Over time:

- frequently used paths get prioritized,
- recently used paths get a boost,
- ambiguous keywords generally resolve to what you use most.

That’s why zoxide gets better the longer you use it.

---

## Quick-start workflow (what to do today)

If you’re new to zoxide, a simple plan is:

1. Install zoxide.
2. Enable \`zoxide init\` in your shell config.
3. Use your terminal normally for a day.
4. Start using \`z <keyword>\` for your most common locations.
5. Add fzf later to unlock \`zi\` (interactive selection) if you want a searchable list.

---

## FAQ: Is zoxide Open Source? Shell Support and Tab Completion

### Is zoxide open source?

Yes. zoxide is developed in the open on GitHub under a permissive license (MIT).

### What shell does zoxide work with?

zoxide supports all major shells. In practice, it’s commonly used with Bash, Zsh, Fish, and others such as PowerShell and Nushell.

### Does zoxide have tab completion?

It provides shell completions and works well with interactive fuzzy finding (often via fzf). The exact completion behavior depends on your shell and configuration.

---

## Wrap-up

If you’re evaluating **“z command instead of cd”**, the best way to think about it is this:

- \`cd\` navigates by **exact paths**.
- \`z\` navigates by **your habits**.

Once zoxide is initialized, it becomes one of those tools that quietly saves time all day. Ready to get started? Check out our [quick start guide](/blog/quick-start/), or see how zoxide compares to other tools in our [zoxide vs autojump comparison](/blog/zoxide-vs-autojump/). For interactive fuzzy search, read our [zoxide and fzf integration guide](/blog/zoxide-fzf-interactive-guide-en/).
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "what is zoxide",
    tags: [
      "what is zoxide",
      "zoxide change directory",
      "z command instead of cd",
      "what problems does zoxide solve",
    ],
    readTime: 5,
  },
  {
    id: "18",
    slug: "zoxide-shi-shenme-z-mingling-tidai-cd",
    locales: ["zh"],
    alternateSlugs: {
      en: "what-is-zoxide-smarter-cd",
      ja: "zoxide-toha-cd-no-kawari",
    },
    title: "zoxide 是什么？终端目录智能跳转工具：用 z 命令替代 cd 的正确方式",
    excerpt:
      "围绕 zoxide 是什么、zoxide 如何实现目录跳转、z 命令替代 cd、zoxide 解决什么问题，讲清原理与上手路径。",
    content: `# zoxide 是什么？终端目录智能跳转工具：用 \`z\` 命令替代 \`cd\` 的正确方式

很多人在搜索 **“zoxide 是什么”** 或 **“zoxide 目录跳转”** 时，背后其实是同一个痛点：目录太深、项目太多、路径太长。你明明知道要去“那个仓库”“那个 infra”“那个 docs”，但你不想再一遍遍输入：

\`\`\`bash
cd ~/dev/projects/company/infra/terraform/modules/...
\`\`\`

**zoxide** 就是用来解决这个问题的。它是一个“更聪明的 \`cd\`”，会根据你的使用习惯记住常去的目录，然后让你用短关键字直接跳转。最常见的用法就是：用 \`z\` 命令来完成目录跳转。

这篇文章会把几个高频问题一次讲清：**zoxide 是什么、zoxide 如何实现目录跳转、z 命令为什么能替代 cd、zoxide 到底解决什么问题**。

---

## zoxide 解决什么问题？（zoxide 有什么用）

\`cd\` 本身没有问题，问题在于我们的工作环境越来越复杂：

- **目录层级越来越深**：monorepo、微服务、IaC、容器挂载目录一层套一层。
- **频繁来回切目录**：\`~/dev/\`、\`~/work/\`、\`/etc/\`、\`/var/log/\`、多个仓库反复切换。
- **你记不住完整路径**：你记得“terraform 在哪”，但不想记“terraform 具体在第几层”。
- **键盘输入成本高**：就算有 Tab 补全，你也需要一步步“走路径”。

zoxide 的价值是：**把“记路径”变成“记意图”**。你只需要输入几个关键词，它就能带你去你最可能想去的那个目录。

---

## zoxide 如何实现目录跳转？（原理解释）

很多新用户会困惑：为什么我装完 zoxide，输入 \`z\` 却报错？关键在于：

> **zoxide 是一个可执行文件，但“切换当前目录”必须由 Shell 自己执行。**

一个普通程序无法直接改变当前 Shell 进程的工作目录。所以 zoxide 的正确做法是：

1. 在 Shell 里定义一个函数（通常叫 \`z\`）。
2. 这个函数调用 \`zoxide\` 二进制，算出“最佳匹配目录”。
3. 函数再在 Shell 内部执行真正的 \`cd\`。

因此，你必须先做 Shell 初始化（Shell Integration），也就是运行：

\`\`\`bash
zoxide init <shell>
\`\`\`

它会输出一段脚本，你需要把它写进你的 Shell 配置文件，并在启动时执行（例如 \`eval "$(zoxide init zsh)"\`）。这段脚本除了定义 \`z\`，还会设置 **hook（钩子）**：当你每次 \`cd\` 进入新目录时，自动把路径记录到 zoxide 的数据库里。

---

## \`z\` 命令为什么能替代 \`cd\`？（z 命令 替代 cd）

\`z\` 不是靠“魔法”工作，而是靠“学习”。当你访问目录时，zoxide 会记录并打分。之后你就可以这样跳转：

\`\`\`bash
z work
z infra terraform
z docs
\`\`\`

直觉上你会发现：

- \`cd\` 需要你提供一个明确路径；
- \`z\` 更像“搜索 + 跳转”，输入关键词就能到达最常用位置。

### 那 \`cd\` 还需要吗？

很多人会同时用：

- **明确路径**：\`cd /etc\`、\`cd ~/Downloads\`、\`cd ..\`
- **模糊意图**：\`z terraform\`、\`z api\`、\`z client\`

更进阶的玩法是让 zoxide 直接接管 \`cd\`（例如 \`--cmd cd\`），把肌肉记忆统一到一个命令上（这部分通常放在配置篇里讲）。

---

## zoxide 的“学习”逻辑（不讲术语也能懂）

zoxide 维护一个目录数据库。它不会默认扫描你的全部磁盘，而是**从你的实际行为中学习**：你进过哪些目录、进得有多频繁、最近是否刚用过。时间越久：

- 常用目录更容易被选中；
- 最近目录会有加权；
- 同名目录冲突时，通常会跳到你最常去的那个。

所以 zoxide 越用越顺手。

---

## FAQ：开源吗？支持哪些 Shell？有自动补全吗？

### zoxide 开源吗？

是的，zoxide 是开源项目，代码在 GitHub 上，并使用 MIT 许可证。

### zoxide 支持哪些 Shell？

它支持主流 Shell，常见如 Bash、Zsh、Fish，也能在 PowerShell、Nushell 等环境使用。

### zoxide 有自动补全（Tab 补全）吗？

zoxide 支持补全，也经常与 fzf 搭配实现交互式选择。补全是否“像你想象那样工作”，取决于你使用的 Shell、补全系统是否启用、以及配置加载顺序。

---

## 总结

如果你正在考虑 **“zoxide 替代 cd”**，可以这样理解：

- \`cd\`：按“路径”导航
- \`z\`：按“习惯/意图”导航

配置好 \`zoxide init\` 之后，你会发现它是一种“无感提升”：每天几十次目录跳转都更快、更轻松。下一篇我们会专门讲 **Mac 安装 zoxide、不同 Shell 的配置方法，以及自动补全/交互选择如何优化**。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide 是什么",
    tags: [
      "zoxide 是什么",
      "zoxide 目录跳转",
      "zoxide 替代 cd",
      "z 命令 替代 cd",
      "zoxide 有什么用",
    ],
    readTime: 5,
  },
  {
    id: "19",
    slug: "zoxide-toha-cd-no-kawari",
    locales: ["ja"],
    alternateSlugs: {
      en: "what-is-zoxide-smarter-cd",
      zh: "zoxide-shi-shenme-z-mingling-tidai-cd",
    },
    title: "zoxideとは？cdの代わりに使える高速ディレクトリ移動ツール",
    excerpt:
      "「zoxide とは」「cd の代わり」「zoxide 仕組み」「zoxide 何が便利」などの疑問に答えながら、zoxideの基本と導入の考え方を解説。",
    content: `# zoxideとは？\`cd\`の代わりに使える高速ディレクトリ移動ツール

「**zoxide とは？**」「**cd の代わり**に何か便利なものはない？」「深いパスを毎回打つのがつらい」——そんな悩みを持つ人に刺さるのが **zoxide** です。

zoxide は、よく使うディレクトリを自動で“学習”してくれる **スマートなディレクトリジャンプツール**。一度よく通う場所を覚えると、次からは短いキーワードだけで高速に移動できます。たとえば \`~/dev/projects/company/infra/terraform/...\` のような長いパスを、\`z terraform\` のように“意図”で呼び出せるイメージです。

この記事では、検索でよく出てくる **「zoxide とは」「zoxide 仕組み」「cd の代わりに z」「zoxide 何が便利」** などの疑問をまとめて解決します。

---

## zoxideは何を解決する？（zoxide 何が便利 / zoxide メリット）

\`cd\` はシンプルですが、開発や運用の現場では不便になりがちです。

- **ディレクトリが深い**：monorepo、IaC、複数サービスで階層が増える
- **移動が多い**：同じ場所を1日に何十回も行き来する
- **フルパスを覚えない**：覚えているのは「infra」「docs」「client」などの“意味”
- **入力が面倒**：Tab補完しても木を辿る手間は消えない

zoxide はこの摩擦を減らし、**ディレクトリ移動を「記憶」ではなく「習慣」に最適化**します。

---

## zoxideはどうやってディレクトリ移動する？（zoxide 仕組み）

ここが重要ポイントです。

> zoxide 自体は“コマンド（バイナリ）”ですが、**現在のシェルの作業ディレクトリを変える処理はシェル側で実行する必要があります。**

そのため、zoxide は以下の流れで動きます。

1. シェルに \`z\` という関数（またはエイリアス）を定義する
2. \`z\` が zoxide バイナリを呼び出して「行き先の候補」を計算する
3. \`z\` 関数がシェル内部で \`cd\` 相当を実行して移動する

この“橋渡し”をしてくれるのが **\`zoxide init\`** です。

\`\`\`bash
zoxide init <shell>
\`\`\`

を実行すると、シェル用のスクリプトが出力されます。それを \`.zshrc\` や \`.bashrc\` などの起動設定に入れて評価（\`eval\` / \`source\`）することで、毎回の起動で \`z\` が使えるようになります。

また、初期化スクリプトは **hook（フック）** を仕込んで、ディレクトリ移動のたびに履歴（データベース）を更新できるようにします。

---

## \`z\`コマンドは\`cd\`の代わりになる？（cd の代わりに z）

結論から言うと、多くの人にとって **“ほぼ代替”** になります。

zoxide は「使った回数」や「最近使ったか」をもとに候補をスコアリングします。慣れてくると、こんな感じで移動できます。

\`\`\`bash
z work
z infra terraform
z docs
\`\`\`

ポイントは、\`cd\` が「パス指定」なのに対して、\`z\` は「キーワード指定」だということ。
“パスを思い出す”のではなく、“行きたい意味”だけで移動できます。

### \`cd\`は捨てるべき？

必ずしも捨てる必要はありません。

- 絶対パス：\`cd /etc\`
- 相対移動：\`cd ..\`
- 意図ジャンプ：\`z terraform\`

というように使い分ける人も多いです。さらに進めるなら \`--cmd cd\` で \`cd\` 自体を賢くする設定もあります（設定編で扱います）。

---

## よくある質問（オープンソース？対応シェル？タブ補完？）

### zoxideはオープンソース？（zoxide オープンソース）

はい。zoxide は GitHub 上で開発されているオープンソースで、MITライセンスです。

### zoxideはどのシェルで使える？（zoxide 対応シェル）

Bash / Zsh / Fish など主要シェルに対応し、PowerShellやNushellなどでも使えます。

### タブ補完はある？（zoxide タブ補完 / オートコンプリート）

補完はシェル側の仕組みに依存しますが、zoxide は補完と相性が良く、fzf を入れると \`zi\` の対話選択も快適になります。

---

## まとめ

「**cd の代わり**に使えるツール」として zoxide を見るなら、こう覚えると早いです。

- \`cd\`：正確なパスで移動する
- \`z\`：自分の習慣に合わせて“意図”で移動する

まずは \`zoxide init\` を正しく設定して、普段どおりに使ってみてください。数日で“学習”が効いてきて、ディレクトリ移動のストレスが目に見えて減ります。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide とは",
    tags: [
      "zoxide とは",
      "cd の代わり zoxide",
      "zoxide 仕組み",
      "zoxide メリット",
      "z コマンド",
    ],
    readTime: 5,
  },
  {
    id: "20",
    slug: "install-zoxide-mac-shell-integration-completion",
    locales: ["en"],
    alternateSlugs: {
      zh: "mac-anzhuang-zoxide-init-autocomplete",
      ja: "mac-ni-zoxide-install-init-completion",
    },
    title:
      "How to install zoxide on Mac and enable shell integration + tab completion",
    excerpt:
      "Step-by-step guide to installing zoxide on macOS, configuring zoxide init for popular shells, and making tab completion work smoothly.",
    content: `# How to install zoxide on Mac (and make it actually work)

People search **“how to install zoxide in Mac”** and often hit the same snag: they install the binary, type \`z\`, and nothing works. That’s because zoxide isn’t a standalone “command you run once.” To behave like a smarter \`cd\`, it must be integrated into your shell startup so it can define \`z\`, install hooks, and enable completions.

This post is the Mac-focused setup guide: installation options, the correct \`zoxide init\` line for each shell, common plugin-order pitfalls, and what to expect from tab completion.

---

## Install zoxide on macOS

### Option 1: Homebrew (most common)

\`\`\`bash
brew install zoxide
\`\`\`

Homebrew also makes it easy to upgrade later.

### Option 2: Cargo (for the latest build)

If you use Rust tooling:

\`\`\`bash
cargo install zoxide --locked
\`\`\`

### Option 3: Other package managers

macOS users sometimes prefer MacPorts or Nix. The official GitHub repo lists many options.

After installing, verify:

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

If \`which zoxide\` returns nothing, fix your PATH before moving on.

---

## What shell does zoxide work with? (Mac edition)

On macOS, the most common shells are:

- **Zsh** (default on modern macOS)
- **Bash** (still used by some power users)
- **Fish** (popular for interactive UX)

zoxide supports all major shells; you just need the right init snippet.

---

## Enable shell integration (the required step)

Remember: \`zoxide init <shell>\` prints a block of shell script. You must evaluate it at startup so it runs every time your terminal opens.

### Zsh (default on macOS)

Add to \`~/.zshrc\`:

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

Then reload:

\`\`\`zsh
source ~/.zshrc
\`\`\`

**Plugin order tip:** If you use a plugin manager (oh-my-zsh, zinit, etc.), put the init line after plugin loading so it doesn’t get overridden by custom \`z\` functions or completion systems.

### Bash

Add to \`~/.bashrc\` (or \`~/.bash_profile\` for some login setups):

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

Reload:

\`\`\`bash
source ~/.bashrc
\`\`\`

### Fish

Add to \`~/.config/fish/config.fish\`:

\`\`\`fish
zoxide init fish | source
\`\`\`

---

## Does zoxide have tab completion?

Yes—zoxide provides shell completion support, and it can also use fzf for interactive selection.

That said, “tab completion” depends on how your shell is configured:

- In Zsh, completion typically requires the completion system to be enabled (many setups already do this).
- In Bash, programmable completion needs to be enabled (often default in modern setups).
- In Fish, completions are usually built-in and “just work,” but the exact behavior differs from Zsh.

If you press Tab and nothing completes, the most common causes are:

1. The init line isn’t actually being loaded (wrong file, wrong shell, or not reloaded).
2. A plugin defines a conflicting \`z\` or overrides completion behavior.
3. Your completion system isn’t enabled (common in minimal dotfiles).

A practical fix: move the zoxide init line later in your config, reload, and test again.

---

## Upgrade your experience: \`zi\` + fzf (interactive jumping)

Many users think of \`zi\` as the “directory picker.” When fzf is installed, \`zi\` gives you a searchable list of known directories.

Install fzf on macOS via Homebrew:

\`\`\`bash
brew install fzf
\`\`\`

Now try:

\`\`\`bash
zi
\`\`\`

If everything is wired correctly, you’ll get a fast fuzzy list of directories you’ve visited.

---

## Optional: replace \`cd\` with zoxide (use \`--cmd cd\`)

If you want \`cd\` to behave like zoxide, you can alias the command name at init time:

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

This can be awesome—but test it after your default \`z\` setup is stable. If you rely on Zsh’s own \`cd\` magic or other plugins, you may prefer to keep \`z\` separate.

---

## Troubleshooting checklist (Mac)

- **\`z: command not found\`** → your init line isn’t loading; confirm \`echo $SHELL\` and edit the right config file.
- **\`which zoxide\` returns nothing** → PATH issue; fix install or shell PATH.
- **Tab completion doesn’t work** → confirm init loads, then check plugin conflicts, then verify your completion system is enabled.
- **\`zi\` isn’t interactive** → install fzf and restart the shell.

---

## Wrap-up

On macOS, zoxide is a 2-step tool:

1) install the binary, and
2) enable \`zoxide init\` for your shell so \`z\` exists, hooks record directories, and completions can load.

Once it’s configured, directory navigation becomes one of those “why didn’t I do this earlier?” upgrades.
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "how to install zoxide on Mac",
    tags: [
      "how to install zoxide in Mac",
      "zoxide init",
      "what shell does zoxide work with",
      "does zoxide have tab completion",
    ],
    readTime: 7,
  },
  {
    id: "21",
    slug: "mac-anzhuang-zoxide-init-autocomplete",
    locales: ["zh"],
    alternateSlugs: {
      en: "install-zoxide-mac-shell-integration-completion",
      ja: "mac-ni-zoxide-install-init-completion",
    },
    title:
      "Mac 安装 zoxide：从 brew 安装到 Shell 初始化与自动补全（Tab 补全）一次讲清",
    excerpt:
      "围绕 mac 安装 zoxide、zoxide 支持哪些 shell、zoxide init 怎么配、zoxide 自动补全/Tab 补全怎么启用，给出 macOS 实操步骤与排错清单。",
    content: `# Mac 安装 zoxide：从 Homebrew 安装到 Shell 初始化与自动补全一次讲清

很多人搜索 **“mac 安装 zoxide”**，照着命令装完以后，兴冲冲输入 \`z\`，却发现要么报 \`command not found\`，要么完全没反应。根因通常不是安装失败，而是：

> **zoxide 安装只是第一步；真正让它“能用”的，是 Shell 初始化（\`zoxide init\`）。**

因为“切换当前目录”必须由 Shell 自己执行，zoxide 需要在你的 Shell 启动时注入函数、钩子与补全逻辑。本文以 macOS 为主线，把 **安装、初始化、支持哪些 Shell、自动补全（Tab 补全）、以及常见排错** 一次讲清。

---

## 1) macOS 上安装 zoxide（最推荐：Homebrew）

### 用 Homebrew 安装

\`\`\`bash
brew install zoxide
\`\`\`

### 想要最新版本：Cargo 安装

如果你有 Rust 工具链：

\`\`\`bash
cargo install zoxide --locked
\`\`\`

### 安装后自检（必做）

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

如果 \`which zoxide\` 没输出，优先排查 PATH。没进 PATH，后面怎么 init 都白搭。

---

## 2) zoxide 支持哪些 Shell？（mac 常见三大类）

macOS 上最常见的 Shell 是：

- **Zsh**（mac 默认）
- **Bash**（少数用户）
- **Fish**（偏交互体验党）

zoxide 支持主流 Shell，只要用对应的 init 语句接入即可。

---

## 3) 最关键一步：zoxide init（Shell 初始化）

\`zoxide init <shell>\` 不会改你的任何文件，它只会输出一段脚本。你必须把这段脚本在 Shell 启动时执行（\`eval\` 或 \`source\`），它才会：

- 定义 \`z\` / \`zi\` 等命令
- 安装 Hook（监听目录切换并记录）
- 加载与补全/交互相关的逻辑

---

## 4) macOS 各 Shell 配置“标准答案”

### 4.1 Zsh（默认）

编辑 \`~/.zshrc\`，添加：

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

生效：

\`\`\`zsh
source ~/.zshrc
\`\`\`

**插件排错建议：** 如果你用 oh-my-zsh / zinit 等插件体系，把这行放在插件加载之后，避免被同名函数、补全系统覆盖。

### 4.2 Bash

编辑 \`~/.bashrc\`（有些登录场景也可能是 \`~/.bash_profile\`）：

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

生效：

\`\`\`bash
source ~/.bashrc
\`\`\`

### 4.3 Fish

编辑 \`~/.config/fish/config.fish\`：

\`\`\`fish
zoxide init fish | source
\`\`\`

---

## 5) zoxide 自动补全 / Tab 补全怎么理解？

很多人问 **“zoxide 自动补全”** 或 **“zoxide tab 补全”**。结论是：zoxide 支持补全，但补全的体验高度依赖你使用的 Shell 与补全系统是否启用。

常见导致“Tab 没反应”的原因：

1. init 行没加载（写错文件、没 reload、终端实际用的 Shell 不是你以为的那个）
2. 插件冲突（尤其是 oh-my-zsh 里也有 \`z\` 相关插件或补全体系）
3. 补全系统未启用（极简 dotfiles 常见）

排错优先级建议：先确保 init 生效（\`type z\` 看看 \`z\` 是否是函数），再排查插件冲突，最后再研究补全系统本身。

---

## 6) 强烈建议：配上 \`zi\` + fzf（交互式选择）

很多用户更爱用 \`zi\`，因为它像“目录搜索器”：你输入关键词，在列表里选。\`zi\` 通常与 fzf 配合更爽。

macOS 用 brew 装 fzf：

\`\`\`bash
brew install fzf
\`\`\`

然后试试：

\`\`\`bash
zi
\`\`\`

如果出现可搜索列表，说明你整套链路已经很顺了。

---

## 7) 进阶：让 zoxide 接管 cd（--cmd cd）

如果你想把肌肉记忆统一到 \`cd\`，可以这样：

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

建议策略：先把默认 \`z\` 用稳，再决定是否“接管 cd”。

---

## 8) macOS 常见问题排查清单

- **\`z: command not found\`**：init 没加载。确认当前 Shell（\`echo $SHELL\`），确认你改的是对应配置文件，并 \`source\` 或重开终端。
- **\`which zoxide\` 为空**：PATH 问题。先解决安装路径，再谈 init。
- **Tab 补全无效**：先验证 init 生效，再排查插件冲突与补全系统启用状态。
- **\`zi\` 不交互**：安装 fzf，重启 shell。

---

## 总结

mac 上把 zoxide 用起来，本质就两件事：

1) 安装好二进制（brew 最省事）
2) 把 \`zoxide init\` 正确写进 shell 配置，让 \`z/zi\`、hook、补全逻辑在启动时生效

做到这两步，你就能在终端里真正享受到“智能跳转”的爽感。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "mac 安装 zoxide",
    tags: [
      "mac 安装 zoxide",
      "zoxide 安装 mac",
      "zoxide init",
      "zoxide 支持哪些 shell",
      "zoxide 自动补全",
      "zoxide tab 补全",
    ],
    readTime: 7,
  },
  {
    id: "22",
    slug: "mac-ni-zoxide-install-init-completion",
    locales: ["ja"],
    alternateSlugs: {
      en: "install-zoxide-mac-shell-integration-completion",
      zh: "mac-anzhuang-zoxide-init-autocomplete",
    },
    title:
      "Macにzoxideをインストール：導入手順、対応シェル、タブ補完までまとめて解説",
    excerpt:
      "「zoxide mac インストール」「Macにzoxideをインストール」「zoxide 対応シェル」「zoxide タブ補完」などを一気に解決するmacOS向けセットアップ記事。",
    content: `# Macにzoxideをインストール：導入手順、対応シェル、タブ補完までまとめて解説

「**zoxide mac インストール**」で検索して導入したのに、\`z\` を打っても動かない——このパターンはかなり多いです。原因はたいてい一つ。

> zoxide は“バイナリを入れただけ”では使えません。**\`zoxide init\` でシェルに統合（初期化）**して初めて \`z\` が有効になります。

macOS では Zsh が標準なので、まずは Zsh を前提にしつつ、Bash/Fish でも使えるように整理します。この記事では **インストール、初期化、対応シェル、タブ補完（オートコンプリート）、fzf連携、よくある詰まりどころ** をまとめて解説します。

---

## 1) zoxideをMacにインストールする方法

### Homebrew（定番）

\`\`\`bash
brew install zoxide
\`\`\`

### Cargo（最新版を追いたい場合）

\`\`\`bash
cargo install zoxide --locked
\`\`\`

インストール後は必ず確認：

\`\`\`bash
zoxide --version
which zoxide
\`\`\`

\`which zoxide\` が空なら PATH の問題なので、先にそこを直してください。

---

## 2) zoxideはどのシェルで使える？（zoxide 対応シェル）

macOS でよく使われるのは：

- **Zsh**（デフォルト）
- **Bash**（古い環境・好みで使う人も）
- **Fish**（インタラクティブ派に人気）

zoxide は主要シェルに対応しており、必要なのは“そのシェル向けの init 行”だけです。

---

## 3) いちばん重要：\`zoxide init\`（シェル統合）

\`zoxide init <shell>\` は設定ファイルを勝手に書き換えるのではなく、**シェル用スクリプトを出力**します。そのスクリプトを \`.zshrc\` などに入れて起動時に評価することで、

- \`z\` / \`zi\` 関数の定義
- ディレクトリ移動の履歴記録（hook）
- 補完や対話選択に関するロジック

が有効になります。

---

## 4) macOSのシェル別：設定の“正解”

### Zsh（標準）

\`~/.zshrc\` に追記：

\`\`\`zsh
eval "$(zoxide init zsh)"
\`\`\`

反映：

\`\`\`zsh
source ~/.zshrc
\`\`\`

**プラグイン順の注意**：oh-my-zsh などを使っているなら、プラグイン読み込み後に init を置くと衝突しにくいです（\`z\` の再定義や補完の上書き回避）。

### Bash

\`~/.bashrc\`（またはログイン設定によっては \`~/.bash_profile\`）に追記：

\`\`\`bash
eval "$(zoxide init bash)"
\`\`\`

### Fish

\`~/.config/fish/config.fish\` に追記：

\`\`\`fish
zoxide init fish | source
\`\`\`

---

## 5) タブ補完はある？（zoxide タブ補完 / オートコンプリート）

「**zoxide タブ補完**」で探す人は多いですが、結論としては **補完は用意されていて、体験はシェル設定に依存**します。

タブ補完が効かないときの典型原因：

1. init 行が読み込まれていない（編集したファイルが違う、再読み込みしていない）
2. プラグインやテーマが \`z\` を上書きしている
3. そもそも補完システムが有効になっていない（ミニマル設定）

まずは \`type z\` で \`z\` が関数として定義されているか確認し、次にプラグイン衝突を疑うのが最短です。

---

## 6) \`zi\` + fzf で“ディレクトリ検索”を快適に

zoxide は \`zi\` で候補から選ぶ対話モードが使えます。macOS では fzf を入れるだけで体験がかなり上がります。

\`\`\`bash
brew install fzf
\`\`\`

あとは：

\`\`\`bash
zi
\`\`\`

で検索・選択のUIが出ればOKです。

---

## 7) さらに進める：\`cd\` を賢くする（--cmd cd）

「\`cd\` と \`z\` を使い分けたくない」なら、\`--cmd cd\` で \`cd\` にzoxideの挙動を持たせられます：

\`\`\`zsh
eval "$(zoxide init zsh --cmd cd)"
\`\`\`

ただし、Zsh の元々の \`cd\` 体験やプラグイン挙動と差が出るケースもあります。まずは通常の \`z\` を安定させてから切り替えるのが安全です。

---

## まとめ

macOS で zoxide を快適に使うポイントはシンプルです。

1) zoxide をインストール
2) **\`zoxide init\` をシェル設定に追加して有効化**
3) 必要なら fzf を入れて \`zi\` を強化

これだけで、深いパス移動のストレスが一気に減ります。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "教程",
    primaryKeyword: "zoxide mac インストール",
    tags: [
      "zoxide mac インストール",
      "Macにzoxideをインストール",
      "zoxide init",
      "zoxide 対応シェル",
      "zoxide タブ補完",
      "zoxide オートコンプリート",
    ],
    readTime: 7,
  },
  {
    id: "23",
    slug: "zoxide-alternatives-comparison-open-source",
    locales: ["en"],
    alternateSlugs: {
      zh: "zoxide-tidai-autojump-z-fasd-zlua",
      ja: "zoxide-daitai-autojump-z-fasd-zlua",
    },
    title:
      "Alternatives to zoxide: autojump vs zoxide vs z.lua vs fasd (plus open source & shell support)",
    excerpt:
      "Compare zoxide with popular directory-jump alternatives, learn what problems each solves, and understand zoxide’s open-source story and shell compatibility.",
    content: `# Alternatives to zoxide: what to use (and when)

If you’re searching **“what are the alternatives to zoxide”**, you’re already convinced of the bigger idea: **directory jumping** is worth it. The remaining question is which tool fits your workflow.

zoxide is popular because it’s fast, cross-shell, and modern—but it’s not the only option. This post compares zoxide with common alternatives (autojump, “z”, fasd, z.lua, and plain fzf workflows), and also answers the “meta” questions that affect adoption: **is zoxide open source** and **what shell does zoxide work with**.

---

## Why directory jump tools exist (the shared problem)

All of these tools exist because \`cd\` scales poorly with real developer workflows:

- deep repo structures,
- multiple projects and environments,
- frequent context switching,
- and humans remembering intent rather than paths.

So the category exists to turn navigation into: “jump where I mean.”

---

## zoxide at a glance

zoxide describes itself as “a smarter cd command,” inspired by older tools like \`z\` and autojump.
Its core idea is simple:

- record directories you visit,
- rank them by your behavior (frequency + recency),
- jump by fuzzy keywords via \`z\` (and optionally \`zi\`).

This “learned ranking” is what makes it feel like it gets better over time.

---

## Alternatives to zoxide (with practical trade-offs)

### 1) autojump

**autojump** is one of the classic directory jumpers. It’s been around a long time, and many people adopted it early. Reasons you might still choose it:

- it’s widely packaged,
- it has lots of community snippets,
- it’s “good enough” for many workflows.

Reasons people migrate away:

- zoxide is often faster and tends to feel more modern,
- shell integration and cross-platform tooling can be smoother in zoxide,
- many users prefer zoxide’s defaults and integrations.

zoxide also supports importing data from autojump, which helps with migration.

### 2) “z” (the original z.sh / rupa/z)

The original **\`z\`** scripts are lightweight and simple. They’re often implemented as shell scripts with minimal dependencies. The upside is simplicity; the downside is that the ecosystem is fragmented, and features differ across forks. If you love minimalism and your shell setup is stable, the original “z” can be enough.

zoxide is explicitly inspired by \`z\` and modernizes the concept.

### 3) fasd

**fasd** is an older but powerful tool that ranks files and directories (not just directories). If you want “jump + open files” style workflows, fasd can be attractive. However, some users find its behavior and setup less straightforward, and they prefer a dedicated directory jumper plus separate tools for files.

### 4) z.lua

**z.lua** is popular among users who like Lua-based tooling and want extensive configuration knobs. It’s fast and flexible, and it’s a strong choice if you already live in a Lua ecosystem (like Neovim-heavy setups). The trade-off is: you may end up tuning a lot.

### 5) fzf-only directory workflows

Some people skip “learning” entirely and rely on fzf to search directories on demand. This can work well if you don’t want a database, or if you prefer explicit interactive selection every time.

Trade-off: you lose the “it learns my habits” ranking that makes zoxide fast with a few letters.

---

## What shell does zoxide work with?

zoxide supports all major shells, and the official documentation provides init snippets for each one.
In practice, if your workflow includes Bash, Zsh, Fish, PowerShell, or Nushell, zoxide is usually a safe bet.

This shell breadth is one reason it’s widely recommended as the “default” directory jumper today.

---

## Is zoxide open source? (and why it matters)

Yes—zoxide is open source on GitHub and distributed under the MIT license.

For teams and long-lived dotfile setups, that matters because:

- you can audit what the init scripts do,
- you can pin versions,
- you can contribute fixes,
- and you aren’t betting on a closed tool disappearing.

---

## Which should you choose? A simple decision framework

Choose **zoxide** if you want:

- strong cross-shell support,
- modern integrations (including fzf),
- a tool that “learns” and improves over time,
- easy onboarding and migration support.

Choose **autojump** if you want:

- a long-established, widely packaged default,
- and you already have it working everywhere.

Choose **z** (script) if you want:

- minimal dependencies and a simple mental model,
- and you’re okay with fewer modern integrations.

Choose **fasd** if you want:

- ranking for files and directories in one tool,
- and you’re comfortable with its older style.

Choose **z.lua** if you want:

- maximum configurability and a Lua-friendly ecosystem.

Choose **fzf-only** if you want:

- no learning database, always interactive search,
- and you don’t mind a couple more keystrokes per jump.

---

## Wrap-up

The directory-jump category is mature, and there are several good options. But zoxide has become a common recommendation because it combines:

- “learned” ranking,
- broad shell support,
- and a modern open-source project surface.

If you’re on the fence, install it, enable \`zoxide init\`, and try it for a week. The fastest test is always real usage.
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "对比",
    primaryKeyword: "zoxide alternatives",
    tags: [
      "what are the alternatives to zoxide",
      "autojump vs zoxide",
      "is zoxide open source",
      "what shell does zoxide work with",
    ],
    readTime: 6,
  },
  {
    id: "24",
    slug: "zoxide-tidai-autojump-z-fasd-zlua",
    locales: ["zh"],
    alternateSlugs: {
      en: "zoxide-alternatives-comparison-open-source",
      ja: "zoxide-daitai-autojump-z-fasd-zlua",
    },
    title:
      "zoxide 替代品有哪些？autojump、z、fasd、z.lua 对比：以及 zoxide 是否开源、支持哪些 Shell",
    excerpt:
      "围绕 zoxide 替代品、autojump vs zoxide、zoxide 开源吗、zoxide 支持哪些 shell，给出实际选型建议与迁移思路。",
    content: `# zoxide 替代品有哪些？autojump、z、fasd、z.lua 对比与选型

如果你在搜 **“zoxide 替代品”** 或 **“zoxide 类似工具”**，说明你已经认可一个事实：在真实的开发/运维工作流里，纯 \`cd\` 的效率上限很低。你真正纠结的是：**到底选哪一个目录跳转工具更合适**。

这篇文章会把常见候选（autojump、z、fasd、z.lua、fzf 纯交互流）放在同一张逻辑表里解释：它们解决同一类问题，但取舍不同。我们也会顺便回答几个“落地前必须确认”的问题：**zoxide 开源吗？zoxide 支持哪些 Shell？**

---

## 1) 为什么会有“目录跳转工具”这条赛道？

所有工具都在解决同一个现实：

- 目录层级深，路径长；
- 项目多、环境多、上下文切换频繁；
- 你记得“我要去 infra”，但不想记“infra 在第几层”；
- 输入成本高，Tab 补全也要一步步走树。

所以这类工具把导航从“路径输入”变成“意图跳转”。

---

## 2) zoxide 的定位：更现代、更通用的默认选择

zoxide 的定位是“更聪明的 cd”，灵感来自早期的 \`z\` 和 autojump。
它的核心逻辑可以简化为三句话：

1. 记录你进入过的目录；
2. 根据频率与最近使用情况进行排序/加权；
3. 用 \`z <关键词>\` 模糊匹配并跳转（也可用 \`zi\` 做交互选择）。

这让它很适合做“默认目录跳转工具”：轻量、跨 Shell、跨平台、学习曲线低。

---

## 3) zoxide 替代品 / 类似工具对比（优缺点说人话）

### 3.1 autojump（经典老将）

autojump 是“老牌目录跳转工具”，很多 Linux 发行版里都很好装，资料也多。适合：

- 你所在环境统一、历史包袱重，已经全员在用 autojump；
- 你只需要一个“能用就行”的跳转工具。

可能劝退的点：

- 生态与体验偏旧；
- 跨 Shell/跨平台时，你可能需要更细的折腾；
- 一些用户会更偏爱 zoxide 的默认行为与集成。

值得一提的是，zoxide 提供导入 autojump 数据的能力，迁移成本相对可控。

### 3.2 z（早期脚本流的代表）

最早的 \`z\`（各种 z.sh/fork）非常轻量，往往就是一段 shell 脚本，依赖少、心智模型简单。适合：

- 你极简主义、喜欢“少即是多”；
- 你不追求太多现代集成。

但问题也明显：脚本生态分叉多、功能差异大、维护状态不一致。zoxide 明确受其启发，并将这个思路现代化。

### 3.3 fasd（目录 + 文件一起排）

fasd 的特色是“目录和文件都能按习惯排序”。如果你希望一套工具同时覆盖：

- “跳目录”
- “跳文件并打开”

它会很有吸引力。代价是：配置/行为可能更复杂，很多人更愿意用“目录跳转 + 文件搜索”两件事分开处理。

### 3.4 z.lua（偏重可配置与扩展）

z.lua 在喜欢 Lua 生态的人群里很受欢迎（尤其 Neovim 重度用户）。它速度快、可调参数多。适合：

- 你愿意花时间调教；
- 你希望对匹配/评分策略有更细控制。

不适合的点也很直白：**你可能会把时间花在“调工具”而不是“用工具”上**。

### 3.5 fzf 纯交互流（不要学习，只要搜索）

还有一类人完全不想维护“学习数据库”，就用 fzf 每次搜索目录。优点是：

- 不依赖学习记录；
- 任何机器、任何环境都能用。

缺点是：

- 每次都需要交互搜索；
- 少了 zoxide 那种“打两三个字母就到”的学习加成。

---

## 4) zoxide 支持哪些 Shell？

zoxide 支持主流 Shell；常见如 Bash、Zsh、Fish，也能在 PowerShell、Nushell 等环境使用。
对很多团队来说，“跨 Shell 一致”是选 zoxide 的关键原因之一。

---

## 5) zoxide 开源吗？（以及为什么这很重要）

是的，zoxide 是开源项目，并使用 MIT 许可证。

对个人与团队而言，这意味着：

- 你可以审计 init 脚本到底做了什么；
- 你可以锁版本、可复现；
- 工具不会因为闭源商业策略而突然不可用；
- 有问题能提 issue/贡献修复。

---

## 6) 怎么选？给你一个“少纠结”框架

- 你要**省心通用**：选 zoxide（跨 Shell、现代、学习成本低）
- 你要**环境历史包袱最小**：现成有 autojump 就继续用
- 你要**极简脚本**：选 z（但接受功能较少与生态分叉）
- 你要**目录 + 文件一体**：考虑 fasd
- 你要**强可配置**：z.lua
- 你要**每次都交互搜索**且不想记录：fzf 纯流

---

## 总结

“目录跳转工具”这条赛道已经成熟，但 zoxide 之所以成为很多人的默认推荐，是因为它把三件事做得比较平衡：

1) 学习你的习惯（越用越准）
2) 支持主流 Shell（跨环境一致）
3) 开源 + MIT（长期可控）

如果你还在犹豫，最好的办法不是继续对比参数，而是：装上 zoxide、配好 init，用一周。目录跳转这种工具，体验胜过一切。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "对比",
    primaryKeyword: "zoxide 替代品",
    tags: [
      "zoxide 替代品",
      "zoxide 类似工具",
      "autojump vs zoxide",
      "zoxide 开源吗",
      "zoxide 支持哪些 shell",
    ],
    readTime: 6,
  },
  {
    id: "25",
    slug: "zoxide-daitai-autojump-z-fasd-zlua",
    locales: ["ja"],
    alternateSlugs: {
      en: "zoxide-alternatives-comparison-open-source",
      zh: "zoxide-tidai-autojump-z-fasd-zlua",
    },
    title:
      "zoxideの代替は？autojump・z・fasd・z.luaを比較（オープンソース/対応シェルも）",
    excerpt:
      "「zoxide 代替」「zoxide 類似 ツール」「autojump vs zoxide」「zoxide オープンソース」「zoxide 対応シェル」をまとめて比較し、選び方の軸を作る。",
    content: `# zoxideの代替は？autojump・z・fasd・z.luaを比較して選び方を整理する

「**zoxide 代替**」「**zoxide 類似 ツール**」で検索している人は、もう気づいているはずです。
ディレクトリ移動は \`cd\` だけだと遅い。深い階層・複数リポジトリ・頻繁な往復があると、入力コストが積み上がります。

では、zoxide 以外に何があるのか？ そして、どれを選べば後悔しないのか？
この記事では、よく名前が挙がる **autojump / z / fasd / z.lua / fzf中心の運用** を並べて比較しつつ、導入前に必ず確認したい **「zoxide オープンソース？」「zoxide 対応シェル？」** もあわせて解説します。

---

## 1) そもそも、なぜ代替ツールが必要？（共通の課題）

このカテゴリのツールは、同じ問題を解決します。

- 階層が深い（monorepo、IaC、複数サービス）
- 行き来が多い（infra / docs / api / client を往復）
- フルパスを覚えない（覚えているのは“意味”）
- Tab補完しても結局ツリーを辿る必要がある

目的は一つ：**「行きたい意図」でジャンプする**。

---

## 2) zoxideの立ち位置（なぜ“デフォルト候補”になりやすい？）

zoxide は「よりスマートな cd」として、\`z\` や autojump に影響を受けたプロジェクトです。
特徴をざっくり言うと：

- 移動したディレクトリを記録し、頻度や最近使用を加味してランキング化
- \`z <キーワード>\` で曖昧にジャンプ
- 必要なら \`zi\` で対話的に選ぶ（fzfと相性が良い）

「軽いのに賢い」「対応シェルが広い」「設定の正解が揃っている」点が評価されやすいです。

---

## 3) zoxideの代替（zoxide 代替 / zoxide 類似 ツール）

### 3.1 autojump（王道の古参）

autojump は昔からある定番。配布パッケージも多く、導入記事も多い。向いている人：

- すでに全環境で autojump が動いていて不満が少ない
- “枯れた”ツールが好き

一方で、よりモダンで一貫した体験を求める人は zoxide に移行することがあります。
なお zoxide は autojump のデータ取り込みもサポートしているので、移行の心理的ハードルは下がります。

### 3.2 z（スクリプト系の原点）

最初期の \`z\` 系スクリプトは依存が少なく、シンプルで軽いのが魅力。
ただし fork が多く、機能差やメンテ状況にばらつきが出やすい点は注意です。zoxide はこの思想を“現代的に実装し直した”立ち位置です。

### 3.3 fasd（ファイルも含めてランク付け）

fasd はディレクトリだけでなく、ファイルも含めてスコアリングします。
「移動 + ファイルオープン」まで一体でやりたい人には魅力的。ただし挙動が複雑に感じる人もいるので、好みが分かれます。

### 3.4 z.lua（高い柔軟性とカスタマイズ）

z.lua は高速で設定の自由度が高い。NeovimなどLua文化に馴染みがある人には強い選択肢。
一方で、自由度が高い＝調整が増えるので、「まずは手早く成果」を求める人は zoxide のほうが合うこともあります。

### 3.5 fzf中心（学習しない、毎回検索する）

「学習データベースは持ちたくない」「毎回インタラクティブで探したい」なら fzf 中心でも成立します。
ただし、zoxide のように“数文字で一発”という学習の強みは減ります。

---

## 4) zoxideはどのシェルで使える？（zoxide 対応シェル）

zoxide は主要シェルに対応しており、シェル別の \`init\` 例が提供されています。
Bash / Zsh / Fish に加えて、PowerShell や Nushell でも使えるため、複数環境を行き来する人に向いています。

---

## 5) zoxideはオープンソース？（zoxide オープンソース）

はい。zoxide は GitHub 上で開発されているオープンソースで、MITライセンスです。
長期運用する dotfiles では、この点が安心材料になります。

---

## 6) 結局どれを選ぶ？（迷わないための軸）

- **迷ったら zoxide**：対応シェルが広く、導入が安定
- **既に autojump が安定稼働**：そのままでもOK（移行は必要になってから）
- **極限まで軽く**：\`z\` スクリプト系（ただし機能差に注意）
- **ファイルも一緒にランク付け**：fasd
- **強いカスタマイズ欲**：z.lua
- **毎回インタラクティブ検索**：fzf中心

---

## まとめ

zoxide の代替は複数ありますが、zoxide が選ばれやすいのは、

- “学習”で数文字ジャンプができる
- 対応シェルが広く、導入パターンが整っている
- オープンソースで長期運用しやすい

というバランスが良いからです。迷うなら、まず zoxide を1週間使ってみるのが一番早い結論です。
`,
    date: "2026-01-10",
    author: "zoxide.org",
    category: "对比",
    primaryKeyword: "zoxide 代替",
    tags: [
      "zoxide 代替",
      "zoxide 類似 ツール",
      "autojump zoxide 比較",
      "zoxide オープンソース",
      "zoxide 対応シェル",
    ],
    readTime: 6,
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
export function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3,
  targetLocale?: string,
): BlogPost[] {
  return blogPosts
    .filter((post) => {
      // 排除当前文章
      if (post.id === currentPost.id) return false;

      // 如果提供了目标语言，且文章限定了语言，必须包含目标语言
      if (
        targetLocale &&
        post.locales &&
        !post.locales.includes(targetLocale as "zh" | "en" | "ja")
      ) {
        return false;
      }

      // 如果当前文章限定了语言，只推荐同语言的文章（保留原有逻辑作为回退）
      if (
        !targetLocale &&
        currentPost.locales &&
        !currentPost.locales.some((loc) => post.locales?.includes(loc))
      ) {
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
export function getAlternateSlug(
  slug: string,
  targetLocale: "zh" | "en" | "ja",
): string | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  // 如果文章没有语言限制，返回相同 slug
  if (!post.locales) return slug;

  // 如果目标语言已支持，返回相同 slug
  if (post.locales.includes(targetLocale)) return slug;

  // 返回配对的 slug（如果存在）
  return post.alternateSlugs?.[targetLocale] || null;
}
