export type ComparisonSlug = 'autojump' | 'z' | 'fasd';
export type ComparisonLocale = 'en' | 'zh' | 'ja';

export interface ComparisonGuide {
  slug: ComparisonSlug;
  tool: string;
  title: string;
  description: string;
  verdict: string;
  rows: Array<{ criterion: string; zoxide: string; alternative: string }>;
  chooseZoxide: string[];
  chooseAlternative: string[];
  migration: string;
  officialUrl: string;
}

const guides: Record<ComparisonLocale, ComparisonGuide[]> = {
  en: [
    {
      slug: 'autojump',
      tool: 'autojump',
      title: 'zoxide vs autojump: which directory jumper should you use?',
      description: 'Compare zoxide and autojump by commands, ranking behavior, shell setup, migration effort, and the workflows each tool fits best.',
      verdict: 'Choose zoxide for a modern cross-shell setup, multi-term matching, and optional fzf selection. Keep autojump when it is already stable across your machines and migration would add no practical benefit.',
      rows: [
        { criterion: 'Daily command', zoxide: 'z project; zi project for an interactive list', alternative: 'j project, with jc commonly used for child directories' },
        { criterion: 'Ranking and matching', zoxide: 'Frecency-style ranking with multiple query terms', alternative: 'A learned directory database with its own matching rules' },
        { criterion: 'Runtime and setup', zoxide: 'Compiled Rust binary plus a shell initialization line', alternative: 'Python-based installation plus shell integration' },
        { criterion: 'Migration', zoxide: 'Can import autojump data before you remove the old hook', alternative: 'No migration is necessary if the current database already works for you' },
      ],
      chooseZoxide: ['You use several shells or operating systems.', 'You want zi and fzf for ambiguous matches.', 'You want to migrate without rebuilding all directory history.'],
      chooseAlternative: ['autojump is already deployed and reliable on every machine.', 'Your scripts and habits depend on the j command.', 'A tool change would not save meaningful time.'],
      migration: 'Install and initialize zoxide without removing autojump first. Import the existing database, compare several familiar queries, then remove the old shell hook only after z and zi behave as expected.',
      officialUrl: 'https://github.com/wting/autojump',
    },
    {
      slug: 'z',
      tool: 'z',
      title: 'zoxide vs z: compiled tool or minimal shell script?',
      description: 'Compare zoxide with the original z-style shell scripts by dependencies, matching, portability, configuration, and maintenance burden.',
      verdict: 'Choose zoxide when you value consistent behavior across shells and platforms. Choose a z script when minimalism matters more than interactive selection or cross-shell consistency.',
      rows: [
        { criterion: 'Implementation', zoxide: 'A compiled Rust binary with generated shell integration', alternative: 'A small shell script; behavior varies between z forks' },
        { criterion: 'Query workflow', zoxide: 'Multi-term z queries plus optional zi selection', alternative: 'A compact z command focused on learned paths' },
        { criterion: 'Portability', zoxide: 'Documented setup for Bash, Zsh, Fish, PowerShell, Nushell, and more', alternative: 'Best fit is usually a Unix-like shell supported by the chosen script' },
        { criterion: 'Operational cost', zoxide: 'One binary to upgrade plus one init line', alternative: 'Very few moving parts, but you must choose and track a particular fork' },
      ],
      chooseZoxide: ['You move between Bash, Zsh, Fish, PowerShell, or Nushell.', 'You want fuzzy interactive selection.', 'You prefer one maintained implementation instead of choosing among script forks.'],
      chooseAlternative: ['You want the smallest possible shell-only solution.', 'Your environment is stable and already has a trusted z script.', 'You do not need Windows or interactive selection.'],
      migration: 'Run both tools with different command names during evaluation. Build a small amount of zoxide history or import supported data, compare results, and remove the old hook only when the replacement is predictable.',
      officialUrl: 'https://github.com/rupa/z',
    },
    {
      slug: 'fasd',
      tool: 'fasd',
      title: 'zoxide vs fasd: directory jumping or files and directories together?',
      description: 'Compare zoxide and fasd by scope, commands, shell integration, matching behavior, and the tradeoff between a focused jumper and a broader frecency tool.',
      verdict: 'Choose zoxide for a focused, modern directory-jumping workflow. Choose fasd when ranking both files and directories in one command family is central to how you work.',
      rows: [
        { criterion: 'Scope', zoxide: 'Directories only', alternative: 'Files and directories' },
        { criterion: 'Daily commands', zoxide: 'z and zi for ranked or interactive directory jumps', alternative: 'Commands such as z, zz, f, a, s, and d cover several object types' },
        { criterion: 'Setup model', zoxide: 'Compiled binary plus shell initialization', alternative: 'Shell-oriented functions and aliases around a frecency database' },
        { criterion: 'Best fit', zoxide: 'A predictable replacement for repeated cd navigation', alternative: 'A combined find-and-access workflow for both paths and files' },
      ],
      chooseZoxide: ['Your main problem is repeated directory navigation.', 'You want broad shell and platform documentation.', 'You prefer fewer commands and a narrower mental model.'],
      chooseAlternative: ['You actively rank and open files as well as directories.', 'Your existing aliases depend on fasd command modes.', 'You accept more command surface in exchange for broader scope.'],
      migration: 'List the fasd commands and aliases you actually use before switching. Replace directory-only jumps with zoxide first; keep a separate file finder if file ranking remains important.',
      officialUrl: 'https://github.com/clvv/fasd',
    },
  ],
  zh: [
    {
      slug: 'autojump',
      tool: 'autojump',
      title: 'zoxide 与 autojump 对比：该选哪个目录跳转工具？',
      description: '从命令、排序逻辑、Shell 配置、迁移成本和适用场景对比 zoxide 与 autojump。',
      verdict: '需要现代的跨 Shell 体验、多关键词匹配和可选 fzf 选择时，优先 zoxide；如果 autojump 已经在所有设备上稳定运行，换工具没有实际收益，也可以继续保留。',
      rows: [
        { criterion: '日常命令', zoxide: 'z project；需要交互列表时用 zi project', alternative: '通常使用 j project，jc 常用于子目录' },
        { criterion: '排序与匹配', zoxide: '类似 frecency 的排序，支持多个查询片段', alternative: '维护已访问目录数据库，并使用自身匹配规则' },
        { criterion: '运行与配置', zoxide: 'Rust 编译程序，加一行 Shell 初始化', alternative: 'Python 安装，再接入 Shell' },
        { criterion: '迁移', zoxide: '移除旧钩子前可先导入 autojump 数据', alternative: '现有数据库正常时无需迁移' },
      ],
      chooseZoxide: ['你同时使用多种 Shell 或操作系统。', '你需要 zi 与 fzf 处理歧义匹配。', '你想保留原有目录历史再逐步切换。'],
      chooseAlternative: ['autojump 已在每台设备上稳定工作。', '现有脚本和习惯依赖 j 命令。', '迁移不会带来可感知的效率收益。'],
      migration: '先安装并初始化 zoxide，不要立刻删除 autojump。导入旧数据库并测试几个熟悉的查询，确认 z 和 zi 的结果符合预期后，再移除旧 Shell 钩子。',
      officialUrl: 'https://github.com/wting/autojump',
    },
    {
      slug: 'z',
      tool: 'z',
      title: 'zoxide 与 z 对比：编译工具还是极简 Shell 脚本？',
      description: '从依赖、匹配、可移植性、配置和维护成本比较 zoxide 与传统 z 脚本。',
      verdict: '在意跨 Shell、跨平台一致性时选 zoxide；如果极简比交互选择和一致性更重要，一份可信的 z 脚本仍然够用。',
      rows: [
        { criterion: '实现方式', zoxide: 'Rust 编译程序，由程序生成 Shell 集成', alternative: '小型 Shell 脚本；不同 fork 行为可能不同' },
        { criterion: '查询方式', zoxide: '支持多片段 z 查询和可选 zi 交互选择', alternative: '围绕已学习路径提供简洁的 z 命令' },
        { criterion: '可移植性', zoxide: '覆盖 Bash、Zsh、Fish、PowerShell、Nushell 等', alternative: '通常更适合所选脚本明确支持的类 Unix Shell' },
        { criterion: '运维成本', zoxide: '升级一个程序并保留一行 init', alternative: '组件很少，但要自行选择和跟踪具体 fork' },
      ],
      chooseZoxide: ['你会在多种 Shell 之间切换。', '你需要模糊交互选择。', '你希望使用一套一致实现。'],
      chooseAlternative: ['你只想要最小的 Shell 方案。', '现有环境已经有可信的 z 脚本。', '你不需要 Windows 和交互选择。'],
      migration: '评估阶段让两个工具使用不同命令名并行运行。先积累少量 zoxide 历史或导入受支持的数据，确认结果稳定后再移除旧钩子。',
      officialUrl: 'https://github.com/rupa/z',
    },
    {
      slug: 'fasd',
      tool: 'fasd',
      title: 'zoxide 与 fasd 对比：专注目录，还是同时管理文件？',
      description: '从功能范围、命令、Shell 集成与匹配方式比较 zoxide 和 fasd，判断专用目录跳转与文件目录一体化工具哪个更合适。',
      verdict: '只想解决高频目录跳转时选 zoxide；如果你的核心工作流需要同时给文件和目录排序，fasd 的范围更广。',
      rows: [
        { criterion: '范围', zoxide: '只处理目录', alternative: '同时处理文件和目录' },
        { criterion: '日常命令', zoxide: '用 z 或 zi 排序跳转、交互选择', alternative: 'z、zz、f、a、s、d 等命令覆盖不同对象' },
        { criterion: '配置模型', zoxide: '编译程序加 Shell 初始化', alternative: '围绕 frecency 数据库提供 Shell 函数与别名' },
        { criterion: '最适合', zoxide: '把重复 cd 导航变得更快、更可预测', alternative: '用一套工具查找并访问目录与文件' },
      ],
      chooseZoxide: ['你的主要问题是反复进入目录。', '你需要覆盖更多 Shell 和平台的清晰文档。', '你喜欢更少命令和更窄的心智模型。'],
      chooseAlternative: ['你确实会给文件和目录一起排序。', '已有别名依赖 fasd 的多种命令模式。', '你愿意用更大命令面换取更广范围。'],
      migration: '切换前先列出自己真正使用的 fasd 命令和别名。先用 zoxide 替换纯目录跳转；如果文件排序仍重要，再保留一个独立文件查找工具。',
      officialUrl: 'https://github.com/clvv/fasd',
    },
  ],
  ja: [
    {
      slug: 'autojump',
      tool: 'autojump',
      title: 'zoxide と autojump を比較：どちらを選ぶべきか',
      description: 'コマンド、順位付け、シェル設定、移行コスト、向いている運用から zoxide と autojump を比較します。',
      verdict: '複数シェル、複数語検索、fzf 選択を求めるなら zoxide が向きます。autojump が全端末で安定しており、変更の効果が小さいならそのまま使う選択も合理的です。',
      rows: [
        { criterion: '日常コマンド', zoxide: 'z project、対話一覧は zi project', alternative: '通常は j project、子ディレクトリには jc が使われます' },
        { criterion: '順位と一致', zoxide: 'frecency 型の順位と複数クエリ語', alternative: '訪問ディレクトリDBと独自の一致規則' },
        { criterion: '実行と設定', zoxide: 'Rust バイナリとシェル初期化1行', alternative: 'Python ベースの導入とシェル連携' },
        { criterion: '移行', zoxide: '旧フックを消す前に autojump データを取り込めます', alternative: '現在のDBが十分なら移行不要' },
      ],
      chooseZoxide: ['複数のシェルやOSを使う。', 'zi と fzf で曖昧な候補を選びたい。', '既存履歴を保って段階移行したい。'],
      chooseAlternative: ['autojump が全端末で安定している。', 'スクリプトや習慣が j に依存している。', '変更しても時間短縮がほとんどない。'],
      migration: '最初は autojump を消さずに zoxide を導入します。DBを取り込み、慣れた検索を比較し、z と zi が期待どおりになってから古いシェルフックを外します。',
      officialUrl: 'https://github.com/wting/autojump',
    },
    {
      slug: 'z',
      tool: 'z',
      title: 'zoxide と z を比較：バイナリか最小シェルスクリプトか',
      description: '依存関係、検索、移植性、設定、保守負担から zoxide と従来の z スクリプトを比較します。',
      verdict: 'シェルやOSをまたぐ一貫性なら zoxide、対話選択より最小構成を重視するなら信頼できる z スクリプトが合います。',
      rows: [
        { criterion: '実装', zoxide: 'Rust バイナリと生成されるシェル連携', alternative: '小さなシェルスクリプト。forkごとに動作差があります' },
        { criterion: '検索', zoxide: '複数語の z と任意の zi 対話選択', alternative: '学習したパスを対象にした簡潔な z' },
        { criterion: '移植性', zoxide: 'Bash、Zsh、Fish、PowerShell、Nushell など', alternative: '選んだスクリプトが対応するUnix系シェル向け' },
        { criterion: '運用負担', zoxide: '1バイナリの更新と1行のinit', alternative: '構成は小さい一方、特定forkを自分で選び追跡します' },
      ],
      chooseZoxide: ['複数シェルを行き来する。', 'ファジーな対話選択が必要。', '一つの実装で挙動をそろえたい。'],
      chooseAlternative: ['最小のシェルだけの構成がよい。', '信頼済みの z スクリプトが動いている。', 'Windowsや対話選択は不要。'],
      migration: '評価中は別のコマンド名で併用します。少量の zoxide 履歴を作るか対応データを取り込み、結果が予測できるようになってから旧フックを外します。',
      officialUrl: 'https://github.com/rupa/z',
    },
    {
      slug: 'fasd',
      tool: 'fasd',
      title: 'zoxide と fasd を比較：ディレクトリ専用か、ファイルも対象か',
      description: '対象範囲、コマンド、シェル連携、検索方式から zoxide と fasd を比較します。',
      verdict: 'ディレクトリ移動に集中するなら zoxide、ファイルとディレクトリを同じ仕組みで順位付けすることが重要なら fasd が候補です。',
      rows: [
        { criterion: '対象', zoxide: 'ディレクトリのみ', alternative: 'ファイルとディレクトリ' },
        { criterion: '日常コマンド', zoxide: 'z と zi で順位ジャンプまたは対話選択', alternative: 'z、zz、f、a、s、d など複数モード' },
        { criterion: '設定モデル', zoxide: 'コンパイル済みバイナリとシェル初期化', alternative: 'frecency DB を使うシェル関数とエイリアス' },
        { criterion: '向く用途', zoxide: '繰り返す cd 移動を速く予測しやすくする', alternative: 'ディレクトリとファイルを一つの仕組みで探して開く' },
      ],
      chooseZoxide: ['主な問題がディレクトリ移動。', '幅広いシェルとOSの説明が必要。', '少ないコマンドで覚えたい。'],
      chooseAlternative: ['ファイルもディレクトリも順位付けする。', '既存エイリアスが fasd の各モードに依存する。', '広い対象のためにコマンド数が増えてもよい。'],
      migration: '切り替え前に実際に使う fasd コマンドとエイリアスを整理します。ディレクトリ移動だけを先に zoxide へ移し、ファイル順位が必要なら別の検索手段を残します。',
      officialUrl: 'https://github.com/clvv/fasd',
    },
  ],
};

export function getComparisonGuides(locale: string) {
  const supportedLocale: ComparisonLocale = locale === 'zh' || locale === 'ja' ? locale : 'en';
  return guides[supportedLocale];
}

export function getComparisonGuide(locale: string, slug: string) {
  return getComparisonGuides(locale).find((guide) => guide.slug === slug);
}

export const comparisonSlugs: ComparisonSlug[] = ['autojump', 'z', 'fasd'];
