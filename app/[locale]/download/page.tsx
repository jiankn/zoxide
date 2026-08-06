import CodeBlock from '@/components/CodeBlock/CodeBlock';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { Link, routing } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

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
      title: t('titles.download'),
      description: tDownload('description'),
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

  const installers = [
    {
      name: 'Homebrew',
      platform: t('installers.homebrew.platform'),
      command: 'brew install zoxide',
      description: t('installers.homebrew.description'),
      guideHref: '/tutorials/install-macos',
    },
    {
      name: 'Scoop',
      platform: t('installers.scoop.platform'),
      command: 'scoop install zoxide',
      description: t('installers.scoop.description'),
      guideHref: '/tutorials/install-windows',
    },
    {
      name: 'Cargo',
      platform: t('installers.cargo.platform'),
      command: 'cargo install zoxide',
      description: t('installers.cargo.description'),
      guideHref: '/tutorials/quick-start',
    },
  ];

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
      <Breadcrumbs locale={locale} path="/download" currentLabel={t('title')} />
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('description')}{' '}
            <a
              href="https://github.com/ajeetdsouza/zoxide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {t('githubLink')}
            </a>
            {'.'}
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('installMethods.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {installers.map((installer, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#37352F] mb-2">
                  {installer.platform}
                </h3>
                <CodeBlock
                  code={installer.command}
                  language="bash"
                  showPrompt={true}
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

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('shellConfig.title')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('shellConfig.description')}
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
              {t('shellConfig.tip')}
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

