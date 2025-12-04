'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { X, Cookie, Settings } from 'lucide-react';

type PreferenceKey = 'analytics' | 'marketing';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const getStoredPreferences = (): CookiePreferences => {
  if (typeof window === 'undefined') return defaultPreferences;

  const savedPreferences = window.localStorage.getItem('cookie-preferences');
  if (!savedPreferences) return defaultPreferences;

  try {
    const parsed = JSON.parse(savedPreferences) as Partial<CookiePreferences>;
    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch {
    return defaultPreferences;
  }
};

const shouldDisplayBanner = () => {
  if (typeof window === 'undefined') return false;
  return !window.localStorage.getItem('cookie-consent');
};

export default function CookieBanner() {
  const t = useTranslations('cookie');
  const tCommon = useTranslations('common');
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(getStoredPreferences);
  const [showSettings, setShowSettings] = useState(false);

  const isVisible = shouldDisplayBanner() || showSettings;

  const persistPreferences = (preferences: CookiePreferences) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('cookie-consent', 'accepted');
    window.localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
  };

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    persistPreferences(preferences);
    setCookiePreferences(preferences);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    persistPreferences(cookiePreferences);
    setShowSettings(false);
  };

  const handleManage = () => {
    setShowSettings(!showSettings);
  };

  const togglePreference = (type: PreferenceKey) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        {!showSettings ? (
          // 简化视图：接受和管理
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('message')}{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('privacyPolicy')}
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleManage}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  {tCommon('manage')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {tCommon('accept')}
                </button>
            </div>
          </div>
        ) : (
          // 详细设置视图
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('title')}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={tCommon('close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 必要 Cookie */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('necessary.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('necessary.description')}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">{t('necessary.alwaysEnabled')}</span>
              </div>

              {/* 分析 Cookie */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('analytics.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('analytics.description')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* 营销 Cookie */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('marketing.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('marketing.description')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {tCommon('acceptAll')}
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {tCommon('savePreferences')}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
