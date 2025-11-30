'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('disclaimer');

  useEffect(() => {
    // 检查是否已经关闭过
    const dismissed = localStorage.getItem('disclaimer-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('disclaimer-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 flex-1">
            <strong>{t('label')}</strong> {t('message')}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100 transition-colors"
            aria-label={t('closeLabel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
