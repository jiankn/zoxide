import AdSlot from '@/components/AdSlot/AdSlot';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const tDownload = await getTranslations('download');
  return {
    title: t('titles.download'),
    description: tDownload('description'),
    keywords: t('install'),
  };
}

export default async function DownloadPage() {
  const t = await getTranslations('download');

  const installers = [
    {
      name: 'Homebrew',
      platform: t('installers.homebrew.platform'),
      command: 'brew install zoxide',
      description: t('installers.homebrew.description'),
    },
    {
      name: 'Scoop',
      platform: t('installers.scoop.platform'),
      command: 'scoop install zoxide',
      description: t('installers.scoop.description'),
    },
    {
      name: 'Cargo',
      platform: t('installers.cargo.platform'),
      command: 'cargo install zoxide',
      description: t('installers.cargo.description'),
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
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('description')}{' '}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('githubLink')}
              </a>
              {'.'}
            </p>
          </div>

          <AdSlot slotId="download-top" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('installMethods.title')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {installers.map((installer, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-serif font-bold text-lg text-[#37352F] dark:text-gray-100 mb-2">
                    {installer.platform}
                  </h3>
                  <CodeBlock 
                    code={installer.command}
                    language="bash"
                    showPrompt={true}
                  />
                  <p className="text-xs text-[#787774] dark:text-gray-400">
                    {installer.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <AdSlot slotId="download-middle" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('shellConfig.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('shellConfig.description')}
            </p>
            <div className="space-y-4">
              {shellConfigs.map((config, index) => {
                // 根据 Shell 类型确定语言和提示符
                const language = config.name === 'PowerShell' ? 'powershell' : 
                               config.name === 'fish' ? 'fish' : 'bash';
                const prompt = config.name === 'PowerShell' ? 'PS C:\\>' : 'user@dev:~$';
                
                return (
                  <div key={index} className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-[#37352F] dark:text-gray-100 mb-2">
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
            <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {t('shellConfig.tip')}
              </p>
            </div>
          </section>

          <AdSlot slotId="download-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="download-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
