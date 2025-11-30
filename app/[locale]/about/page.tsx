import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  return {
    title: t('titles.about'),
    description: '了解 zoxide.org - zoxide 粉丝网站，提供教程、技巧和最新动态。',
    keywords: t('legal'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <AdSlot slotId="about-top" />

          <section className="prose prose-lg max-w-none dark:prose-invert">
            <h2>{t('mission.title')}</h2>
            <p>{t('mission.description')}</p>

            <h2>{t('disclaimer.title')}</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>{t('disclaimer.label')}</strong>{t('disclaimer.message')}
              </p>
            </div>

            <h2>{t('content.title')}</h2>
            <p>{t('content.description')}</p>
            <ul>
              <li><strong>{t('content.tutorials')}</strong></li>
              <li><strong>{t('content.blog')}</strong></li>
              <li><strong>{t('content.download')}</strong></li>
              <li><strong>{t('content.changelog')}</strong></li>
              <li><strong>{t('content.faq')}</strong></li>
            </ul>

            <h2>{t('opensource.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.raw('opensource.description') }} />

            <h2>{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t.raw('contact.email') }} />
              <li dangerouslySetInnerHTML={{ __html: t.raw('contact.website') }} />
              <li dangerouslySetInnerHTML={{ __html: t.raw('contact.github') }} />
            </ul>

            <h2>{t('legal.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.raw('legal.description') }} />
          </section>

          <AdSlot slotId="about-middle" />
          <AdSlot slotId="about-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="about-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
