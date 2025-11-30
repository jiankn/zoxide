'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: '/features', label: t('links.features') },
      { href: '/download', label: t('links.download') },
      { href: '/changelog', label: t('links.changelog') },
    ],
    resources: [
      { href: '/tutorials', label: t('links.tutorials') },
      { href: '/blog', label: t('links.blog') },
      { href: '/faq', label: t('links.faq') },
    ],
    comparisons: [
      { href: '/comparisons', label: t('links.vsAutojump') },
      { href: '/comparisons', label: t('links.vsZ') },
      { href: '/comparisons', label: t('links.vsFasd') },
    ],
  };

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo 和描述 */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              zoxide
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          {/* 链接组 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('product')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('resources')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('comparisons')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.comparisons.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 法律链接 */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {t('about')}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {t('privacyPolicy')}
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {t('termsOfService')}
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
