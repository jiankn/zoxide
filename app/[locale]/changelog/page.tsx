import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getLocale } from 'next-intl/server';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
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

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const locale = await getLocale();
  return generateMultilingualMetadata(
    locale,
    '/changelog',
    {
      title: t('titles.changelog'),
      description: '查看 zoxide 的版本更新历史，了解新功能、修复和性能优化。',
      keywords: t('changelog'),
    }
  );
}

export default async function ChangelogPage() {
  const t = await getTranslations('changelog');
  const locale = await getLocale();
  const messages: ChangelogMessages = locale === 'zh' ? zhMessages : enMessages;
  const versions = messages.changelog?.versions ?? [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          <AdSlot slotId="changelog-top" />

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

          <AdSlot slotId="changelog-middle" />
          <AdSlot slotId="changelog-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="changelog-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
