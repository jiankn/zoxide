'use client';

import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { getPrimaryPaths } from '@/data/search-intents';
import Logo from '@/components/Logo/Logo';
import GoogleConsentSettings from '@/components/GoogleConsentSettings/GoogleConsentSettings';
import { Github } from 'lucide-react';

type FooterLink = { href: string; label: string };

// 页脚一栏：标题 + 链接列表；extra 用于放 Cookie 设置这类按钮
function FooterColumn({ title, links, extra }: { title: string; links: FooterLink[]; extra?: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-white/80 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  // 动态年份范围：起始年-当前年，如果相同只显示起始年
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearRange = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

  const columns: { title: string; links: FooterLink[]; extra?: React.ReactNode }[] = [
    {
      title: t('product'),
      links: [
        { href: '/download', label: t('links.download') },
        { href: '/tools/zoxide-doctor', label: t('links.doctor') },
      ],
    },
    {
      title: t('resources'),
      links: [
        { href: '/tutorials', label: t('links.tutorials') },
        { href: '/blog', label: t('links.blog') },
        { href: '/faq', label: t('links.faq') },
      ],
    },
    {
      title: t('comparisons'),
      links: [
        { href: '/blog/zoxide-vs-autojump', label: t('links.vsAutojump') },
        { href: getPrimaryPaths(locale).alternatives, label: t('links.alternatives') },
      ],
    },
    {
      // 原来单独一条的“关于 / 隐私 / 条款 / 联系”并入栏目
      title: t('site'),
      links: [
        { href: '/about', label: t('about') },
        { href: '/privacy-policy', label: t('privacyPolicy') },
        { href: '/terms-of-service', label: t('termsOfService') },
        { href: '/contact', label: t('contact') },
      ],
      extra: <GoogleConsentSettings />,
    },
  ];

  return (
    <footer className="border-t-[6px] border-[var(--line-zsh)] bg-ink text-white">
      <div className="container mx-auto max-w-7xl px-4 pb-6 pt-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-6">
          {/* Logo、描述、非官方声明 */}
          <div className="col-span-2 space-y-3 md:pr-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <Logo size={48} className="transition-opacity group-hover:opacity-80" />
              <span className="text-2xl font-bold tracking-tight text-white">zoxide</span>
            </Link>
            <p className="text-sm text-white/80">{t('description')}</p>
            {/* 非官方声明：服务端渲染进每页 HTML，避免被误认为 zoxide 官方网站 */}
            <p className="text-sm text-white/80">
              <span className="font-semibold text-white">{t('unofficialLabel')}</span> {t('disclaimer')}
            </p>
            <a
              href="https://github.com/ajeetdsouza/zoxide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              {t('officialLink')}
            </a>
          </div>

          {columns.map((col) => (
            <FooterColumn key={col.title} {...col} />
          ))}
        </div>

        <p className="mt-10 border-t border-white/15 pt-5 text-xs text-white/60">
          {t('copyright', { yearRange })}
        </p>
      </div>
    </footer>
  );
}
