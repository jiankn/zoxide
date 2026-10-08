import { Link, routing } from '@/i18n/routing';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getPrimaryPaths } from '@/data/search-intents';

// 以下终端输出均来自 2026-10-08 的真实运行：
// Linux 场景在 GitHub Actions ubuntu-latest（Ubuntu 24.04.5）上用 `npx github:jiankn/zoxide-doctor` 运行，
// 家目录 /home/runner/work/_temp/home 缩写为 ~；Windows 场景在 Windows 11 + PowerShell 7.6.6 上运行。
const outputs = {
  notInstalled: `zoxide-doctor: error
[PASS] Shell: bash via SHELL
[FAIL] zoxide was not found on PATH
[INFO] fzf is not on PATH; interactive selection is optional

Guides:
- Install zoxide: https://zoxide.org/download/
- Optional fzf integration: https://zoxide.org/tutorials/fzf-integration/
- Troubleshoot zoxide command not found: https://zoxide.org/blog/zoxide-command-not-found/`,
  installScript: `zoxide is installed!
Note: ~/.local/bin is not on your $PATH. zoxide will not work unless it is added to $PATH.`,
  notConfigured: `zoxide-doctor: warning
[PASS] Shell: bash via SHELL
[PASS] Found zoxide 0.10.0
[PASS] zoxide generated initialization code for bash
[WARN] No active zoxide initialization found in ~/.bashrc
       Add: eval "$(zoxide init bash)"
[INFO] fzf is not on PATH; interactive selection is optional

Guides:
- Configure shell integration: https://zoxide.org/tutorials/shell-setup/
- Optional fzf integration: https://zoxide.org/tutorials/fzf-integration/`,
  healthy: `zoxide-doctor: healthy
[PASS] Shell: bash via SHELL
[PASS] Found zoxide 0.10.0
[PASS] zoxide generated initialization code for bash
[PASS] Active zoxide initialization found in ~/.bashrc
[INFO] fzf is not on PATH; interactive selection is optional

Guides:
- Optional fzf integration: https://zoxide.org/tutorials/fzf-integration/`,
  noShell: `zoxide-doctor: warning
[WARN] Could not detect a supported shell; use --shell bash|zsh|fish|powershell|nushell|elvish|tcsh|xonsh|posix
[PASS] Found zoxide 0.10.0
[INFO] fzf is not on PATH; interactive selection is optional`,
  windowsDetect: `[PASS] Shell: powershell via PSModulePath (low-confidence detection; use --shell to override)`,
  badArg: `Unsupported shell: cmd
Run \`zoxide-doctor --help\` for usage.`,
  json: `{
  "status": "healthy",
  "shell": { "shell": "powershell", "source": "--shell", "confidence": "high" },
  "platform": "win32",
  "checks": [
    { "id": "shell", "level": "pass", "message": "Shell: powershell via --shell" },
    { "id": "binary", "level": "pass", "message": "Found zoxide 0.10.0",
      "path": "C:\\\\Users\\\\<you>\\\\AppData\\\\Local\\\\Microsoft\\\\WinGet\\\\Links\\\\zoxide.EXE" },
    { "id": "init-output", "level": "pass", "message": "zoxide generated initialization code for powershell" },
    { "id": "shell-config", "level": "pass", "message": "Active zoxide initialization found in ...\\\\Microsoft.PowerShell_profile.ps1" },
    { "id": "fzf", "level": "info", "message": "fzf is not on PATH; interactive selection is optional" }
  ],
  "recommendations": [
    { "title": "Optional fzf integration", "url": "https://zoxide.org/tutorials/fzf-integration/",
      "reason": "Install fzf if you want interactive directory selection." }
  ]
}`,
  promptOverride: `# Microsoft.PowerShell_profile.ps1
Invoke-Expression (& { (zoxide init powershell | Out-String) })
# a prompt theme loaded after zoxide
function prompt { "THEME> " }

zoxide-doctor: healthy
[PASS] Shell: powershell via --shell
[PASS] Found zoxide 0.10.0
[PASS] zoxide generated initialization code for powershell
[PASS] Active zoxide initialization found in ...\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
[INFO] fzf is not on PATH; interactive selection is optional

Guides:
- Optional fzf integration: https://zoxide.org/tutorials/fzf-integration/`,
  manual: `command -v zoxide          # binary on PATH?
zoxide --version           # binary runs?
zoxide init bash >/dev/null && echo ok   # init code for this shell?
grep -n "zoxide init" ~/.bashrc ~/.bash_profile ~/.profile 2>/dev/null   # profile line present?
command -v fzf             # optional picker?`,
};

