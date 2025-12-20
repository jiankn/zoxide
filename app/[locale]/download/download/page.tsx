import AdSlot from '@/components/AdSlot/AdSlot';
import CopyButton from './CopyButton';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

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


export default function DownloadPage() {
  const installers = [
    {
      name: 'Homebrew',
      platform: 'macOS',
      command: 'brew install zoxide',
      description: 'macOS 上最简单的安装方式',
    },
    {
      name: 'Scoop',
      platform: 'Windows',
      command: 'scoop install zoxide',
      description: 'Windows 上推荐的安装方式',
    },
    {
      name: 'Cargo',
      platform: '所有平台',
      command: 'cargo install zoxide',
      description: '需要先安装 Rust 和 Cargo',
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
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              下载 zoxide
            </h1>
            <p className="text-lg text-gray-600">
              在 macOS、Linux、Windows 上安装 zoxide。
              安装后记得初始化 Shell 配置，让 zoxide 生效。
              更多安装选项和详细文档，请查看{' '}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                官方 GitHub 仓库
              </a>
              。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="download-top" />

          {/* 安装器卡片 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              选择安装方式
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {installers.map((installer, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {installer.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {installer.platform}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-gray-800 bg-white p-3 rounded">
                      {installer.command}
                    </code>
                    <CopyButton text={installer.command} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {installer.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 广告位 3: 安装器卡片与 Shell 配置之间 */}
          <AdSlot slotId="download-middle" />

          {/* Shell 配置区域 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Shell 配置
            </h2>
            <p className="text-gray-600 mb-4">
              安装后，需要在 Shell 配置文件中添加以下命令。根据你使用的 Shell 选择对应的配置：
            </p>
            <div className="space-y-4">
              {shellConfigs.map((config, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {config.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-gray-800 bg-gray-50 p-3 rounded">
                      {config.command}
                    </code>
                    <CopyButton text={config.command} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                💡 提示：将配置添加到对应的 Shell 配置文件（如 ~/.zshrc、~/.bashrc 等），
                然后重新加载 Shell 或打开新终端窗口即可使用。
              </p>
            </div>
          </section>

          {/* 广告位 4: Shell 配置区域之后 */}
          <AdSlot slotId="download-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="download-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

