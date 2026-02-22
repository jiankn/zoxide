'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('home');
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 移动端：先显示静态 poster，空闲时加载动画 webp
  useEffect(() => {
    // 仅移动端延迟加载动画
    if (window.innerWidth >= 1024) return;

    const loadAnimation = () => {
      const img = new window.Image();
      img.src = '/tutorial-mobile.webp';
      img.onload = () => setAnimationLoaded(true);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnimation);
    } else {
      setTimeout(loadAnimation, 200);
    }
  }, []);

  return (
    <section className="relative w-full bg-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
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

          {/* 右侧：图片 */}
          <div className="relative flex items-center justify-center order-first lg:order-last w-full max-w-full">
            <div className="relative w-full max-w-lg mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200/50 bg-white p-3 transition-transform hover:scale-[1.01]">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white">
                {/* 桌面端：直接用原图 */}
                <Image
                  src="/tutorial.webp"
                  alt="zoxide 教程演示 - 智能目录导航工具"
                  fill
                  className="object-cover hidden lg:block"
                  priority
                  fetchPriority="high"
                  quality={60}
                  sizes="45vw"
                  unoptimized
                />
                {/* 移动端：先 poster 后动画 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={animationLoaded ? '/tutorial-mobile.webp' : '/tutorial-poster.webp'}
                  alt="zoxide 教程演示 - 智能目录导航工具"
                  className="absolute inset-0 w-full h-full object-cover lg:hidden"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