// 各 Shell 扫描的配置文件，与 zoxide-doctor 0.1.0 源码 configCandidates() 一致
const profileRows: Array<[string, string]> = [
  ['bash', '~/.bashrc, ~/.bash_profile, ~/.profile'],
  ['zsh', '~/.zshrc, ~/.zprofile'],
  ['fish', '~/.config/fish/config.fish'],
  ['powershell', 'Documents/PowerShell/Microsoft.PowerShell_profile.ps1, Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1'],
  ['nushell', '~/.config/nushell/config.nu'],
  ['elvish', '~/.config/elvish/rc.elv'],
  ['tcsh', '~/.tcshrc, ~/.cshrc'],
  ['xonsh', '~/.xonshrc'],
  ['posix', '~/.profile'],
];

type Scenario = { title: string; output: keyof typeof outputs; body: string; fix?: string };

type Copy = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  disclaimer: string;
  testedNote: string;
  runTitle: string;
  runIntro: string;
  runTiming: string;
  checksTitle: string;
  checks: string[];
  commentNote: string;
  scenariosTitle: string;
  scenariosIntro: string;
  scenarios: Scenario[];
  detectTitle: string;
  detectBody: string;
  exitTitle: string;
  exitIntro: string;
  exitRows: Array<[string, string]>;
  exitArgNote: string;
  jsonTitle: string;
  jsonIntro: string;
  profilesTitle: string;
  profilesIntro: string;
  profileShell: string;
  profileFiles: string;
  limitsTitle: string;
  limitsIntro: string;
  limits: Array<{ title: string; body: string; linkLabel?: string; linkKey?: 'windows' | 'macos' }>;
  manualTitle: string;
  manualIntro: string;
  privacyTitle: string;
  privacy: string;
  nextTitle: string;
  troubleshoot: string;
  source: string;
  upstream: string;
};

