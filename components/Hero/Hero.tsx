'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* 左侧：文字内容 */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              {t('title')}
              <span className="block text-blue-600 dark:text-blue-400">
                {t('subtitle')}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300 lg:mx-0">
              {t('description')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/download"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                <Download className="h-5 w-5" />
                {t('getStarted')}
              </Link>
              <Link
                href="/tutorials"
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                {t('viewDocs')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 右侧：图片 */}
          <div className="relative flex items-center justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-3 transition-transform hover:scale-[1.02]">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <Image
                  src="/tutorial.webp"
                  alt="zoxide 教程演示 - 智能目录导航工具"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
