'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Globe, Github } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import Search from '@/components/Search/Search';
import { routing } from '@/i18n/routing';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  // 防止 hydration 不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

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
    window.location.href = `/${newLocale}${pathname}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              zoxide
            </span>
          </Link>

          {/* 桌面端导航 */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 搜索功能 */}
            <Search />

            {/* GitHub 链接 */}
            <a
              href="https://github.com/ajeetdsouza/zoxide"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('github')}
            >
              <Github className="h-5 w-5" />
            </a>

            {/* 语言切换 */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-label="切换语言"
              >
                <Globe className="h-5 w-5" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50">
                  {/* 反转语言列表，让英文显示在中文上面 */}
                  {[...routing.locales].reverse().map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        switchLocale(loc);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        locale === loc ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {loc === 'zh' ? '中文' : 'English'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 主题切换 */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('toggleTheme')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="切换菜单"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