const copy: Record<string, Copy> = {
  en: {
    title: 'zoxide-doctor: check zoxide installation and shell setup',
    description: 'Run a dependency-free diagnostic CLI for zoxide PATH, version, shell initialization, profile configuration, and optional fzf integration.',
    eyebrow: 'Independent developer tool',
    intro: 'zoxide-doctor turns the usual manual troubleshooting commands into one repeatable report. It works on Linux, macOS, and Windows and supports Bash, Zsh, Fish, PowerShell, Nushell, Elvish, Tcsh, Xonsh, and POSIX shells.',
    disclaimer: 'This community tool is not affiliated with or endorsed by Ajeet D\'Souza or the official zoxide project.',
    testedNote: 'Every report on this page is real output from zoxide-doctor 0.1.0, run on October 8, 2026 on Ubuntu 24.04.5 (GitHub Actions runner) and on Windows 11 with PowerShell 7.6.6. Long paths are shortened to ~ or ..., and the JSON example has its line breaks condensed; nothing else was edited.',
    runTitle: 'Run from GitHub',
    runIntro: 'Node.js 18 or newer is required. The command installs the public repository package temporarily and runs the diagnostic locally.',
    runTiming: 'In our test the first run, including the download, took about 2.2 seconds on the Linux runner and a repeat run about 1 second. Running the script directly with Node took a median of 114 ms on Windows.',
    checksTitle: 'What the diagnostic checks',
    checks: [
      'The zoxide executable can be resolved from PATH and reports a version.',
      'zoxide can generate initialization code for the selected shell.',
      'A conventional shell profile contains an active zoxide init line.',
      'The optional fzf executable is available for interactive selection.',
    ],
    commentNote: 'A commented-out line such as # eval "$(zoxide init bash)" does not count as active. We tested this: with only a commented init line in the profile, the report stayed at WARN.',
    scenariosTitle: 'Reading the report: five real situations',
    scenariosIntro: 'The first line is the overall status: healthy, warning, or error. Each following line is one check. These are the situations we reproduced, in the order people usually run into them.',
    scenarios: [
      {
        title: '1. zoxide is not installed',
        output: 'notInstalled',
        body: 'The only FAIL is the binary check, so every later check is skipped. The guides at the bottom point to the install page and the command-not-found guide.',
      },
      {
        title: '2. Installed with the official script, but not on PATH',
        output: 'installScript',
        body: 'The official install script puts zoxide in ~/.local/bin and prints this note when that folder is missing from PATH. zoxide-doctor run in the same shell returned exactly the same FAIL as scenario 1, because it only looks where your shell looks.',
        fix: 'export PATH="$HOME/.local/bin:$PATH"   # add to ~/.bashrc, then open a new terminal',
      },
      {
        title: '3. On PATH, but the shell is not configured',
        output: 'notConfigured',
        body: 'The binary works and can generate init code, but no profile loads it, so the z command does not exist yet. The Add line is the exact command for the detected shell.',
      },
      {
        title: '4. Everything required is in place',
        output: 'healthy',
        body: 'healthy means every required check passed. fzf stays at INFO because it is optional; once fzf was installed, the line changed to [PASS] Optional fzf integration is available.',
      },
      {
        title: '5. The shell cannot be detected',
        output: 'noShell',
        body: 'zoxide-doctor reads the SHELL variable (and NU_VERSION, XONSH_VERSION, ELVISH_VERSION). With none of them set it cannot pick a profile, so it skips the init and profile checks and asks you to pass --shell.',
      },
    ],
    detectTitle: 'Shell detection on Windows',
    detectBody: 'Windows terminals usually do not set SHELL. When PSModulePath is present, zoxide-doctor assumes PowerShell but marks the guess as low confidence. If you use Git Bash, WSL or Nushell on Windows, pass --shell so the right profile is checked.',
    exitTitle: 'Exit codes',
    exitIntro: 'The exit code makes the report usable in setup scripts and CI checks.',
    exitRows: [
      ['0', 'healthy: all required checks passed'],
      ['1', 'warning or error: at least one WARN or FAIL'],
      ['2', 'invalid arguments, such as an unsupported shell name'],
    ],
    exitArgNote: 'For example, --shell cmd prints:',
    jsonTitle: 'JSON output',
    jsonIntro: 'Add --json to get the same report as structured data. Each check has a stable id (shell, binary, init-output, shell-config, fzf) and a level (pass, warn, fail, info). This is the Windows run from scenario 4, with the user name replaced by <you>:',
    profilesTitle: 'Which profile files are scanned',
    profilesIntro: 'zoxide-doctor only opens these files, in this order, and stops at the first one that contains an active init line. Use --no-config-scan to skip this step entirely.',
    profileShell: 'Shell',
    profileFiles: 'Files checked',
    limitsTitle: 'What it cannot detect',
    limitsIntro: 'A healthy report means the setup steps are in place. It does not prove that zoxide is learning directories. We reproduced three cases where the report is misleading:',
    limits: [
      {
        title: 'Another tool replaces the prompt after zoxide (PowerShell)',
        body: 'On PowerShell, zoxide records directories from the prompt function. When a theme redefines prompt after the init line, zoxide stops learning, but the profile still contains an active init line, so the report says healthy. Keep the zoxide line at the very end of the profile.',
        linkLabel: 'See the tested Windows guide',
        linkKey: 'windows',
      },
      {
        title: 'The init line is only in ~/.bash_profile',
        body: 'With the init line only in ~/.bash_profile, the report was healthy. Most Linux terminal emulators start non-login interactive shells, which read ~/.bashrc and not ~/.bash_profile, so z can still be missing there. Put the line in ~/.bashrc unless you know your terminal starts login shells.',
      },
      {
        title: 'Configuration split into other files',
        body: 'Only the files in the table above are read. If your ~/.zshrc sources a separate file that holds the init line, the report shows WARN even though zoxide works. In zsh, zoxide itself prints "detected a possible configuration issue" when its hook is removed later in the startup files.',
        linkLabel: 'See the tested macOS guide',
        linkKey: 'macos',
      },
    ],
    manualTitle: 'The same checks by hand',
    manualIntro: 'zoxide-doctor bundles these commands, adds the correct init line for your shell, and turns the result into one status. If you cannot run Node.js, they are the manual equivalent for bash:',
    privacyTitle: 'Local and dependency-free',
    privacy: 'The CLI has no runtime dependencies and makes no network requests. It reads only conventional profile paths on the local machine unless configuration scanning is disabled.',
    nextTitle: 'Documentation and source',
    troubleshoot: 'Read the zoxide command not found guide',
    source: 'View zoxide-doctor source code',
    upstream: 'Visit the official zoxide repository',
  },
  zh: {
    title: 'zoxide-doctor：检查 zoxide 安装与 Shell 配置',
    description: '运行零依赖诊断 CLI，检查 zoxide 的 PATH、版本、Shell 初始化、配置文件和可选 fzf 集成。',
    eyebrow: '独立开发者工具',
    intro: 'zoxide-doctor 把常见的手动排查命令整理成一份可重复运行的报告。支持 Linux、macOS、Windows，以及 Bash、Zsh、Fish、PowerShell、Nushell、Elvish、Tcsh、Xonsh 和 POSIX Shell。',
    disclaimer: '这是独立社区工具，与 Ajeet D\'Souza 或 zoxide 官方项目没有隶属、赞助或背书关系。',
    testedNote: '本页所有报告都是 zoxide-doctor 0.1.0 的真实输出，于 2026 年 10 月 8 日分别在 Ubuntu 24.04.5（GitHub Actions 运行器）和 Windows 11 + PowerShell 7.6.6 上运行。较长的路径缩写为 ~ 或 ...，JSON 示例合并了换行，其余内容未做改动。',
    runTitle: '从 GitHub 运行',
    runIntro: '需要 Node.js 18 或更高版本。下面的命令会临时安装公开仓库中的包，并在本地运行诊断。',
    runTiming: '实测中，Linux 运行器上第一次运行（含下载）约 2.2 秒，再次运行约 1 秒；在 Windows 上直接用 Node 运行脚本，耗时中位数为 114 ms。',
    checksTitle: '诊断内容',
    checks: [
      'PATH 中能否找到 zoxide，并成功输出版本。',
      'zoxide 能否为所选 Shell 生成初始化代码。',
      '常见 Shell 配置文件中是否存在有效的 zoxide init。',
      '是否安装了用于交互选择的可选 fzf。',
    ],
    commentNote: '被注释掉的行（例如 # eval "$(zoxide init bash)"）不算有效。我们测试过：配置文件里只有一行被注释的初始化命令时，报告仍为 WARN。',
    scenariosTitle: '看懂报告：五种真实情况',
    scenariosIntro: '第一行是总体状态：healthy（正常）、warning（警告）或 error（错误）。后面每一行是一项检查。下面是我们复现过的情况，按大家通常遇到的先后排列。',
    scenarios: [
      {
        title: '1. 还没安装 zoxide',
        output: 'notInstalled',
        body: '唯一的 FAIL 是程序检查，所以后面的检查都被跳过。底部的指南链接指向安装页和 command not found 排查指南。',
      },
      {
        title: '2. 用官方脚本装好了，但不在 PATH 里',
        output: 'installScript',
        body: '官方安装脚本会把 zoxide 放进 ~/.local/bin，如果这个目录不在 PATH 里，脚本会打印上面这条提示。在同一个 Shell 里运行 zoxide-doctor，得到的 FAIL 与情况 1 完全相同，因为它只在你的 Shell 会找的地方找。',
        fix: 'export PATH="$HOME/.local/bin:$PATH"   # 加到 ~/.bashrc，然后新开一个终端',
      },
      {
        title: '3. 在 PATH 里，但 Shell 没配置',
        output: 'notConfigured',
        body: '程序能运行，也能生成初始化代码，但没有任何配置文件加载它，所以 z 命令还不存在。Add 那一行就是针对当前 Shell 的准确命令。',
      },
      {
        title: '4. 必需项全部就绪',
        output: 'healthy',
        body: 'healthy 表示所有必需检查都通过。fzf 是可选项，所以显示 INFO；装上 fzf 后，这一行变成 [PASS] Optional fzf integration is available。',
      },
      {
        title: '5. 识别不出 Shell',
        output: 'noShell',
        body: 'zoxide-doctor 通过 SHELL 变量（以及 NU_VERSION、XONSH_VERSION、ELVISH_VERSION）判断 Shell。这些都没设置时，它不知道该查哪个配置文件，于是跳过初始化和配置文件检查，提示你用 --shell 指定。',
      },
    ],
    detectTitle: 'Windows 上的 Shell 识别',
    detectBody: 'Windows 终端通常不设置 SHELL。存在 PSModulePath 时，zoxide-doctor 会假定是 PowerShell，但会标注为低置信度。如果你在 Windows 上用 Git Bash、WSL 或 Nushell，请用 --shell 指定，确保检查的是正确的配置文件。',
    exitTitle: '退出码',
    exitIntro: '退出码让这份报告可以直接用在安装脚本和 CI 检查里。',
    exitRows: [
      ['0', 'healthy：所有必需检查都通过'],
      ['1', 'warning 或 error：至少有一项 WARN 或 FAIL'],
      ['2', '参数无效，例如不支持的 Shell 名称'],
    ],
    exitArgNote: '例如 --shell cmd 会输出：',
    jsonTitle: 'JSON 输出',
    jsonIntro: '加上 --json 可以得到结构化的同一份报告。每项检查都有固定的 id（shell、binary、init-output、shell-config、fzf）和级别（pass、warn、fail、info）。下面是情况 4 在 Windows 上的输出，用户名替换成了 <you>：',
    profilesTitle: '会扫描哪些配置文件',
    profilesIntro: 'zoxide-doctor 只按下表顺序打开这些文件，找到第一个含有效初始化行的文件就停止。用 --no-config-scan 可以完全跳过这一步。',
    profileShell: 'Shell',
    profileFiles: '检查的文件',
    limitsTitle: '它查不出的问题',
    limitsIntro: '报告为 healthy 只代表配置步骤都在，并不能证明 zoxide 正在记录目录。我们复现了三种报告会误导的情况：',
    limits: [
      {
        title: '其他工具在 zoxide 之后替换了提示符（PowerShell）',
        body: 'PowerShell 版 zoxide 在 prompt 函数里记录目录。如果主题在初始化行之后重新定义了 prompt，zoxide 就不再记录，但配置文件里仍有有效的初始化行，所以报告显示 healthy。请把 zoxide 那一行放在配置文件最末尾。',
        linkLabel: '查看 Windows 实测教程',
        linkKey: 'windows',
      },
      {
        title: '初始化行只写在 ~/.bash_profile 里',
        body: '初始化行只在 ~/.bash_profile 里时，报告显示 healthy。但大多数 Linux 终端启动的是非登录交互式 Shell，只读 ~/.bashrc，不读 ~/.bash_profile，所以 z 在那里可能仍然不存在。除非确定你的终端启动的是登录 Shell，否则请把这一行放进 ~/.bashrc。',
      },
      {
        title: '配置拆到了其他文件里',
        body: '它只读取上表中的文件。如果你的 ~/.zshrc 通过 source 引入另一个文件，而初始化行在那个文件里，报告会显示 WARN，尽管 zoxide 实际能用。在 zsh 里，如果 zoxide 的钩子在后续配置中被移除，zoxide 自己会打印 “detected a possible configuration issue”。',
        linkLabel: '查看 macOS 实测教程',
        linkKey: 'macos',
      },
    ],
    manualTitle: '手动完成同样的检查',
    manualIntro: 'zoxide-doctor 把下面这些命令打包在一起，给出适合你 Shell 的初始化命令，并汇总成一个状态。如果无法运行 Node.js，以下是 bash 下的手动等价做法：',
    privacyTitle: '本地运行，零运行时依赖',
    privacy: 'CLI 没有运行时依赖，也不会发起网络请求。除非关闭配置扫描，否则只读取本机常见的 Shell 配置路径。',
    nextTitle: '文档与源码',
    troubleshoot: '阅读 zoxide command not found 排查指南',
    source: '查看 zoxide-doctor 源码',
    upstream: '访问 zoxide 官方仓库',
  },
  ja: {
    title: 'zoxide-doctor：zoxide のインストールとシェル設定を診断',
    description: '依存関係のない CLI で、zoxide の PATH、バージョン、シェル初期化、プロファイル設定、fzf 連携を確認します。',
    eyebrow: '独立した開発者ツール',
    intro: 'zoxide-doctor は、手作業のトラブルシューティングを再実行可能なレポートにまとめます。Linux、macOS、Windows と主要なシェルに対応します。',
    disclaimer: 'このコミュニティツールは Ajeet D\'Souza または公式 zoxide プロジェクトとは提携しておらず、承認も受けていません。',
    testedNote: 'このページのレポートはすべて zoxide-doctor 0.1.0 の実際の出力です。2026 年 10 月 8 日に Ubuntu 24.04.5（GitHub Actions ランナー）と Windows 11 + PowerShell 7.6.6 で実行しました。長いパスは ~ または ... に短縮し、JSON の例は改行をまとめています。それ以外は編集していません。',
    runTitle: 'GitHub から実行',
    runIntro: 'Node.js 18 以降が必要です。公開リポジトリのパッケージを一時的にインストールし、ローカルで診断します。',
    runTiming: 'テストでは、Linux ランナーでの初回実行（ダウンロード込み）が約 2.2 秒、2 回目が約 1 秒でした。Windows で Node から直接スクリプトを実行した場合の中央値は 114 ms です。',
    checksTitle: '診断する項目',
    checks: [
      'PATH から zoxide を見つけ、バージョンを取得できるか。',
      '選択したシェル向けの初期化コードを生成できるか。',
      '一般的なプロファイルに有効な zoxide init 行があるか。',
      '対話選択用の任意ツール fzf が利用できるか。',
    ],
    commentNote: '# eval "$(zoxide init bash)" のようにコメントアウトされた行は有効とみなされません。プロファイルにコメント行しかない状態で試したところ、レポートは WARN のままでした。',
    scenariosTitle: 'レポートの読み方：実際の 5 つの状況',
    scenariosIntro: '1 行目は全体の状態（healthy、warning、error）です。続く各行が 1 つのチェックです。以下は再現した状況で、よく遭遇する順に並べています。',
    scenarios: [
      {
        title: '1. zoxide が未インストール',
        output: 'notInstalled',
        body: 'FAIL はバイナリのチェックだけで、以降のチェックは省略されます。下部のガイドはインストールページと command not found ガイドを示します。',
      },
      {
        title: '2. 公式スクリプトで導入したが PATH にない',
        output: 'installScript',
        body: '公式インストールスクリプトは zoxide を ~/.local/bin に置き、そのフォルダーが PATH にない場合はこの注意を表示します。同じシェルで zoxide-doctor を実行すると、状況 1 とまったく同じ FAIL になりました。シェルが探す場所だけを探すためです。',
        fix: 'export PATH="$HOME/.local/bin:$PATH"   # ~/.bashrc に追加し、新しいターミナルを開く',
      },
      {
        title: '3. PATH にはあるが、シェルが未設定',
        output: 'notConfigured',
        body: 'バイナリは動作し初期化コードも生成できますが、どのプロファイルも読み込んでいないため z コマンドはまだ存在しません。Add の行は検出したシェル用の正確なコマンドです。',
      },
      {
        title: '4. 必要な項目がすべて揃っている',
        output: 'healthy',
        body: 'healthy は必須チェックがすべて通ったことを示します。fzf は任意なので INFO のままです。fzf を入れると [PASS] Optional fzf integration is available に変わりました。',
      },
      {
        title: '5. シェルを検出できない',
        output: 'noShell',
        body: 'zoxide-doctor は SHELL 変数（および NU_VERSION、XONSH_VERSION、ELVISH_VERSION）でシェルを判断します。どれも設定されていないとプロファイルを選べないため、初期化とプロファイルのチェックを省略し、--shell の指定を求めます。',
      },
    ],
    detectTitle: 'Windows でのシェル検出',
    detectBody: 'Windows のターミナルは通常 SHELL を設定しません。PSModulePath がある場合は PowerShell と推定しますが、信頼度は低いと表示します。Windows で Git Bash、WSL、Nushell を使う場合は --shell を指定してください。',
    exitTitle: '終了コード',
    exitIntro: '終了コードにより、セットアップスクリプトや CI のチェックにそのまま使えます。',
    exitRows: [
      ['0', 'healthy：必須チェックがすべて成功'],
      ['1', 'warning または error：WARN か FAIL が 1 つ以上ある'],
      ['2', '引数が不正（未対応のシェル名など）'],
    ],
    exitArgNote: 'たとえば --shell cmd を指定すると次のように表示されます：',
    jsonTitle: 'JSON 出力',
    jsonIntro: '--json を付けると同じレポートを構造化データで得られます。各チェックには固定の id（shell、binary、init-output、shell-config、fzf）とレベル（pass、warn、fail、info）があります。以下は状況 4 の Windows での出力で、ユーザー名を <you> に置き換えています：',
    profilesTitle: 'スキャンするプロファイル',
    profilesIntro: 'zoxide-doctor は表の順にこれらのファイルだけを開き、有効な初期化行が見つかった時点で止まります。--no-config-scan でこの手順を省略できます。',
    profileShell: 'シェル',
    profileFiles: '確認するファイル',
    limitsTitle: '検出できないこと',
    limitsIntro: 'healthy は設定手順が揃っていることを示すだけで、zoxide がディレクトリを学習していることの証明ではありません。レポートが誤解を招く 3 つのケースを再現しました：',
    limits: [
      {
        title: 'zoxide の後で別のツールがプロンプトを置き換える（PowerShell）',
        body: 'PowerShell 版の zoxide は prompt 関数の中でディレクトリを記録します。初期化行の後でテーマが prompt を再定義すると学習は止まりますが、プロファイルには有効な初期化行があるため healthy と表示されます。zoxide の行はプロファイルの最後に置いてください。',
        linkLabel: 'Windows の検証ガイドを見る',
        linkKey: 'windows',
      },
      {
        title: '初期化行が ~/.bash_profile にだけある',
        body: '初期化行が ~/.bash_profile にだけある状態でも healthy でした。しかし多くの Linux ターミナルは非ログインの対話型シェルを起動し、~/.bash_profile ではなく ~/.bashrc を読むため、z が存在しない場合があります。ログインシェルを起動すると分かっている場合を除き、~/.bashrc に書いてください。',
      },
      {
        title: '設定を別ファイルに分けている',
        body: '読み取るのは上の表のファイルだけです。~/.zshrc から source する別ファイルに初期化行がある場合、zoxide が動いていてもレポートは WARN になります。zsh では、後の設定でフックが外されると zoxide 自身が「detected a possible configuration issue」と表示します。',
        linkLabel: 'macOS の検証ガイドを見る',
        linkKey: 'macos',
      },
    ],
    manualTitle: '同じチェックを手作業で行う',
    manualIntro: 'zoxide-doctor は次のコマンドをまとめ、シェルに合った初期化行を示し、結果を 1 つの状態に集約します。Node.js を使えない場合、bash での手作業の等価な手順は次のとおりです：',
    privacyTitle: 'ローカル実行、依存関係なし',
    privacy: '実行時依存関係やネットワーク通信はありません。設定スキャンを無効にしない限り、一般的なローカルプロファイルだけを読み取ります。',
    nextTitle: 'ドキュメントとソース',
    troubleshoot: 'command not found の診断ガイドを読む',
    source: 'zoxide-doctor のソースを見る',
    upstream: '公式 zoxide リポジトリを見る',
  },
};

