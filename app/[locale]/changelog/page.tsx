import { getTranslations, setRequestLocale } from 'next-intl/server';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

type VersionChange = {
  type: string;
  content: string;
};

type ChangelogVersion = {
  version: string;
  date: string;
  changes: VersionChange[];
};

type ChangelogMessages = {
  changelog?: {
    versions?: ChangelogVersion[];
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tChangelog = await getTranslations('changelog');
  return generateMultilingualMetadata(
    locale,
    '/changelog',
    {
      title: t('titles.changelog'),
      description: tChangelog('description'),
      keywords: t('changelog'),
    }
  );
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('changelog');
  const messagesMap: Record<string, ChangelogMessages> = { zh: zhMessages, en: enMessages, ja: jaMessages };
  const messages: ChangelogMessages = messagesMap[locale] || enMessages;
  const versions = messages.changelog?.versions ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('description')}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            {locale === 'zh'
              ? '版本信息核对自 zoxide 官方 GitHub Releases；本页为独立社区整理。'
              : locale === 'ja'
                ? 'バージョン情報は zoxide 公式 GitHub Releases と照合しています。このページは独立したコミュニティ編集です。'
                : 'Version details are checked against the official zoxide GitHub Releases. This page is independently maintained.'}{' '}
            <a
              href="https://github.com/ajeetdsouza/zoxide/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              GitHub Releases
            </a>
          </p>
        </div>

        <div className="space-y-8">
          {versions.map((version, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  v{version.version}
                </h2>
                <span className="text-sm text-gray-500">
                  {version.date}
                </span>
              </div>
              <ul className="space-y-2">
                {version.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start gap-2">
                    <span className="mt-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {change.type}
                    </span>
                    <span className="text-gray-600">
                      {change.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

