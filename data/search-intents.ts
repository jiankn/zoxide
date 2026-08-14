export type SupportedLocale = 'en' | 'zh' | 'ja';

type IntentKey =
  | 'download'
  | 'quickStart'
  | 'howTo'
  | 'commands'
  | 'init'
  | 'fzf'
  | 'advanced'
  | 'troubleshooting'
  | 'commandNotFound'
  | 'noMatch'
  | 'doctor'
  | 'autojump'
  | 'alternatives'
  | 'definition';

interface RedirectRule {
  source: string;
  target: string;
  locales: readonly SupportedLocale[];
}

export interface IntentGuideLink {
  href: string;
  title: string;
  description: string;
}

const allLocales = ['en', 'zh', 'ja'] as const;

const redirectRules: readonly RedirectRule[] = [
  {
    source: '/blog/zoxide-download-guide',
    target: '/download',
    locales: allLocales,
  },
  {
    source: '/blog/quick-start',
    target: '/tutorials/quick-start',
    locales: allLocales,
  },
  {
    source: '/comparisons/autojump',
    target: '/blog/zoxide-vs-autojump',
    locales: allLocales,
  },
  {
    source: '/blog/zoxide-fzf-interactive-guide-en',
    target: '/tutorials/fzf-integration',
    locales: ['en'],
  },
  {
    source: '/blog/zoxide-fzf-interactive-guide-zh',
    target: '/tutorials/fzf-integration',
    locales: ['zh'],
  },
  {
    source: '/blog/zoxide-fzf-interactive-guide-ja',
    target: '/tutorials/fzf-integration',
    locales: ['ja'],
  },
  {
    source: '/blog/install-zoxide-mac-shell-integration-completion',
    target: '/tutorials/install-macos',
    locales: ['en'],
  },
  {
    source: '/tutorials/shell-setup',
    target: '/blog/zoxide-init-guide',
    locales: ['en'],
  },
  {
    source: '/tutorials/troubleshooting',
    target: '/blog/zoxide-not-working',
    locales: ['en'],
  },
  {
    source: '/blog/advanced-config',
    target: '/tutorials/advanced-config',
    locales: ['en'],
  },
] as const;

const primaryPaths: Record<SupportedLocale, Record<IntentKey, string>> = {
  en: {
    download: '/download',
    quickStart: '/tutorials/quick-start',
    howTo: '/blog/mastering-zoxide-smarter-cd-command',
    commands: '/blog/zoxide-commands',
    init: '/blog/zoxide-init-guide',
    fzf: '/tutorials/fzf-integration',
    advanced: '/tutorials/advanced-config',
    troubleshooting: '/blog/zoxide-not-working',
    commandNotFound: '/blog/zoxide-command-not-found',
    noMatch: '/blog/troubleshooting-zoxide-no-match-found',
    doctor: '/tools/zoxide-doctor',
    autojump: '/blog/zoxide-vs-autojump',
    alternatives: '/blog/zoxide-alternatives-comparison-open-source',
    definition: '/blog/what-is-zoxide-smarter-cd',
  },
  zh: {
    download: '/download',
    quickStart: '/tutorials/quick-start',
    howTo: '/blog/mastering-zoxide-smarter-cd-command',
    commands: '/tutorials/basic-commands',
    init: '/tutorials/shell-setup',
    fzf: '/tutorials/fzf-integration',
    advanced: '/tutorials/advanced-config',
    troubleshooting: '/tutorials/troubleshooting',
    commandNotFound: '/blog/zoxide-command-not-found',
    noMatch: '/blog/troubleshooting-zoxide-no-match-found',
    doctor: '/tools/zoxide-doctor',
    autojump: '/blog/zoxide-vs-autojump',
    alternatives: '/blog/zoxide-tidai-autojump-z-fasd-zlua',
    definition: '/blog/zoxide-shi-shenme-z-mingling-tidai-cd',
  },
  ja: {
    download: '/download',
    quickStart: '/tutorials/quick-start',
    howTo: '/blog/mastering-zoxide-smarter-cd-command',
    commands: '/blog/zoxide-commands',
    init: '/tutorials/shell-setup',
    fzf: '/tutorials/fzf-integration',
    advanced: '/tutorials/advanced-config',
    troubleshooting: '/tutorials/troubleshooting',
    commandNotFound: '/blog/zoxide-command-not-found',
    noMatch: '/blog/troubleshooting-zoxide-no-match-found',
    doctor: '/tools/zoxide-doctor',
    autojump: '/blog/zoxide-vs-autojump',
    alternatives: '/blog/zoxide-daitai-autojump-z-fasd-zlua',
    definition: '/blog/zoxide-toha-cd-no-kawari',
  },
};

