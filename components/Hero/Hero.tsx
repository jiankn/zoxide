'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative w-full bg-white py-20 md:py-32 overflow-hidden">
      {/* 添加明确的容器宽度限制，确保在所有浏览器下一致 */}
      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {/* Grid 布局添加明确的宽度限制和居中对齐 */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 items-center max-w-full">
          {/* 左侧：文字内容 */}
          <div className="text-center lg:text-left relative w-full max-w-full">
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#37352F]">
              {t('title')}
              <span className="block mt-3">
                {t('subtitle')}
              </span>
            </h1>
            <p className="mx-auto mt-8 text-xl text-[#6a6968] max-w-2xl leading-relaxed font-sans lg:mx-0">
              {t('description')}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/download"
                className="flex items-center justify-center gap-2 bg-[#37352F] text-white hover:bg-[#504e49] rounded-md px-6 py-3 font-medium transition-all"
              >
                <Download className="h-5 w-5" />
                {t('getStarted')}
              </Link>
              <Link
                href="/tutorials"
                className="flex items-center justify-center gap-2 text-[#37352F] hover:bg-[#F7F6F3] rounded-md px-6 py-3 font-medium transition-all"
              >
                {t('viewDocs')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 右侧：图片 - 修复 flexbox 布局，避免内容分散到边缘 */}
          <div className="relative flex items-center justify-center order-first lg:order-last w-full max-w-full">
            <div className="relative w-full max-w-lg mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200/50 bg-white p-3 transition-transform hover:scale-[1.01]">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white">
                <Image
                  src="/tutorial.webp"
                  alt="zoxide 教程演示 - 智能目录导航工具"
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  quality={60}
                  // 更保守的首屏图片尺寸，减小移动端 LCP 体积
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 45vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
