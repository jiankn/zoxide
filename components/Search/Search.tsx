'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Fuse from 'fuse.js';

interface SearchResult {
  type: 'blog' | 'tutorial' | 'page';
  title: string;
  description: string;
  url: string;
  locale: string; // 语言标识
  matchScore?: number; // 匹配分数（可选）
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchResult> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();

  // 从 API 获取搜索数据（跨语言搜索）
  useEffect(() => {
    const fetchSearchData = async () => {
      setIsLoading(true);
      try {
        // 启用跨语言搜索，获取所有语言的内容
        const response = await fetch(`/api/search?locale=${locale}&allLocales=true`);
        if (response.ok) {
          const { data } = await response.json();
          const searchDataArray = data as SearchResult[];
          // 初始化 Fuse.js
          const fuseInstance = new Fuse<SearchResult>(searchDataArray, {
            keys: ['title', 'description'],
            threshold: 0.3, // 匹配阈值（0-1，越小越严格）
            includeScore: true,
          });
          setFuse(fuseInstance);
        }
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSearchData();
    }
  }, [isOpen, locale]);

  // 搜索逻辑（支持跨语言，当前语言优先）
  useEffect(() => {
    if (query.trim().length === 0 || !fuse) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    
    // 转换结果并保存匹配分数
    const resultsWithScore = searchResults.map((result) => ({
      ...result.item,
      matchScore: result.score || 0,
    }));
    
    // 排序：当前语言优先，然后按匹配分数排序
    const sortedResults = resultsWithScore.sort((a, b) => {
      // 当前语言优先
      if (a.locale === locale && b.locale !== locale) return -1;
      if (a.locale !== locale && b.locale === locale) return 1;
      // 相同语言优先级时，按匹配分数排序（分数越小越好）
      return (a.matchScore || 1) - (b.matchScore || 1);
    });
    
    // 限制结果数量
    setResults(sortedResults.slice(0, 10));
    setSelectedIndex(0);
  }, [query, fuse, locale]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const selectedUrl = results[selectedIndex].url;
        // 如果 URL 已经包含语言前缀，直接跳转
        if (selectedUrl.startsWith('/zh/') || selectedUrl.startsWith('/en/')) {
          window.location.href = selectedUrl;
        } else {
          router.push(selectedUrl);
        }
        setIsOpen(false);
        setQuery('');
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // 打开搜索时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = (url: string) => {
    // 如果 URL 已经包含语言前缀（如 /zh/download），直接跳转
    // 避免 router.push() 再次添加语言前缀导致重复
    if (url.startsWith('/zh/') || url.startsWith('/en/')) {
      window.location.href = url;
    } else {
      // 如果 URL 不包含语言前缀，使用 router.push() 自动添加
    router.push(url);
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const t = useTranslations('common');
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blog':
        return t('blog');
      case 'tutorial':
        return t('tutorials');
      case 'page':
        return 'Page';
      default:
        return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'tutorial':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'page':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return '';
    }
  };

  // 获取语言标签
  const getLocaleLabel = (resultLocale: string) => {
    return resultLocale === 'zh' ? '中文' : 'English';
  };

  // 按语言分组结果
  const groupedResults = results.reduce((acc, result) => {
    const key = result.locale;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // 按当前语言优先排序分组
  const sortedGroups = Object.keys(groupedResults).sort((a, b) => {
    if (a === locale && b !== locale) return -1;
    if (a !== locale && b === locale) return 1;
    return 0;
  });

  return (
    <div className="relative" ref={searchRef}>
      {/* 搜索按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        aria-label={t('search')}
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {/* 搜索下拉框 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 z-50">
          {/* 搜索输入框 */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 搜索结果 */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="py-2">
                  {sortedGroups.map((groupLocale) => {
                    const groupResults = groupedResults[groupLocale];
                    const isCurrentLang = groupLocale === locale;
                    
                    return (
                      <div key={groupLocale} className="mb-2">
                        {/* 语言分组标题（仅当有多个语言时显示） */}
                        {sortedGroups.length > 1 && (
                          <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50">
                            {isCurrentLang ? t('currentLanguage') : getLocaleLabel(groupLocale)}
                          </div>
                        )}
                        <ul>
                          {groupResults.map((result, groupIndex) => {
                            // 计算全局索引
                            let globalIndex = 0;
                            for (let i = 0; i < sortedGroups.indexOf(groupLocale); i++) {
                              globalIndex += groupedResults[sortedGroups[i]].length;
                            }
                            globalIndex += groupIndex;
                            
                            return (
                              <li key={`${result.type}-${result.url}-${result.locale}`}>
                      <button
                        onClick={() => handleResultClick(result.url)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    globalIndex === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded ${getTypeColor(
                                  result.type
                                )}`}
                              >
                                {getTypeLabel(result.type)}
                              </span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {result.title}
                              </span>
                                        {/* 语言标签（仅当不是当前语言时显示） */}
                                        {!isCurrentLang && (
                                          <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                            {getLocaleLabel(result.locale)}
                                          </span>
                                        )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                            );
                          })}
                </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">{t('noResults')}</p>
                </div>
              )}
            </div>
          )}

          {/* 提示信息 */}
          {!query && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <p className="text-sm">加载中...</p>
              ) : (
                <>
              <p className="text-sm">{t('startSearching')}</p>
              <p className="text-xs mt-2">{t('searchHint')}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

