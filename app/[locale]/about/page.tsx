import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const t = await getTranslations('seo');
  const tAbout = await getTranslations('about');
  const locale = await getLocale();
  return generateMultilingualMetadata(
    locale,
    '/about',
    {
      title: t('titles.about'),
      description: tAbout('description'),
      keywords: t('legal'),
    }
  );
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          <AdSlot slotId="about-top" />

          <section className="prose prose-lg max-w-none">
            <h2>{t('mission.title')}</h2>
            <p>{t('mission.description')}</p>

            <h2>{t('disclaimer.title')}</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800">
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
