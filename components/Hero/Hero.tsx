'use client';

import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { getPrimaryPaths } from '@/data/search-intents';
import TerminalDemo from './TerminalDemo';

export default function Hero() {
  const t = useTranslations('home');
  const primary = getPrimaryPaths(useLocale());

  return (
    <section className="relative w-full bg-white py-8 md:py-12 lg:py-14 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 items-center max-w-full">
          {/* 左侧：文字内容 */}
          <div className="text-center lg:text-left relative w-full min-w-0 max-w-full">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1] font-bold tracking-tight text-[#37352F]">
              {t('title')}
            </h1>
            <p className="mt-4 text-2xl md:text-3xl leading-snug font-semibold text-[#6a6968]">
              {t('subtitle')}
            </p>
            <p className="mx-auto mt-6 text-lg text-[#6a6968] max-w-2xl leading-relaxed font-sans lg:mx-0">
              {t('description')}
            </p>
            <nav aria-label={t('quickLinksLabel')} className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center lg:justify-start sm:gap-3">
              <a
                href="#install-zoxide"
                className="flex min-h-12 items-center justify-center bg-[#37352F] text-white hover:bg-[#504e49] rounded-md px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                {t('quickInstall')}
              </a>
              <a
                href="#zoxide-troubleshooting"
                className="flex min-h-12 items-center justify-center text-[#37352F] hover:bg-[#F7F6F3] rounded-md border border-gray-300 px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                {t('quickTroubleshoot')}
              </a>
              <Link
                href={primary.commands}
                className="flex min-h-12 items-center justify-center text-[#37352F] hover:bg-[#F7F6F3] rounded-md border border-gray-300 px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                {t('quickCommands')}
              </Link>
            </nav>
            <p className="mt-4 text-sm leading-6 text-[#6a6968]">
              {t('independentNote')}{' '}
              <a href="https://github.com/ajeetdsouza/zoxide" className="text-blue-700 underline underline-offset-4">{t('officialProject')}</a>
            </p>
          </div>

          {/* 右侧：终端动画演示 */}
          <div className="relative flex min-w-0 items-center justify-center w-full max-w-full">
            <TerminalDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
