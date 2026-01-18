'use client';

import React from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Github } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Search from '@/components/Search/Search';
import { routing } from '@/i18n/routing';
import Logo from '@/components/Logo/Logo';

// 语言名称映射表
const localeNames: Record<string, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

// 正方形国旗 SVG 组件（带圆角，颜色鲜艳）
const SquareFlagIcons: Record<string, React.JSX.Element> = {
  en: (
    <svg className="h-5 w-5 flex-shrink-0 rounded overflow-hidden" viewBox="0 0 24 24" aria-hidden="true">
      {/* 美国国旗 - 正方形版本 */}
      <defs>
        <clipPath id="flagSquareEn">
          <rect x="0" y="0" width="24" height="24" rx="3" ry="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagSquareEn)">
        {/* 红白条纹背景 */}
        <rect fill="#B22234" width="24" height="24" />
        <rect fill="#FFFFFF" y="1.85" width="24" height="1.85" />
        <rect fill="#FFFFFF" y="5.54" width="24" height="1.85" />
        <rect fill="#FFFFFF" y="9.23" width="24" height="1.85" />
        <rect fill="#FFFFFF" y="12.92" width="24" height="1.85" />
        <rect fill="#FFFFFF" y="16.62" width="24" height="1.85" />
        <rect fill="#FFFFFF" y="20.31" width="24" height="1.85" />
        {/* 蓝色区域 */}
        <rect fill="#3C3B6E" width="10" height="13" />
      </g>
      {/* 边框 */}
      <rect x="0.5" y="0.5" width="23" height="23" rx="2.5" ry="2.5" fill="none" stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  ),
  zh: (
    <svg className="h-5 w-5 flex-shrink-0 rounded overflow-hidden" viewBox="0 0 24 24" aria-hidden="true">
      {/* 中国国旗 - 正方形版本 */}
      <defs>
        <clipPath id="flagSquareZh">
          <rect x="0" y="0" width="24" height="24" rx="3" ry="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagSquareZh)">
        {/* 红色背景 */}
        <rect fill="#EE1C25" width="24" height="24" />
        {/* 大五角星 */}
        <polygon fill="#FFFF00" points="5,4 6.2,7.7 3,5.5 7,5.5 3.8,7.7" />
        {/* 小五角星 */}
        <polygon fill="#FFFF00" points="9,2 9.4,3.2 8.2,2.5 9.8,2.5 8.6,3.2" />
        <polygon fill="#FFFF00" points="11,3.5 11.4,4.7 10.2,4 11.8,4 10.6,4.7" />
        <polygon fill="#FFFF00" points="11,6 11.4,7.2 10.2,6.5 11.8,6.5 10.6,7.2" />
        <polygon fill="#FFFF00" points="9,7.5 9.4,8.7 8.2,8 9.8,8 8.6,8.7" />
      </g>
      {/* 边框 */}
      <rect x="0.5" y="0.5" width="23" height="23" rx="2.5" ry="2.5" fill="none" stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  ),
  ja: (
    <svg className="h-5 w-5 flex-shrink-0 rounded overflow-hidden" viewBox="0 0 24 24" aria-hidden="true">
      {/* 日本国旗 - 正方形版本 */}
      <defs>
        <clipPath id="flagSquareJa">
          <rect x="0" y="0" width="24" height="24" rx="3" ry="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagSquareJa)">
        <rect fill="#FFFFFF" width="24" height="24" />
        <circle cx="12" cy="12" r="6" fill="#BC002D" />
      </g>
      {/* 边框 */}
      <rect x="0.5" y="0.5" width="23" height="23" rx="2.5" ry="2.5" fill="none" stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  ),
};


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langMenuOpen]);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/features', label: t('features') },
    { href: '/tutorials', label: t('tutorials') },
    { href: '/download', label: t('download') },
    { href: '/blog', label: t('blog') },
    { href: '/changelog', label: t('changelog') },
    { href: '/faq', label: t('faq') },
    { href: '/comparisons', label: t('comparisons') },
  ];

  const switchLocale = async (newLocale: string) => {
    const currentPath = pathname || '/';

    // 检查是否在博客或教程文章详情页
    // 注意：pathname 可能带有尾部斜杠，正则需要适配
    const blogMatch = currentPath.match(/^\/blog\/([^\/]+)\/?$/);
    const tutorialMatch = currentPath.match(/^\/tutorials\/([^\/]+)\/?$/);

    if (blogMatch) {
      const slug = blogMatch[1];
      try {
        const res = await fetch(`/api/alternate-slug?slug=${slug}&locale=${newLocale}`);
        const data = await res.json();
        if (data.alternateSlug && data.alternateSlug !== slug) {
          // 有配对文章，跳转到配对的 slug
          router.replace(`/blog/${data.alternateSlug}`, { locale: newLocale });
          return;
        } else if (data.alternateSlug === null) {
          // 无配对文章，跳转到博客列表页
          router.replace('/blog', { locale: newLocale });
          return;
        }
        // alternateSlug === slug，表示该文章在目标语言可用，正常切换
      } catch {
        // 出错时跳转到博客列表页
        router.replace('/blog', { locale: newLocale });
        return;
      }
    }

    if (tutorialMatch) {
      // 教程页暂时没有配对机制，直接切换可能 404
      // 如果将来需要，可复用同样的逻辑
      // 目前保持原有行为
    }

    // 其他页面正常切换
    router.replace(currentPath, { locale: newLocale });
  };

  const isActive = (href: string) => {
    const current = pathname || '';
    if (href === '/') {
      // 对于默认语言（英文），根路径是'/'
      // 对于其他语言，根路径是'/{locale}/'
      if (locale === routing.defaultLocale) {
        return current === '/' || current === '';
      } else {
        return current === `/${locale}` || current === `/${locale}/`;
      }
    }
    // 其他页面的逻辑
    if (locale === routing.defaultLocale) {
      return current.startsWith(href);
    } else {
      return current.startsWith(`/${locale}${href}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - 防止压缩，在中等屏幕时缩小 */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0">
            <Logo size={40} className="text-[#37352F] group-hover:opacity-80 transition-opacity sm:hidden" />
            <Logo size={44} className="text-[#37352F] group-hover:opacity-80 transition-opacity hidden sm:block lg:hidden" />
            <Logo size={48} className="text-[#37352F] group-hover:opacity-80 transition-opacity hidden lg:block" />
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#37352F] whitespace-nowrap">
              zoxide
            </span>
          </Link>

          {/* 桌面端导航 - 在lg断点才显示完整导航，md时隐藏避免重叠 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6 flex-shrink min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative inline-flex items-center px-1 text-sm font-medium transition-colors ${isActive(item.href)
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                <span>{item.label}</span>
                <span
                  className={`pointer-events-none absolute left-0 right-0 bottom-0 h-0.5 origin-left bg-blue-600 transition-all duration-300 ${isActive(item.href)
                    ? 'opacity-100 scale-x-100'
                    : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                    }`}
                  style={{ transformOrigin: 'left' }}
                />
              </Link>
            ))}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 桌面端：搜索 / GitHub / 语言 - 在md断点显示 */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {/* 搜索功能（桌面端显示） */}
              <Search />

              {/* GitHub 链接（桌面端显示） */}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={t('github')}
              >
                <Github className="h-5 w-5" />
              </a>

              {/* 语言切换（桌面端显示） */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                  aria-label="切换语言"
                >
                  {SquareFlagIcons[locale] || <Globe className="h-5 w-5" />}
                  <span>{localeNames[locale] || locale}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* 语言排序：英文 -> 日文 -> 中文 */}
                    {['en', 'ja', 'zh'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 ${locale === loc ? 'bg-blue-50 font-semibold' : ''
                          }`}
                      >
                        {SquareFlagIcons[loc]}
                        <span>{localeNames[loc] || loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 移动端菜单按钮（lg以下显示，包括md断点） */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              aria-label="切换菜单"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单：包含搜索 / GitHub / 语言 + 导航链接（lg以下显示） */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-4">
            {/* 搜索（移动端放在汉堡菜单内） */}
            <div className="px-4">
              <Search />
            </div>

            {/* GitHub / 语言（移动端放在汉堡菜单内） */}
            <div className="flex items-center justify-between px-4">
              {/* GitHub */}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={t('github')}
              >
                <Github className="mr-2 h-4 w-4" />
                <span className="truncate">GitHub</span>
              </a>

              {/* 语言切换（移动端） */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="切换语言"
                >
                  {SquareFlagIcons[locale] || <Globe className="mr-2 h-4 w-4" />}
                  <span className="ml-2">{localeNames[locale] || locale}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* 语言排序：英文 -> 日文 -> 中文 */}
                    {['en', 'ja', 'zh'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangMenuOpen(false);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 ${locale === loc ? 'bg-blue-50 font-semibold' : ''
                          }`}
                      >
                        {SquareFlagIcons[loc]}
                        <span>{localeNames[loc] || loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 导航链接 */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative block px-4 py-2 text-sm font-medium transition-colors ${isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`pointer-events-none absolute left-4 right-4 bottom-1 h-0.5 origin-left bg-blue-600 transition-all duration-300 ${isActive(item.href)
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                      }`}
                    style={{ transformOrigin: 'left' }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
