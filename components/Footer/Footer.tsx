'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Logo from '@/components/Logo/Logo';

export default function Footer() {
  const t = useTranslations('footer');

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
    <footer className="border-t border-transparent bg-gradient-to-r from-[#0b1f4b] via-[#0f2f6b] to-[#123a7f] text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo 和描述 */}
          <div className="col-span-1 md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Logo size={48} className="text-white group-hover:opacity-80 transition-opacity" />
              <span className="text-2xl font-bold tracking-tight text-white">zoxide</span>
            </Link>
            <p className="text-sm text-white/80">
              {t('description')}
            </p>
          </div>

          {/* 链接区 */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t('product')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {t('resources')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {t('comparisons')}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.comparisons.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 法律链接 */}
        <div className="mt-8 border-t border-white/30 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-white/80 hover:text-white"
            >
              {t('about')}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-white/80 hover:text-white"
            >
              {t('privacyPolicy')}
            </Link>
            <Link
              href="/terms-of-service"
              className="text-white/80 hover:text-white"
            >
              {t('termsOfService')}
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-white/70">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
