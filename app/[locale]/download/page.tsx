import CodeBlock from '@/components/CodeBlock/CodeBlock';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { Link, routing } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const englishDownloadCopy = {
  title: 'Zoxide download and install for Linux, macOS and Windows',
  description: 'Install zoxide from official upstream sources on Linux, macOS, or Windows. Verify the binary, then add the shell integration that creates z and zi.',
  upstream: 'Official upstream repository',
  installMethods: 'Choose an installation path',
  shellTitle: 'Add zoxide to your shell',
  shellDescription: 'Installing the binary does not create z or zi. Add the line for the shell you actually use, save the profile, and open a new terminal.',
  shellTip: 'Keep the initialization line near the end of the shell profile. Zsh users should place it after compinit when completions are enabled.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tDownload = await getTranslations('download');
  return generateMultilingualMetadata(
    locale,
    '/download',
    {
      title: locale === 'en' ? englishDownloadCopy.title : t('titles.download'),
      description: locale === 'en' ? englishDownloadCopy.description : tDownload('description'),
      keywords: t('install'),
    }
  );
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('download');
  const copy = locale === 'zh'
    ? { guide: '查看完整安装教程 →', next: '安装完成后做什么？', nextDescription: '先验证程序和 Shell 初始化，再学习常用命令；如果失败，按诊断顺序排查。', quick: '快速上手教程', shell: 'Shell 配置教程', troubleshoot: 'command not found 排查' }
    : locale === 'ja'
      ? { guide: '詳しいインストール手順 →', next: 'インストール後の次の手順', nextDescription: 'バイナリとシェル初期化を確認してから基本コマンドへ進み、失敗した場合は順番に切り分けます。', quick: 'クイックスタート', shell: 'シェル設定', troubleshoot: 'command not found の解決' }
      : { guide: 'Open the complete install guide →', next: 'What to do after installation', nextDescription: 'Verify the binary and shell initialization, learn the core commands, or follow the diagnostic path if a check fails.', quick: 'Quick-start tutorial', shell: 'Shell setup guide', troubleshoot: 'Fix command not found' };

  const installers = locale === 'en'
    ? [
      {
        name: 'Homebrew',
        platform: 'macOS',
        command: 'brew install zoxide',
        description: 'Homebrew is one of the package managers documented by the upstream project for macOS.',
        guideHref: '/tutorials/install-macos',
        language: 'bash',
        prompt: 'user@mac:~$',
      },
      {
        name: 'Winget',
        platform: 'Windows',
        command: 'winget install ajeetdsouza.zoxide',
        description: 'Winget is the upstream project\'s recommended installation path for Windows.',
        guideHref: '/tutorials/install-windows',
        language: 'powershell',
        prompt: 'PS C:\\>',
      },
      {
        name: 'Install script',
        platform: 'Linux and WSL',
        command: 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh',
        description: 'The upstream project recommends its install script for Linux and WSL.',
        guideHref: '/tutorials/install-ubuntu',
        language: 'bash',
        prompt: 'user@linux:~$',
      },
    ]
    : [
      {
        name: 'Homebrew',
        platform: t('installers.homebrew.platform'),
        command: 'brew install zoxide',
        description: t('installers.homebrew.description'),
        guideHref: '/tutorials/install-macos',
        language: 'bash',
        prompt: 'user@dev:~$',
      },
      {
        name: 'Scoop',
        platform: t('installers.scoop.platform'),
        command: 'scoop install zoxide',
        description: t('installers.scoop.description'),
        guideHref: '/tutorials/install-windows',
        language: 'bash',
        prompt: 'user@dev:~$',
      },
      {
        name: 'Cargo',
        platform: t('installers.cargo.platform'),
        command: 'cargo install zoxide --locked',
        description: t('installers.cargo.description'),
        guideHref: '/tutorials/quick-start',
        language: 'bash',
        prompt: 'user@dev:~$',
      },
    ];

  const pageTitle = locale === 'en' ? englishDownloadCopy.title : t('title');
  const pageDescription = locale === 'en' ? englishDownloadCopy.description : t('description');

  const shellConfigs = [
    {
      name: 'zsh',
      command: 'eval "$(zoxide init zsh)"',
    },
    {
      name: 'bash',
      command: 'eval "$(zoxide init bash)"',
    },
    {
      name: 'fish',
      command: 'zoxide init fish | source',
    },
    {
      name: 'PowerShell',
      command: 'Invoke-Expression (& { (zoxide init powershell | Out-String) })',
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/download" currentLabel={pageTitle} />
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-gray-600">
            {pageDescription}{' '}
            <a
              href="https://github.com/ajeetdsouza/zoxide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {locale === 'en' ? englishDownloadCopy.upstream : t('githubLink')}
            </a>
            {'.'}
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? englishDownloadCopy.installMethods : t('installMethods.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {installers.map((installer, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#37352F] mb-2">
                  {installer.platform}
                </h3>
                <CodeBlock
                  code={installer.command}
                  language={installer.language}
                  showPrompt={true}
                  prompt={installer.prompt}
                />
                <p className="text-xs text-[#6a6968]">
                  {installer.description}
                </p>
                <Link href={installer.guideHref} className="inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
                  {copy.guide}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {locale === 'en' && (
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-950">Verify the binary before editing your shell profile</h2>
            <p className="mt-3 leading-7 text-gray-700">
              Open a new terminal and run the version check below. If it prints a version, the binary is on your PATH. If it fails, fix the installation first. Shell configuration cannot repair a missing executable.
            </p>
            <div className="mt-5 max-w-2xl">
              <CodeBlock code="zoxide --version" language="bash" showPrompt={true} />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              This site is an independent documentation project and does not distribute zoxide binaries. Check the{' '}
              <a href="https://github.com/ajeetdsouza/zoxide#installation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline hover:text-blue-900">
                current upstream installation list
              </a>{' '}
              before upgrading or applying one setup to several machines.
            </p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? englishDownloadCopy.shellTitle : t('shellConfig.title')}
          </h2>
          <p className="text-gray-600 mb-4">
            {locale === 'en' ? englishDownloadCopy.shellDescription : t('shellConfig.description')}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {shellConfigs.map((config, index) => {
              // 根据 Shell 类型确定语言和提示符
              const language = config.name === 'PowerShell' ? 'powershell' :
                config.name === 'fish' ? 'fish' : 'bash';
              const prompt = config.name === 'PowerShell' ? 'PS C:\\>' : 'user@dev:~$';

              return (
                <div key={index} className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#37352F] mb-2">
                    {config.name}
                  </h3>
                  <CodeBlock
                    code={config.command}
                    language={language}
                    showPrompt={true}
                    prompt={prompt}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              {locale === 'en' ? englishDownloadCopy.shellTip : t('shellConfig.tip')}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{copy.next}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">{copy.nextDescription}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link href="/tutorials/quick-start" className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.quick} →</Link>
            <Link href="/tutorials/shell-setup" className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.shell} →</Link>
            <Link href="/blog/zoxide-command-not-found" className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.troubleshoot} →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

