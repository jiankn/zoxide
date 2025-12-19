'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Github } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Search from '@/components/Search/Search';
import { routing } from '@/i18n/routing';
import Logo from '@/components/Logo/Logo';

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

  const switchLocale = (newLocale: string) => {
    router.replace(pathname || '/', { locale: newLocale });
  };

  const isActive = (href: string) => {
    const current = pathname || '';
    const localePrefix = `/${locale}`;
    if (href === '/') {
      return current === localePrefix || current === `${localePrefix}/`;
    }
    return current.startsWith(`${localePrefix}${href}`);
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
                className={`group relative inline-flex items-center px-1 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`pointer-events-none absolute left-0 right-0 bottom-0 h-0.5 origin-left bg-blue-600 transition-all duration-300 ${
                    isActive(item.href)
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
                  className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="切换语言"
                >
                  <Globe className="h-5 w-5" />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* 反转语言列表，让英文显示在中文上面 */}
                    {[...routing.locales].reverse().map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 ${
                          locale === loc ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      >
                        {loc === 'zh' ? '中文' : 'English'}
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
                  <Globe className="mr-2 h-4 w-4" />
                  <span>{locale === 'zh' ? '中文' : 'English'}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {[...routing.locales].reverse().map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangMenuOpen(false);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 ${
                          locale === loc ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      >
                        {loc === 'zh' ? '中文' : 'English'}
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
                  className={`group relative block px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`pointer-events-none absolute left-4 right-4 bottom-1 h-0.5 origin-left bg-blue-600 transition-all duration-300 ${
                      isActive(item.href)
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