const guidePaths = {
  windows: '/tutorials/install-windows',
  macos: '/tutorials/install-macos',
};

function Terminal({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm leading-6 text-gray-100"><code>{children}</code></pre>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = copy[locale] ?? copy.en;
  return generateMultilingualMetadata(locale, '/tools/zoxide-doctor', {
    title: content.title,
    description: content.description,
    keywords: 'zoxide doctor, zoxide command not found, zoxide PATH, zoxide shell setup, command line diagnostic tool',
  });
}

export default async function ZoxideDoctorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = copy[locale] ?? copy.en;
  const primary = getPrimaryPaths(locale);
  const canonicalUrl = locale === 'en'
    ? 'https://zoxide.org/tools/zoxide-doctor/'
    : `https://zoxide.org/${locale}/tools/zoxide-doctor/`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/tools/zoxide-doctor" currentLabel={content.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'zoxide-doctor',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Linux, macOS, Windows',
            softwareVersion: '0.1.0',
            url: canonicalUrl,
            codeRepository: 'https://github.com/jiankn/zoxide-doctor',
            license: 'https://opensource.org/license/mit',
            author: { '@type': 'Person', name: 'Jacky Jian', url: 'https://zoxide.org/about/' },
          }),
        }}
      />
      <main className="space-y-12">
        <header className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{content.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{content.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-700">{content.intro}</p>
          <p className="mt-5 max-w-4xl rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-gray-700">{content.disclaimer}</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-gray-600">{content.testedNote}</p>
        </header>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.runTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">{content.runIntro}</p>
          <Terminal>npx github:jiankn/zoxide-doctor</Terminal>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.runTiming}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.checksTitle}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {content.checks.map((item) => (
              <li key={item} className="rounded-xl border border-gray-200 bg-white p-5 leading-7 text-gray-700 shadow-sm">{item}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.commentNote}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.scenariosTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">{content.scenariosIntro}</p>
          <div className="mt-6 space-y-10">
            {content.scenarios.map((scenario) => (
              <article key={scenario.title}>
                <h3 className="text-xl font-semibold text-gray-900">{scenario.title}</h3>
                <Terminal>{outputs[scenario.output]}</Terminal>
                <p className="mt-4 max-w-4xl leading-7 text-gray-700">{scenario.body}</p>
                {scenario.fix && <Terminal>{scenario.fix}</Terminal>}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">{content.detectTitle}</h2>
          <Terminal>{outputs.windowsDetect}</Terminal>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.detectBody}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.exitTitle}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.exitIntro}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-left text-sm">
              <tbody>
                {content.exitRows.map(([code, meaning]) => (
                  <tr key={code} className="border-b border-gray-200">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">{code}</td>
                    <td className="px-4 py-3 text-gray-700">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.exitArgNote}</p>
          <Terminal>{outputs.badArg}</Terminal>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.jsonTitle}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.jsonIntro}</p>
          <Terminal>{outputs.json}</Terminal>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.profilesTitle}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.profilesIntro}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900">{content.profileShell}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{content.profileFiles}</th>
                </tr>
              </thead>
              <tbody>
                {profileRows.map(([shell, files]) => (
                  <tr key={shell} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-mono text-gray-900">{shell}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{files}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.limitsTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">{content.limitsIntro}</p>
          <div className="mt-6 space-y-8">
            {content.limits.map((limit, index) => (
              <article key={limit.title}>
                <h3 className="text-xl font-semibold text-gray-900">{limit.title}</h3>
                {index === 0 && <Terminal>{outputs.promptOverride}</Terminal>}
                <p className="mt-4 max-w-4xl leading-7 text-gray-700">{limit.body}</p>
                {limit.linkKey && limit.linkLabel && (
                  <Link href={guidePaths[limit.linkKey]} className="mt-2 inline-block font-semibold text-blue-700 underline hover:text-blue-900">
                    {limit.linkLabel}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.manualTitle}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-700">{content.manualIntro}</p>
          <Terminal>{outputs.manual}</Terminal>
        </section>

        <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900">{content.privacyTitle}</h2>
          <p className="mt-3 max-w-4xl leading-7 text-gray-700">{content.privacy}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.nextTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href={primary.commandNotFound} className="rounded-xl border border-gray-200 bg-white p-5 font-semibold text-blue-700 shadow-sm hover:border-blue-400">
              {content.troubleshoot}
            </Link>
            <a href="https://github.com/jiankn/zoxide-doctor" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-200 bg-white p-5 font-semibold text-blue-700 shadow-sm hover:border-blue-400">
              {content.source}
            </a>
            <a href="https://github.com/ajeetdsouza/zoxide" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-200 bg-white p-5 font-semibold text-blue-700 shadow-sm hover:border-blue-400">
              {content.upstream}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
