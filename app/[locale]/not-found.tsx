import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Home, ArrowLeft } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-[#37352F] mb-4">404</h1>
        <h2 className="font-serif text-3xl font-bold text-[#37352F] mb-4">
          {t('notFound') || 'Page Not Found'}
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('notFoundDescription') || 'The page you are looking for does not exist or has been moved.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#37352F] text-white rounded-lg hover:bg-[#2a2824] transition-colors"
          >
            <Home className="h-5 w-5" />
            {t('home') || 'Home'}
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#37352F] text-[#37352F] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('backToBlog') || 'Back to Blog'}
          </Link>
        </div>
      </div>
    </div>
  );
}

