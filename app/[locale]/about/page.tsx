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
  const tAbout = await getTranslations('about');
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const internalLinkCopy = locale === 'zh'
    ? { website: '网站：', legalPrefix: '请查看我们的', privacy: '隐私政策', conjunction: '和', terms: '服务条款' }
    : locale === 'ja'
      ? { website: 'ウェブサイト：', legalPrefix: '', privacy: 'プライバシーポリシー', conjunction: 'と', terms: '利用規約' }
      : { website: 'Website: ', legalPrefix: 'Please see our', privacy: 'Privacy Policy', conjunction: 'and', terms: 'Terms of Service' };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs locale={locale} path="/about" currentLabel={t('title')} />
      <main className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('description')}
          </p>
        </div>

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
            <li>{internalLinkCopy.website}<Link href="/">zoxide.org</Link></li>
            <li dangerouslySetInnerHTML={{ __html: t.raw('contact.github') }} />
          </ul>

          <h2>{t('legal.title')}</h2>
          <p>
            {internalLinkCopy.legalPrefix}{' '}
            <Link href="/privacy-policy" className="text-blue-600 underline hover:text-blue-800">{internalLinkCopy.privacy}</Link>{' '}
            {internalLinkCopy.conjunction}{' '}
            <Link href="/terms-of-service" className="text-blue-600 underline hover:text-blue-800">{internalLinkCopy.terms}</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}

