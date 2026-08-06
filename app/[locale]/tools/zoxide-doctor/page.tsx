import { Link, routing } from '@/i18n/routing';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { setRequestLocale } from 'next-intl/server';

type Copy = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  disclaimer: string;
  runTitle: string;
  runIntro: string;
  checksTitle: string;
  checks: string[];
  usageTitle: string;
  usageIntro: string;
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
    runTitle: 'Run from GitHub',
    runIntro: 'Node.js 18 or newer is required. The command installs the public repository package temporarily and runs the diagnostic locally.',
    checksTitle: 'What the diagnostic checks',
    checks: [
      'The zoxide executable can be resolved from PATH and reports a version.',
      'zoxide can generate initialization code for the selected shell.',
      'A conventional shell profile contains an active zoxide init line.',
      'The optional fzf executable is available for interactive selection.',
    ],
    usageTitle: 'Shell override and JSON output',
    usageIntro: 'Choose the shell explicitly when Windows or a terminal multiplexer makes automatic detection ambiguous. JSON output is suitable for support scripts and development environments.',
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
    runTitle: '从 GitHub 运行',
    runIntro: '需要 Node.js 18 或更高版本。下面的命令会临时安装公开仓库中的包，并在本地运行诊断。',
    checksTitle: '诊断内容',
    checks: [
      'PATH 中能否找到 zoxide，并成功输出版本。',
      'zoxide 能否为所选 Shell 生成初始化代码。',
      '常见 Shell 配置文件中是否存在有效的 zoxide init。',
      '是否安装了用于交互选择的可选 fzf。',
    ],
    usageTitle: '指定 Shell 与 JSON 输出',
    usageIntro: 'Windows 或终端复用器导致自动识别不明确时，可显式指定 Shell。JSON 输出适合支持脚本和开发环境使用。',
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
    runTitle: 'GitHub から実行',
    runIntro: 'Node.js 18 以降が必要です。公開リポジトリのパッケージを一時的にインストールし、ローカルで診断します。',
    checksTitle: '診断する項目',
    checks: [
      'PATH から zoxide を見つけ、バージョンを取得できるか。',
      '選択したシェル向けの初期化コードを生成できるか。',
      '一般的なプロファイルに有効な zoxide init 行があるか。',
      '対話選択用の任意ツール fzf が利用できるか。',
    ],
    usageTitle: 'シェル指定と JSON 出力',
    usageIntro: '自動検出が曖昧な場合はシェルを明示できます。JSON 出力はサポートスクリプトや開発環境で利用できます。',
    privacyTitle: 'ローカル実行、依存関係なし',
    privacy: '実行時依存関係やネットワーク通信はありません。設定スキャンを無効にしない限り、一般的なローカルプロファイルだけを読み取ります。',
    nextTitle: 'ドキュメントとソース',
    troubleshoot: 'command not found の診断ガイドを読む',
    source: 'zoxide-doctor のソースを見る',
    upstream: '公式 zoxide リポジトリを見る',
  },
};

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
  const canonicalUrl = locale === 'en'
    ? 'https://zoxide.org/tools/zoxide-doctor/'
    : `https://zoxide.org/${locale}/tools/zoxide-doctor/`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
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
          }),
        }}
      />
      <main className="space-y-12">
        <header className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{content.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{content.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-700">{content.intro}</p>
          <p className="mt-5 max-w-4xl rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-gray-700">{content.disclaimer}</p>
        </header>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.runTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">{content.runIntro}</p>
          <pre className="mt-6 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm text-gray-100"><code>npx github:jiankn/zoxide-doctor</code></pre>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.checksTitle}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {content.checks.map((item) => (
              <li key={item} className="rounded-xl border border-gray-200 bg-white p-5 leading-7 text-gray-700 shadow-sm">{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.usageTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">{content.usageIntro}</p>
          <pre className="mt-6 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm text-gray-100"><code>{`zoxide-doctor --shell zsh\nzoxide-doctor --shell fish --json\nzoxide-doctor --shell powershell --no-config-scan`}</code></pre>
        </section>

        <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900">{content.privacyTitle}</h2>
          <p className="mt-3 max-w-4xl leading-7 text-gray-700">{content.privacy}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">{content.nextTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/blog/zoxide-command-not-found" className="rounded-xl border border-gray-200 bg-white p-5 font-semibold text-blue-700 shadow-sm hover:border-blue-400">
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