const guideCopy: Record<SupportedLocale, Record<IntentKey, Omit<IntentGuideLink, 'href'>>> = {
  en: {
    download: { title: 'Download and install zoxide', description: 'Choose a verified package for your operating system and shell.' },
    quickStart: { title: 'Run the 5-minute check', description: 'Verify an existing installation with one small navigation test.' },
    howTo: { title: 'Follow the complete zoxide guide', description: 'Move from first setup to a dependable daily workflow.' },
    commands: { title: 'Use the command reference', description: 'Look up z, zi, query, add, remove, and maintenance commands.' },
    init: { title: 'Configure shell initialization', description: 'Load zoxide correctly in Bash, Zsh, Fish, PowerShell, or Nushell.' },
    fzf: { title: 'Set up interactive selection', description: 'Connect fzf and use zi when several directories match.' },
    advanced: { title: 'Tune advanced configuration', description: 'Adjust aliases, options, and workflows after the basics work.' },
    troubleshooting: { title: 'Troubleshoot zoxide', description: 'Follow a general diagnosis when zoxide is installed but not working.' },
    commandNotFound: { title: 'Fix command-not-found errors', description: 'Separate a missing binary or PATH issue from shell initialization.' },
    noMatch: { title: 'Fix no-match results', description: 'Inspect the database and improve weak or ambiguous matches.' },
    doctor: { title: 'Run the zoxide doctor', description: 'Generate a focused diagnosis from your shell and zoxide output.' },
    autojump: { title: 'Compare zoxide with autojump', description: 'Compare behavior, compatibility, and a low-risk migration path.' },
    alternatives: { title: 'Compare zoxide alternatives', description: 'Evaluate autojump, z, fasd, and z.lua for your workflow.' },
    definition: { title: 'Understand what zoxide does', description: 'Learn how its frecency-based directory ranking replaces repetitive cd use.' },
  },
  zh: {
    download: { title: '下载并安装 zoxide', description: '按操作系统和 Shell 选择经过核验的安装包。' },
    quickStart: { title: '完成 5 分钟验证', description: '用一次小型跳转测试确认现有安装是否正常。' },
    howTo: { title: '阅读完整 zoxide 使用指南', description: '从首次配置一路建立稳定的日常工作流。' },
    commands: { title: '查看命令主参考页', description: '查询 z、zi、query、add、remove 等命令。' },
    init: { title: '配置 Shell 初始化', description: '让 Bash、Zsh、Fish、PowerShell 或 Nushell 正确加载 zoxide。' },
    fzf: { title: '配置交互式选择', description: '连接 fzf，用 zi 处理多个匹配目录。' },
    advanced: { title: '调整高级配置', description: '基础功能正常后，再配置别名、选项和工作流。' },
    troubleshooting: { title: '排查 zoxide 故障', description: 'zoxide 已安装但不能正常工作时，按步骤进行通用诊断。' },
    commandNotFound: { title: '修复 command not found', description: '区分二进制文件、PATH 与 Shell 初始化问题。' },
    noMatch: { title: '修复 no match 问题', description: '检查数据库并改善无匹配或错误匹配。' },
    doctor: { title: '运行 zoxide doctor', description: '根据 Shell 和 zoxide 输出生成针对性诊断。' },
    autojump: { title: '比较 zoxide 与 autojump', description: '对比行为、兼容性以及低风险迁移方案。' },
    alternatives: { title: '比较 zoxide 替代工具', description: '评估 autojump、z、fasd 和 z.lua 是否适合你的工作流。' },
    definition: { title: '了解 zoxide 是什么', description: '理解它如何用常用度和最近使用记录减少重复 cd。' },
  },
  ja: {
    download: { title: 'zoxide をダウンロードして導入', description: 'OS とシェルに合う検証済みパッケージを選びます。' },
    quickStart: { title: '5分で動作確認', description: '小さな移動テストで既存のインストールを確認します。' },
    howTo: { title: 'zoxide の完全ガイド', description: '初期設定から安定した日常運用まで順番に進めます。' },
    commands: { title: 'コマンドリファレンス', description: 'z、zi、query、add、remove などの使い方を確認します。' },
    init: { title: 'シェル初期化を設定', description: 'Bash、Zsh、Fish、PowerShell、Nushell で正しく読み込みます。' },
    fzf: { title: '対話選択を設定', description: 'fzf を接続し、候補が複数あるときに zi で選びます。' },
    advanced: { title: '高度な設定を調整', description: '基本動作の確認後にエイリアスやオプションを調整します。' },
    troubleshooting: { title: 'zoxide をトラブルシュート', description: '導入済みなのに動かない場合の一般診断を進めます。' },
    commandNotFound: { title: 'command not found を修正', description: '実行ファイル、PATH、シェル初期化を切り分けます。' },
    noMatch: { title: 'no match を修正', description: 'データベースを確認し、弱い一致や誤一致を改善します。' },
    doctor: { title: 'zoxide doctor を実行', description: 'シェルと zoxide の出力から絞り込んだ診断を作ります。' },
    autojump: { title: 'zoxide と autojump を比較', description: '挙動、互換性、安全な移行手順を比較します。' },
    alternatives: { title: 'zoxide の代替を比較', description: 'autojump、z、fasd、z.lua を用途別に評価します。' },
    definition: { title: 'zoxide の仕組みを理解', description: '利用頻度と最近の履歴で cd の反復を減らす仕組みを学びます。' },
  },
};

function normalizePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
}

export function asSupportedLocale(locale: string): SupportedLocale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en';
}

export function localizePath(locale: string, path: string): string {
  const supportedLocale = asSupportedLocale(locale);
  const normalized = normalizePath(path);
  if (normalized === '/') return supportedLocale === 'en' ? '/' : `/${supportedLocale}/`;
  const localized = supportedLocale === 'en' ? normalized : `/${supportedLocale}${normalized}`;
  return `${localized}/`;
}

export function getContentRedirect(locale: string, path: string): string | null {
  const supportedLocale = asSupportedLocale(locale);
  const normalized = normalizePath(path);
  const rule = redirectRules.find((candidate) => (
    candidate.source === normalized && candidate.locales.includes(supportedLocale)
  ));

  return rule?.target ?? null;
}

export function isRedirectedContentPath(locale: string, path: string): boolean {
  return getContentRedirect(locale, path) !== null;
}

export function getPrimaryPaths(locale: string): Record<IntentKey, string> {
  return primaryPaths[asSupportedLocale(locale)];
}

function getIntentSequence(path: string): IntentKey[] {
  if (path.includes('command-not-found')) return ['commandNotFound', 'init', 'download', 'troubleshooting'];
  if (path.includes('no-match')) return ['noMatch', 'troubleshooting', 'doctor', 'fzf'];
  if (path.includes('not-working') || path.includes('troubleshooting')) return ['troubleshooting', 'commandNotFound', 'noMatch', 'doctor'];
  if (path.includes('fzf')) return ['fzf', 'commands', 'init', 'noMatch', 'advanced'];
  if (path.includes('init') || path.includes('shell-setup') || path.includes('alias')) return ['init', 'commandNotFound', 'fzf', 'advanced'];
  if (path.includes('download') || path.includes('install') || path.includes('linux') || path.includes('ubuntu') || path.includes('mac')) return ['download', 'init', 'quickStart', 'commandNotFound'];
  if (path.includes('autojump') || path.includes('alternative') || path.includes('tidai') || path.includes('daitai') || path.includes('comparison')) return ['autojump', 'alternatives', 'download', 'definition'];
  if (path.includes('advanced') || path.includes('performance')) return ['advanced', 'commands', 'init', 'fzf'];
  if (path.includes('commands') || path.includes('basic') || path.includes('quick-start') || path.includes('mastering') || path.includes('stop-using') || path.includes('what-is') || path.includes('shi-shenme') || path.includes('toha')) return ['quickStart', 'howTo', 'commands', 'init', 'fzf'];
  return ['quickStart', 'commands', 'init', 'fzf'];
}

export function getIntentGuideLinks(locale: string, currentPath: string): IntentGuideLink[] {
  const supportedLocale = asSupportedLocale(locale);
  const current = normalizePath(currentPath);

  return getIntentSequence(current)
    .map((key) => ({
      href: primaryPaths[supportedLocale][key],
      ...guideCopy[supportedLocale][key],
    }))
    .filter((guide, index, guides) => (
      normalizePath(guide.href) !== current
      && !isRedirectedContentPath(supportedLocale, guide.href)
      && guides.findIndex((candidate) => candidate.href === guide.href) === index
    ))
    .slice(0, 4);
}
