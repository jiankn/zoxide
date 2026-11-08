import SetupJourney from '@/components/TaskGuides/SetupJourney';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { Link, routing } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { getPrimaryPaths } from '@/data/search-intents';

const englishDownloadCopy = {
  title: 'Zoxide download and install for Linux, macOS and Windows',
  description: 'Install zoxide from official upstream sources on Linux, macOS, or Windows. Verify the binary, then add the shell integration that creates z and zi.',
  upstream: 'Official upstream repository',
  installMethods: 'Choose an installation path',
  shellTitle: 'Add zoxide to your shell',
  shellDescription: 'Installing the binary does not create z or zi. Add the line for the shell you actually use, save the profile, and open a new terminal.',
  shellTip: 'Keep the initialization line near the end of the shell profile. Zsh users should place it after compinit when completions are enabled.',
};

const releaseVersion = '0.10.0';
const releaseTag = `v${releaseVersion}`;
const releaseAssetBase = `https://github.com/ajeetdsouza/zoxide/releases/download/${releaseTag}`;

const releaseGroups = [
  {
    id: 'macos',
    assets: [
      { label: 'Apple Silicon (ARM64)', file: `zoxide-${releaseVersion}-aarch64-apple-darwin.tar.gz` },
      { label: 'Intel (x86_64)', file: `zoxide-${releaseVersion}-x86_64-apple-darwin.tar.gz` },
    ],
  },
  {
    id: 'windows',
    assets: [
      { label: 'Windows ARM64', file: `zoxide-${releaseVersion}-aarch64-pc-windows-msvc.zip` },
      { label: 'Windows x86_64', file: `zoxide-${releaseVersion}-x86_64-pc-windows-msvc.zip` },
    ],
  },
  {
    id: 'linux',
    assets: [
      { label: 'Linux x86_64 (musl)', file: `zoxide-${releaseVersion}-x86_64-unknown-linux-musl.tar.gz` },
      { label: 'Linux ARM64 (musl)', file: `zoxide-${releaseVersion}-aarch64-unknown-linux-musl.tar.gz` },
      { label: 'Linux ARMv7 (musl)', file: `zoxide-${releaseVersion}-armv7-unknown-linux-musleabihf.tar.gz` },
      { label: 'Linux ARM (musl)', file: `zoxide-${releaseVersion}-arm-unknown-linux-musleabihf.tar.gz` },
      { label: 'Linux i686 (musl)', file: `zoxide-${releaseVersion}-i686-unknown-linux-musl.tar.gz` },
      { label: 'Linux RISC-V 64 (musl)', file: `zoxide-${releaseVersion}-riscv64gc-unknown-linux-musl.tar.gz` },
    ],
  },
  {
    id: 'debian',
    assets: [
      { label: 'Debian / Ubuntu AMD64', file: `zoxide_${releaseVersion}-1_amd64.deb` },
      { label: 'Debian / Ubuntu ARM64', file: `zoxide_${releaseVersion}-1_arm64.deb` },
      { label: 'Debian / Ubuntu ARMHF', file: `zoxide_${releaseVersion}-1_armhf.deb` },
      { label: 'Debian / Ubuntu i386', file: `zoxide_${releaseVersion}-1_i386.deb` },
      { label: 'Debian / Ubuntu RISC-V 64', file: `zoxide_${releaseVersion}-1_riscv64.deb` },
    ],
  },
  {
    id: 'android',
    assets: [
      { label: 'Android ARM64', file: `zoxide-${releaseVersion}-aarch64-linux-android.tar.gz` },
      { label: 'Android ARMv7', file: `zoxide-${releaseVersion}-armv7-linux-androideabi.tar.gz` },
    ],
  },
] as const;

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
  const primary = getPrimaryPaths(locale);
  setRequestLocale(locale);
  const t = await getTranslations('download');
  const copy = locale === 'zh'
    ? { guide: '查看完整安装教程 →', next: '安装完成后做什么？', nextDescription: '先验证程序和 Shell 初始化，再学习常用命令；如果失败，按诊断顺序排查。', quick: '快速上手教程', shell: 'Shell 配置教程', troubleshoot: 'command not found 排查' }
    : locale === 'ja'
      ? { guide: '詳しいインストール手順 →', next: 'インストール後の次の手順', nextDescription: 'バイナリとシェル初期化を確認してから基本コマンドへ進み、失敗した場合は順番に切り分けます。', quick: 'クイックスタート', shell: 'シェル設定', troubleshoot: 'command not found の解決' }
      : { guide: 'Open the complete install guide →', next: 'What to do after installation', nextDescription: 'Verify the binary and shell initialization, learn the core commands, or follow the diagnostic path if a check fails.', quick: 'Quick-start tutorial', shell: 'Shell setup guide', troubleshoot: 'Fix command not found' };

  const pageTitle = locale === 'en' ? englishDownloadCopy.title : t('title');
  const pageDescription = locale === 'en' ? englishDownloadCopy.description : t('description');

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/download" currentLabel={pageTitle} />
      <main className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:text-4xl">
            {pageTitle}
          </h1>
          <p className="text-base leading-7 text-gray-600 md:text-lg">
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

        <SetupJourney locale={locale} />

        <section aria-labelledby="official-release-downloads">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                  {t('releaseDownloads.officialRelease')}
                </p>
                <h2 id="official-release-downloads" className="mt-2 text-2xl font-bold text-gray-950">
                  {t('releaseDownloads.title')}
                </h2>
                <p className="mt-3 leading-7 text-gray-700">
                  {t('releaseDownloads.description', { version: releaseVersion })}
                </p>
                {/* 原更新日志页已合并到这里：给出完整版本历史的官方入口 */}
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {t('releaseDownloads.historyNote')}{' '}
                  <a
                    href="https://github.com/ajeetdsouza/zoxide/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline hover:text-blue-900"
                  >
                    {t('releaseDownloads.historyLink')}
                  </a>
                </p>
              </div>
              <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-950">zoxide {releaseTag}</div>
                <div className="mt-1">2026-07-04</div>
                <a
                  href={`https://github.com/ajeetdsouza/zoxide/releases/tag/${releaseTag}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-semibold text-blue-700 underline hover:text-blue-900"
                >
                  {t('releaseDownloads.releaseNotes')}
                </a>
              </div>
            </div>

            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              {t('releaseDownloads.recommended')}
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {releaseGroups.map((group) => (
                <article key={group.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    {t(`releaseDownloads.groups.${group.id}`)}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.assets.map((asset) => (
                      <li key={asset.file} className="flex items-start justify-between gap-4 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">{asset.label}</div>
                          <code className="mt-1 block break-all text-xs text-slate-500">{asset.file}</code>
                        </div>
                        <a
                          href={`${releaseAssetBase}/${asset.file}`}
                          className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          aria-label={`${t('releaseDownloads.download')} ${asset.label}`}
                        >
                          {t('releaseDownloads.download')}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-slate-800">{t('releaseDownloads.sourceCode')}:</span>
              <a
                href={`https://github.com/ajeetdsouza/zoxide/archive/refs/tags/${releaseTag}.zip`}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-blue-700 hover:border-blue-400"
              >
                ZIP
              </a>
              <a
                href={`https://github.com/ajeetdsouza/zoxide/archive/refs/tags/${releaseTag}.tar.gz`}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-blue-700 hover:border-blue-400"
              >
                TAR.GZ
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{copy.next}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">{copy.nextDescription}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link href={primary.quickStart} className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.quick} →</Link>
            <Link href={primary.init} className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.shell} →</Link>
            <Link href={primary.commandNotFound} className="rounded-xl border border-blue-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400">{copy.troubleshoot} →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

